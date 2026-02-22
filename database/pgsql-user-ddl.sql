
-- connect as fiscalismia by e.g. calling psql -c "\c fiscalismia"
SET client_encoding TO 'UTF8';

-- TEST
DROP TABLE IF EXISTS test_table;
-- FIXED COSTS
DROP TABLE IF EXISTS fixed_costs;
-- INCOME
DROP TABLE IF EXISTS fixed_income;
-- VARIABLE EXPENSES
DROP TABLE IF EXISTS staging_variable_bills;
DROP TABLE IF EXISTS bridge_var_exp_sensitivity;
DROP TABLE IF EXISTS variable_expenses;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS sensitivity;
-- DEALS & DISCOUNTS
DROP VIEW IF EXISTS v_food_price_overview;
DROP TRIGGER IF EXISTS delete_food_item_discount_trigger ON table_food_prices;
DROP FUNCTION IF EXISTS delete_food_item_discount_trigger_function();
DROP TABLE IF EXISTS food_price_discounts;
DROP TABLE IF EXISTS food_price_image_location;
DROP TABLE IF EXISTS table_food_prices;
DROP SEQUENCE IF EXISTS table_food_prices_seq;
-- INVESTMENTS
DROP VIEW IF EXISTS v_investment_dividends;
DROP TABLE IF EXISTS bridge_investment_dividends;
DROP TABLE IF EXISTS investment_taxes;
DROP TABLE IF EXISTS investment_dividends;
DROP TABLE IF EXISTS investments;
/*___  ___  __  ___
   |  |__  /__`  |
   |  |___ .__/  |
 */

CREATE TABLE IF NOT EXISTS test_table
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS test_table
    OWNER to fiscalismia_api;

--     ___        ___  __      __   __   __  ___  __
--    |__  | \_/ |__  |  \    /  ` /  \ /__`  |  /__`
--    |    | / \ |___ |__/    \__, \__/ .__/  |  .__/

CREATE TABLE IF NOT EXISTS fixed_costs
(
    id serial NOT NULL,
    category character varying(128) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    monthly_interval numeric(4,2) NOT NULL,
    billed_cost numeric(7,2) NOT NULL,
    monthly_cost numeric(7,2) NOT NULL,
    effective_date date NOT NULL,
	expiration_date date NOT NULL,
    PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS fixed_costs
    OWNER to fiscalismia_api;
COMMENT ON TABLE fixed_costs IS 'contains fixed costs being paid regularly, their billing interval and categories for filtering and displaying';

--          __   __         ___
--  | |\ | /  ` /  \  |\/| |__
--  | | \| \__, \__/  |  | |___

