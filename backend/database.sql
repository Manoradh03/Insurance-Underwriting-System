-- Optional: run this ONCE in pgAdmin or psql if the database does not exist.
-- Spring Boot will create tables automatically (spring.jpa.hibernate.ddl-auto=update).

CREATE DATABASE insurance_db;

-- Then connect to insurance_db. Nothing else needed — Hibernate creates tables.
-- After starting the app once, you can seed an admin user by running the app,
-- calling POST /api/auth/register with role=ADMIN, or via SQL:
--
-- Password below is bcrypt for "admin123":
-- INSERT INTO users (username, email, password, full_name, phone, role)
-- VALUES ('admin', 'admin@ius.com',
--   '$2a$10$7EqJtq98hPqEX7fNZaFWoOa2yn3wKz1cVJqf.iCw8f1KJfLQ8y0oe',
--   'System Admin', '9999999999', 'ADMIN');
