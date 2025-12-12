#!/usr/bin/env bash
PG_CONNECTION="-U fiscalismia_api -d fiscalismia -v ON_ERROR_STOP=1"
USER_SCHEMA="private_admin"
SEARCH_PATH_CMD="SET search_path TO $USER_SCHEMA"

# set user schema and set search_path to initial admin credentials for development, then call DDL
psql $PG_CONNECTION <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS $USER_SCHEMA AUTHORIZATION fiscalismia_api;
    GRANT ALL ON SCHEMA $USER_SCHEMA TO fiscalismia_api;
EOSQL

# DDL (Data Definition Language) is used to define the structure of the database, such as creating tables, sequences, constraints.
psql $PG_CONNECTION -f initialize/pgsql-public-ddl.sql
psql $PG_CONNECTION -c "$SEARCH_PATH_CMD;" -f initialize/pgsql-user-ddl.sql

# inserts initial admin credentials and user settings for development
psql $PG_CONNECTION <<-EOSQL
    SET client_encoding TO 'UTF8';

    INSERT INTO public.um_users (username, email, password, schema) VALUES
    ('admin',
    'herp_derp@hotmail.com',
    crypt( 'changeit', gen_salt('bf',12)),
    'private_admin'
    );

    INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
    VALUES (
        (SELECT id FROM public.um_users WHERE username = 'admin'),
        'selected_mode',
        'light',
        null);

    INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
    VALUES (
        (SELECT id FROM public.um_users WHERE username = 'admin'),
        'selected_palette',
        'default',
        null);

    INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
    VALUES (
        (SELECT id FROM public.um_users WHERE username = 'admin'),
        'selected_language',
        'en_US',
        null);
EOSQL
# DML (Data Manipulation Language) is used to populate the db with INSERT UPDATE DELETE and Scripts.
psql $PG_CONNECTION -c "$SEARCH_PATH_CMD, public;" -f initialize/pgsql-demo-dml.sql