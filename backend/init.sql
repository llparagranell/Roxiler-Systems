DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'owner')),
  store_id INTEGER REFERENCES stores(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE users
  ADD CONSTRAINT users_owner_requires_store CHECK (role <> 'owner' OR store_id IS NOT NULL);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, store_id)
);

CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_stores_name ON stores (name);
CREATE INDEX idx_stores_email ON stores (email);
CREATE INDEX idx_ratings_store_id ON ratings (store_id);
CREATE INDEX idx_ratings_user_id ON ratings (user_id);
CREATE INDEX idx_ratings_store_created_at ON ratings (store_id, created_at DESC);

INSERT INTO users(name, email, address, password_hash, role)
VALUES ('System Administrator Example User', 'sysadmin@example.com', 'Admin Office Address', '$2a$10$sMBuz9Wi9.XDcmi7wiVYcu6lX9M8UUnoV/rPAhLoR8AB3PB8y9sHK', 'admin');

INSERT INTO stores(name, email, address)
VALUES ('Sunrise Grocery', 'sunrise@example.com', '123 Market Lane'),
       ('Vivid Books', 'vivid@example.com', '987 Library Road');
