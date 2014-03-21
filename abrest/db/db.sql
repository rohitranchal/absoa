CREATE DATABASE IF NOT EXISTS soa_ab;

USE soa_ab;

DROP TABLE IF EXISTS Account;

CREATE TABLE Account (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(512) UNIQUE,
	password VARCHAR(512),
	active_bundle VARCHAR(512),
  status INT
) ENGINE=InnoDB;

DROP TABLE IF EXISTS Item;

CREATE TABLE Item(
	id INT AUTO_INCREMENT PRIMARY KEY,
	itemname VARCHAR(512),
	price INTEGER UNSIGNED,
	amount INTEGER UNSIGNED,
	picture VARCHAR(512)
) ENGINE=InnoDB;

INSERT INTO Account(id, username, password, status) VALUES
(1, 'user1', 'pass1', -1),
(2, 'user2', 'pass2', -1);

INSERT INTO Item(id, itemname, price,amount,picture) VALUES
(1, '13-inch MacBook Pro', 1299,10,'http://g-ecx.images-amazon.com/images/G/01/electronics/apple/apple-12q2-macbook-pro-ret-zebra-lg.jpg'),
(2, '15-inch MacBook Pro', 1999,10,'http://g-ecx.images-amazon.com/images/G/01/electronics/apple/apple-12q2-macbook-pro-ret-zebra-lg.jpg'),
(3, '11-inch MacBook Air', 999,10,'http://www8.pcmag.com/media/images/325753-apple-macbook-air-13-inch-mid-2013.jpg'),
(4, '13-inch MacBook Air', 1099,10,'http://www8.pcmag.com/media/images/325753-apple-macbook-air-13-inch-mid-2013.jpg'),
(5, 'iPad Air', 499,10,'http://static.techspot.com/images/products/tablets/org/283400752_1404640415_o.jpg'),
(6, 'iPad Mini', 299,10,'http://onlinetechguru.org/wp-content/uploads/2013/02/ipad-mini-review.jpg'),
(7, 'iPad 2', 399,10,'http://www.blogcdn.com/www.engadget.com/media/2011/03/11x0302v444ipad2.jpg'),
(8, 'iPhone 5s',649,10,'http://www.extremetech.com/wp-content/uploads/2013/09/iph.jpg'),
(9, 'iPhone 5c', 549,10,'http://a.abcnews.com/images/Technology/HT_iphone_5C-colors_thg-130910_16x9_992.jpg');

