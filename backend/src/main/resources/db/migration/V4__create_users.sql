create table users (
id bigint generated always as identity primary key,
email varchar(254) not null unique,
password_hash varchar(100) not null,
full_name varchar(100) not null,
role varchar(20) not null check (role in ('CUSTOMER', 'ADMIN')),
created_at timestamp(6) with time zone not null
);