CREATE TABLE IF NOT EXISTS fixed_income
(
    id serial NOT NULL,
    description character varying(128) COLLATE pg_catalog."default" NOT NULL,
    type character varying(64) COLLATE pg_catalog."default" NOT NULL,
    monthly_interval numeric(4,2) NOT NULL,
    value numeric(7,2) NOT NULL,
    effective_date date NOT NULL,
	expiration_date date NOT NULL,
    PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS fixed_income
    OWNER to fiscalismia_api;
COMMENT ON TABLE fixed_income IS 'contains fixed income being earned regularly, payment interval and type (gross/net)';


CREATE TABLE IF NOT EXISTS investments
(
    id serial NOT NULL,
    execution_type character varying(4) COLLATE pg_catalog."default" NOT NULL,
    description character varying(256) COLLATE pg_catalog."default" NOT NULL,
    isin character varying(12) COLLATE pg_catalog."default" NOT NULL,
    investment_type character varying(32) NOT NULL,
    marketplace character varying(64) NOT NULL,
    units numeric(9,0) NOT NULL,
    price_per_unit numeric(8,3) NOT NULL,
    total_price numeric(8,3) NOT NULL,
    fees numeric(6,3) NOT NULL,
	execution_date date NOT NULL,
    PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS investments
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS investments ADD CONSTRAINT uk_investments UNIQUE (execution_type, isin, execution_date);
COMMENT ON TABLE investments IS 'contains relevant information to personal investments conducted such as stock listings';

CREATE TABLE IF NOT EXISTS investment_dividends
(
    id serial NOT NULL,
    isin character varying(12) COLLATE pg_catalog."default" NOT NULL,
    dividend_amount numeric(6,2) NOT NULL,
	dividend_date date NOT NULL,
    PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS investment_dividends
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS investment_dividends ADD CONSTRAINT uk_investment_dividends UNIQUE (isin, dividend_date);
COMMENT ON TABLE investment_dividends IS 'contains individual dividends on a given date and the corresponding isin for uniqueness guarantees';

CREATE TABLE IF NOT EXISTS investment_taxes
(
    investment_id integer,
    dividend_id integer,
    pct_of_profit_taxed numeric(6,3) NOT NULL DEFAULT 100.000,
    profit_amt numeric(7,3) NOT NULL,
    tax_rate numeric(5,3) DEFAULT 26.375 NOT NULL, -- 75.625 is profit
    tax_paid numeric(7,3) NOT NULL,
    tax_year numeric(4,0) NOT NULL
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS investment_taxes
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS investment_taxes ADD CONSTRAINT uk_investment_taxes UNIQUE (investment_id);
ALTER TABLE IF EXISTS investment_taxes ADD CONSTRAINT uk_dividend_taxes UNIQUE (dividend_id);
ALTER TABLE IF EXISTS investment_taxes
    ADD CONSTRAINT "taxed_investments_fk" FOREIGN KEY (investment_id)
    REFERENCES investments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS investment_taxes
	ADD CONSTRAINT "taxed_dividends_fk" FOREIGN KEY (dividend_id)
    REFERENCES investment_dividends (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
COMMENT ON TABLE investment_taxes IS 'contains foreign keys to investments OR dividends
and the percentage of tax deductions, which can be zero if the yearly allowance has not been surpassed.';

CREATE TABLE IF NOT EXISTS bridge_investment_dividends
(
    investment_id integer NOT NULL,
    dividend_id integer NOT NULL,
    remaining_units numeric(9,0) DEFAULT 0 NOT NULL
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS bridge_investment_dividends
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS bridge_investment_dividends ADD CONSTRAINT uk_bridge_investment_dividends UNIQUE (investment_id, dividend_id);
ALTER TABLE IF EXISTS bridge_investment_dividends
    ADD CONSTRAINT "bridge_dividends_investment_fk" FOREIGN KEY (investment_id)
    REFERENCES investments (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS bridge_investment_dividends
    ADD CONSTRAINT "bridge_investment_dividends_fk" FOREIGN KEY (dividend_id)
    REFERENCES investment_dividends (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
COMMENT ON TABLE bridge_investment_dividends IS 'contains FKs to invements & FKs to dividends to match multiple owned stocks of the same ISIN to a single dividend payment. REMAINING_UNITS retains info on partially sold stocks';

CREATE OR REPLACE VIEW  v_investment_dividends
AS
    SELECT
        div.id,
        div.isin,
        div.dividend_amount::double precision,
        COUNT(*) AS cnt,
        round(round(div.dividend_amount / SUM(total_price), 4) * 100::NUMERIC,2)::double precision  AS pct_of_total,
        MAX(inv.description) AS description,
        SUM(inv.price_per_unit * inv_div.remaining_units)/SUM(inv_div.remaining_units)::double precision AS avg_ppu,
        SUM(inv_div.remaining_units)::numeric AS units,
        SUM(inv.price_per_unit * inv_div.remaining_units)::double precision AS total_price,
        SUM(fees)::double precision AS fees,
        div.dividend_date,
        STRING_AGG(inv_div.investment_id::varchar, ',' ORDER BY investment_id) AS investments
    FROM bridge_investment_dividends inv_div
    JOIN investment_dividends div ON div.id = inv_div.dividend_id
    JOIN investments inv ON inv.id = inv_div.investment_id
    WHERE inv.execution_type = 'buy'
    GROUP BY div.id, div.isin, div.dividend_amount, div.dividend_date
;
ALTER TABLE v_investment_dividends
    OWNER TO fiscalismia_api;
COMMENT ON VIEW v_investment_dividends
    IS 'view showing aggregated investment purchases and their resulting dividend yield';

--     __   ___            __                __      __     __   __   __            ___  __
--    |  \ |__   /\  |    /__`     /\  |\ | |  \    |  \ | /__` /  ` /  \ |  | |\ |  |  /__`
--    |__/ |___ /~~\ |___ .__/    /~~\ | \| |__/    |__/ | .__/ \__, \__/ \__/ | \|  |  .__/
CREATE SEQUENCE IF NOT EXISTS table_food_prices_seq;
ALTER TABLE IF EXISTS table_food_prices_seq
    OWNER to fiscalismia_api;
CREATE TABLE IF NOT EXISTS table_food_prices
(
    dimension_key integer NOT NULL,
    food_item character varying(256) COLLATE pg_catalog."default" NOT NULL,
    brand character varying(124) COLLATE pg_catalog."default",
    store character varying(64) COLLATE pg_catalog."default",
    main_macro character varying(32) COLLATE pg_catalog."default" NOT NULL,
    kcal_amount numeric(4,0) NOT NULL,
    weight numeric(5,0) NOT NULL,
    price numeric(5,2) NOT NULL,
    last_update date,
	effective_date date NOT NULL,
	expiration_date date NOT NULL,
    CONSTRAINT "food_prices_pkey" PRIMARY KEY (dimension_key, effective_date)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS table_food_prices
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS table_food_prices ADD CONSTRAINT uk_food_items UNIQUE (food_item, brand, store, price, expiration_date);
COMMENT ON TABLE table_food_prices IS
'contains individual food items, the store they are sold in, the macro they belong to,
price and caloric information. A last_update flag indicated the date where prices were last confirmed.';

CREATE TABLE IF NOT EXISTS food_price_discounts
(
	food_prices_dimension_key integer NOT NULL,
    discount_price numeric(5,2) NOT NULL,
	discount_start_date date NOT NULL,
	discount_end_date date NOT NULL,
    CONSTRAINT "food_price_discounts_pkey" PRIMARY KEY (food_prices_dimension_key, discount_start_date)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS food_price_discounts
    OWNER to fiscalismia_api;
COMMENT ON TABLE food_price_discounts IS
'contains the discount price, start date and end date of food items referenced dimension_key only
in order to be applicable to all effective_dates within food_prices.';

CREATE OR REPLACE FUNCTION delete_food_item_discount_trigger_function()
    RETURNS TRIGGER AS $$
BEGIN
    -- Check if ANY row with the deleted dimension_key still exists in table_food_prices.
    IF NOT EXISTS (
        SELECT 1
        FROM table_food_prices
        WHERE dimension_key = OLD.dimension_key
    ) THEN
        -- If NO rows exist, delete the related records in food_price_discounts.
        DELETE FROM food_price_discounts
        WHERE food_prices_dimension_key = OLD.dimension_key;
    END IF;

    -- Always return NULL because the deletion of the OLD row has already happened.
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION delete_food_item_discount_trigger_function() IS
'If all Food Items of a single dimension_key have been deleted
then cascade this delete to all discounts.
Cannot be done with FK constraint because of the composite key nature
of food items which include effective dates with no relation to discounts';

CREATE OR REPLACE TRIGGER delete_food_item_discount_trigger
AFTER DELETE ON table_food_prices
FOR EACH ROW
EXECUTE FUNCTION delete_food_item_discount_trigger_function();


CREATE TABLE IF NOT EXISTS food_price_image_location
(
	food_prices_dimension_key integer NOT NULL,
    filepath character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT "food_price_filepaths_pkey" PRIMARY KEY (food_prices_dimension_key)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS food_price_image_location
    OWNER to fiscalismia_api;
COMMENT ON TABLE food_price_image_location IS 'contains the relative filepath on the server to user uploaded food item images.';

CREATE OR REPLACE VIEW v_food_price_overview
AS
    SELECT food.dimension_key AS id,
        food.food_item,
        food.brand,
        food.store,
        food.main_macro,
        food.kcal_amount,
        food.weight,
        food.price::double precision,
        food.last_update,
        food.effective_date,
        food.expiration_date,
        discounts.discount_price::double precision,
        (food.price - discounts.discount_price)::double precision AS reduced_by_amount,
        round((food.price - discounts.discount_price) / food.price, 2) * 100::numeric AS reduced_by_pct,
        discounts.discount_start_date,
        discounts.discount_end_date,
        discounts.discount_start_date - CURRENT_DATE AS starts_in_days,
        discounts.discount_end_date - CURRENT_DATE AS ends_in_days,
        discounts.discount_end_date - discounts.discount_start_date AS discount_days_duration,
        CASE food.kcal_amount
            WHEN 0 THEN NULL
            ELSE round(100::numeric / food.kcal_amount * 100::numeric, 2)::double precision
        END AS weight_per_100_kcal,
        CASE food.weight
            WHEN 0 THEN NULL
            ELSE round(1000::numeric / food.weight * food.price, 2)::double precision
        END AS price_per_kg,
        CASE food.kcal_amount
            WHEN 0 THEN NULL
            ELSE round(100::numeric / food.kcal_amount * 100::numeric / food.weight * food.price * 35::numeric, 2)::double precision
        END AS normalized_price,
        filepaths.filepath
    FROM table_food_prices food
        LEFT JOIN food_price_discounts discounts ON food.dimension_key = discounts.food_prices_dimension_key
        LEFT JOIN food_price_image_location filepaths ON food.dimension_key = filepaths.food_prices_dimension_key;

ALTER TABLE v_food_price_overview
    OWNER TO fiscalismia_api;
COMMENT ON VIEW v_food_price_overview
    IS 'synthesized information for displaying food prices, discounts and derived calculations to frontend user';

--               __          __        ___     ___      __   ___       __   ___  __
--    \  /  /\  |__) |  /\  |__) |    |__     |__  \_/ |__) |__  |\ | /__` |__  /__`
--     \/  /~~\ |  \ | /~~\ |__) |___ |___    |___ / \ |    |___ | \| .__/ |___ .__/

CREATE TABLE IF NOT EXISTS staging_variable_bills
(
    id serial NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category character varying(100) NOT NULL,
    store character varying(100) NOT NULL,
    cost numeric(6,2) NOT NULL,
    purchasing_date date NOT NULL,
    is_planned character varying(1),
    contains_indulgence character varying(1),
    sensitivities character varying(255) COLLATE pg_catalog."default"
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS staging_variable_bills
    OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS staging_variable_bills ADD CONSTRAINT uk_variable_expense_stg UNIQUE (category,store,cost,purchasing_date);



CREATE TABLE category
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS category OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS category ADD CONSTRAINT uk_category UNIQUE (description);
COMMENT ON TABLE category IS 'contains variable_expenses categories such as Groceries, Leisure, Work and Travel';

CREATE TABLE store
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    is_online boolean DEFAULT FALSE,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS store OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS store ADD CONSTRAINT uk_store UNIQUE (description);
COMMENT ON TABLE store IS 'contains variable_expenses stores such as Lidl, Amazon and generic Cafes';

CREATE TABLE sensitivity
(
    id serial NOT NULL,
    description character varying(100) NOT NULL,
    severity_rating smallint,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS sensitivity OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS sensitivity ADD CONSTRAINT uk_sensitivity UNIQUE (description);
COMMENT ON TABLE sensitivity IS 'contains variable_expenses food allergies and sensitivities that are typically bought as an indulgence despite being detrimental to my health';

CREATE TABLE IF NOT EXISTS variable_expenses
(
    id serial NOT NULL ,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    category_id integer NOT NULL,
    store_id integer NOT NULL,
    cost numeric(6,2) NOT NULL,
    purchasing_date date NOT NULL DEFAULT CURRENT_DATE,
    is_planned boolean,
    contains_indulgence boolean,
    CONSTRAINT "variable_expenses_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS variable_expenses OWNER to fiscalismia_api;
COMMENT ON TABLE variable_expenses IS 'contains daily expenses such as groceries, purchases for leisure time, health and medical expenses';
ALTER TABLE IF EXISTS variable_expenses
    ADD CONSTRAINT "var_exp_cat" FOREIGN KEY (category_id)
    REFERENCES category (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS variable_expenses
    ADD CONSTRAINT "var_exp_store" FOREIGN KEY (store_id)
    REFERENCES store (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS variable_expenses ADD CONSTRAINT uk_variable_expenses UNIQUE (category_id,store_id,cost,purchasing_date);

CREATE TABLE IF NOT EXISTS bridge_var_exp_sensitivity
(
    id serial NOT NULL ,
    variable_expense_id integer NOT NULL,
    sensitivity_id integer NOT NULL,
    CONSTRAINT "bridge_var_exp_sensitivity_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS bridge_var_exp_sensitivity OWNER to fiscalismia_api;
ALTER TABLE IF EXISTS bridge_var_exp_sensitivity
    ADD CONSTRAINT "b_var_exp_sens_to_sens" FOREIGN KEY (sensitivity_id)
    REFERENCES sensitivity (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
ALTER TABLE IF EXISTS bridge_var_exp_sensitivity
    ADD CONSTRAINT "b_var_exp_sens_to_exp" FOREIGN KEY (variable_expense_id)
    REFERENCES variable_expenses (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
COMMENT ON TABLE bridge_var_exp_sensitivity IS 'links variable expenses to sensitivities as this is a m:n relationship';

/*  ___ ___
   |__   |  |
   |___  |  |___
 */

CREATE OR REPLACE FUNCTION ETL_VARIABLE_EXPENSES()
RETURNS TABLE (table_name text, inserted_count bigint) AS
$$
DECLARE
    s record; -- one s for each row in staging_variable_bills
    f record; -- one f for each individual sensitivity in staging_variable_bills.sensitivities delimited by ','
    insert_count_category              bigint DEFAULT 0;
    insert_count_store                 bigint DEFAULT 0;
    insert_count_sensitivity           bigint DEFAULT 0;
    insert_count_variable_expenses     bigint DEFAULT 0;
    insert_count_bridge_sensitivities  bigint DEFAULT 0;
BEGIN
    -- Insert CATEGORIES not yet present in DB
    INSERT INTO category (description)  (
        SELECT
            INITCAP(stg.category) as description
        FROM staging_variable_bills stg
        WHERE stg.category NOT IN (
            SELECT description
            FROM category
        )
        GROUP BY stg.category
    );
    GET DIAGNOSTICS insert_count_category = ROW_COUNT;
    -- Insert STORES not yet present in DB
    INSERT INTO store (description)  (
        SELECT
            INITCAP(stg.store) as description
        FROM staging_variable_bills stg
        WHERE stg.store NOT IN (
            SELECT description
            FROM store
        )
        GROUP BY stg.store
    );
    GET DIAGNOSTICS insert_count_store = ROW_COUNT;
    -- Insert SENSITIVITIES not yet present in DB
    INSERT INTO sensitivity (description,severity_rating) (
        SELECT
            split.sensitivity as description,
            NULL as severity_rating
        FROM (
            SELECT DISTINCT
                -- 1) split comma separated string into array.
                -- 2) unnest array into tuples.
                -- 3) transform string (trim, lowercase)
                LOWER(TRIM(unnest(string_to_array(stg.sensitivities, ',')))) AS sensitivity
            FROM staging_variable_bills stg
            ) split
        WHERE sensitivity NOT IN (
            SELECT description
            FROM sensitivity
        )
    );
    GET DIAGNOSTICS insert_count_sensitivity = ROW_COUNT;
    -- Insert VARIABLE_EXPENSES
    INSERT INTO variable_expenses (description, category_id, store_id, cost, purchasing_date, is_planned, contains_indulgence) (
        SELECT
            stg.description,
            (SELECT id FROM category WHERE description = stg.category) as category_id,
            (SELECT id FROM store WHERE description = stg.store) as store_id,
            stg.cost,
            stg.purchasing_date,
            CASE WHEN stg.is_planned = 'J' THEN TRUE
                WHEN stg.is_planned = 'N' THEN FALSE
                ELSE FALSE
            END is_planned,
            CASE WHEN stg.contains_indulgence = 'J' THEN TRUE
                WHEN stg.contains_indulgence = 'N' THEN FALSE
                ELSE FALSE
            END contains_indulgence
        FROM staging_variable_bills stg
    );
    GET DIAGNOSTICS insert_count_variable_expenses = ROW_COUNT;
    -- Insert BRIDGE_VAR_EXP_SENSITIVITY
	for s in select * from staging_variable_bills
	loop
		for f in
            SELECT DISTINCT
                -- 1) split comma separated string into array.
			    -- 2) unnest array into tuples.
			    -- 3) transform string (trim, lowercase)
                LOWER(TRIM(unnest(string_to_array(stg.sensitivities, ',')))) as sensitivity
		    FROM staging_variable_bills stg
		    WHERE stg.id = s.id
		loop
		--raise notice '|%|%|%|%| ==> %', s.category, s.store, s.cost, s.purchasing_date, f.sensitivity;
		INSERT INTO bridge_var_exp_sensitivity (variable_expense_id, sensitivity_id) VALUES
		(
            (SELECT id
            FROM variable_expenses
            WHERE cost = s.cost
                AND purchasing_date = s.purchasing_date
                AND category_id = (
                    SELECT id FROM category WHERE description = s.category)
                AND store_id = (
                    SELECT id FROM store WHERE description = s.store)
            ) ,
                (SELECT id
                FROM sensitivity
                WHERE description = f.sensitivity) )
		;
        insert_count_bridge_sensitivities := insert_count_bridge_sensitivities + 1;
		end loop;
	end loop;

    RETURN QUERY VALUES
    ('category: ', insert_count_category),
    ('store: ', insert_count_store),
    ('sensitivity: ', insert_count_sensitivity),
    ('variable_expenses: ', insert_count_variable_expenses),
    ('bridge_var_exp_sensitivity: ', insert_count_bridge_sensitivities);
end;
$$ LANGUAGE plpgsql;

--          ___  __     ___         __   __           __       ___  __       ___
--    \  / |__  |__) | |__  \ /    |  \ |  \ |       /  \ |  |  |  |__) |  |  |
--     \/  |___ |  \ | |     |     |__/ |__/ |___    \__/ \__/  |  |    \__/  |

select '###################################################' as begin_verification;
-- search path
show search_path;
-- tables
SELECT
    schemaname, COUNT(tablename) as table_count
FROM pg_catalog.pg_tables
group by schemaname;
-- triggers
SELECT
    trigger_schema as schema,
    trigger_name as trigger,
    event_object_table as table
FROM
    information_schema.triggers;
-- functions
SELECT
    routine_catalog, specific_schema as schema, specific_name as function
FROM
    information_schema.routines
where routine_type = 'FUNCTION'
and specific_schema like 'private_%';
select '###################################################' as end_verification;