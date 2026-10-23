insert into category (name, slug) values
    ('Electronics',       'electronics'),
    ('Books',             'books'),
    ('Home & Kitchen',    'home-kitchen'),
    ('Sports & Outdoors', 'sports-outdoors');

insert into product (name, description, price, stock, category_id) values
    ('Wireless Headphones', 'Over-ear Bluetooth headphones with active noise cancelling and 30-hour battery life.', 129.90, 25, (select id from category where slug = 'electronics')),
    ('Smartwatch',          'Fitness tracking, heart-rate monitor and notifications on your wrist. Water resistant.', 199.00, 12, (select id from category where slug = 'electronics')),
    ('Mechanical Keyboard', 'Compact 75% layout, hot-swappable switches and RGB backlight.',                          89.50, 30, (select id from category where slug = 'electronics')),
    ('Portable Speaker',    'Waterproof Bluetooth speaker with deep bass and 12-hour playtime.',                       59.99, 40, (select id from category where slug = 'electronics')),
    ('4K Webcam',           'Ultra HD webcam with autofocus and dual noise-reducing microphones.',                     74.00,  0, (select id from category where slug = 'electronics')),

    ('Clean Code',                  'A handbook of agile software craftsmanship by Robert C. Martin.',        34.90, 15, (select id from category where slug = 'books')),
    ('Effective Java',              'Best practices for the Java platform by Joshua Bloch.',                  42.00, 10, (select id from category where slug = 'books')),
    ('Designing Data-Intensive Apps','The big ideas behind reliable, scalable and maintainable systems.',     48.50,  8, (select id from category where slug = 'books')),
    ('The Pragmatic Programmer',    'Your journey to mastery, 20th anniversary edition.',                     39.90, 20, (select id from category where slug = 'books')),
    ('Head First Design Patterns',  'A brain-friendly guide to object-oriented design patterns.',             44.00,  5, (select id from category where slug = 'books')),

    ('Espresso Machine',   'Manual espresso machine with 15-bar pump and milk frother.',              249.00,  6, (select id from category where slug = 'home-kitchen')),
    ('Chef''s Knife',      '20 cm stainless steel chef''s knife with ergonomic handle.',               54.90, 18, (select id from category where slug = 'home-kitchen')),
    ('Cast Iron Skillet',  'Pre-seasoned 28 cm skillet for stovetop, oven and grill.',                 39.00, 22, (select id from category where slug = 'home-kitchen')),
    ('French Press',       'Borosilicate glass French press, 1 litre.',                                24.50, 35, (select id from category where slug = 'home-kitchen')),
    ('Bamboo Cutting Board','Large reversible bamboo board with juice groove.',                        19.90, 50, (select id from category where slug = 'home-kitchen')),

    ('Yoga Mat',           'Non-slip 6 mm yoga mat with carrying strap.',                              29.90, 45, (select id from category where slug = 'sports-outdoors')),
    ('Running Shoes',      'Lightweight cushioned running shoes for road and track.',                  94.00, 14, (select id from category where slug = 'sports-outdoors')),
    ('Hiking Backpack',    '35-litre backpack with rain cover and hydration sleeve.',                  79.00,  9, (select id from category where slug = 'sports-outdoors')),
    ('Adjustable Dumbbells','Pair of adjustable dumbbells, 2 to 20 kg each.',                         159.00,  4, (select id from category where slug = 'sports-outdoors')),
    ('Insulated Water Bottle','Stainless steel bottle that keeps drinks cold for 24 hours.',           22.00, 60, (select id from category where slug = 'sports-outdoors'));