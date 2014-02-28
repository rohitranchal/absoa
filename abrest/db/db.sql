CREATE DATABASE IF NOT EXISTS soa_ab;
USE soa_ab;

DROP TABLE IF EXISTS Account;

CREATE TABLE Account (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(512) UNIQUE,
	password VARCHAR(512),
	active_bundle BLOB
) ENGINE=InnoDB;

INSERT INTO Account(id, username, password) VALUES
(1, 'user1', 'pass1'),
(2, 'user2', 'pass2'),
(3, 'user3', 'pass3');


