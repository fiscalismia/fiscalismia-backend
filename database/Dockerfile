# This Dockerfile is used for deployment on a demo instance running a local database with non-prod data
FROM postgres:16.3-alpine3.20
# DDL (Data Definition Language) is used to define the structure of the database, such as creating tables, sequences, constraints.
COPY pgsql-public-ddl.sql /initialize/pgsql-public-ddl.sql
COPY pgsql-user-ddl.sql /initialize/pgsql-user-ddl.sql
# DML (Data Manipulation Language) is used to populate the db with INSERT UPDATE DELETE and Scripts.
COPY pgsql-demo-dml.sql /initialize/pgsql-demo-dml.sql
# set user schema and set search_path to initial admin credentials for development, then call DDL
# inserts initial admin credentials and user settings for development and call DML
COPY pgsql-local-initdb.sh /docker-entrypoint-initdb.d/01_pgsql-local-initdb.sh