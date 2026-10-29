alter table orders
    add column user_id bigint references users(id);

create index idx_orders_user_id on orders (user_id);