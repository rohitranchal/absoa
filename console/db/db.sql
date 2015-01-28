CREATE DATABASE IF NOT EXISTS abconsole;

USE abconsole;

DROP TABLE IF EXISTS Service;
CREATE TABLE Service (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(2048),
	display_name VARCHAR(2048),
	rating FLOAT,
	trust_level FLOAT,
	req_data VARCHAR(2048),
	host VARCHAR(2048),
	port INT,
	url VARCHAR(2048),
	params TEXT,
	status INT,
	source_path VARCHAR(2048)
);

INSERT INTO Service(id, name, display_name, rating, trust_level, req_data, host, port, url, params, status, source_path) VALUES
(1, 'localhost:4101','Online Shopping', 5.0, 4.0, 'name', 'localhost', 4101, 'http://localhost:4101', '{}', -1, 'scenarios/shopping'),
(2, 'localhost:4102','Seller', 5.0, 4.0, 'email', 'localhost', 4102, 'http://localhost:4102', '{}', -1, 'scenarios/seller'),
(3, 'localhost:4103','Shipping', 5.0, 4.0, 'address', 'localhost', 4103, 'http://localhost:4103', '{}', -1, 'scenarios/shipping'),
(4, 'localhost:4104','Payment', 5.0, 4.0, 'credit card', 'localhost', 4104, 'http://localhost:4104', '{}', -1, 'scenarios/payment');