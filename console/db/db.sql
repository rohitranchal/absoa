CREATE DATABASE IF NOT EXISTS abconsole;

USE abconsole;

DROP TABLE IF EXISTS Policy;
DROP TABLE IF EXISTS Service_Log;
DROP TABLE IF EXISTS Service_Data;

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
) ENGINE=InnoDB;

INSERT INTO Service(id, name, display_name, rating, trust_level, req_data, host, port, url, params, status, source_path) VALUES
(1, 'localhost:4101','Shopping', 5.0, 4.0, 'name', 'localhost', 4101, 'http://localhost:4101', '{}', -1, 'scenarios/online-shopping/shopping'),
(2, 'localhost:4102','Seller', 5.0, 4.0, 'email', 'localhost', 4102, 'http://localhost:4102', '{}', -1, 'scenarios/online-shopping/seller'),
(3, 'localhost:4103','Shipping', 5.0, 4.0, 'address', 'localhost', 4103, 'http://localhost:4103', '{}', -1, 'scenarios/online-shopping/shipping'),
(4, 'localhost:4104','Payment', 5.0, 4.0, 'credit card', 'localhost', 4104, 'http://localhost:4104', '{}', -1, 'scenarios/online-shopping/payment');

CREATE TABLE Service_Log (
        service_id INT PRIMARY KEY,
        log VARCHAR(2048),
        FOREIGN KEY (service_id) REFERENCES Service(id)
) ENGINE=InnoDB;

INSERT INTO Service_Log(service_id, log) VALUES
(1, 'AB Data: visa'),
(2, 'AB Data: expedited shipping'),
(3, 'AB Data: 305 N Univ St West Lafayette IN'),
(4, 'AB Data: 1234 5678 9012 3456');

CREATE TABLE Service_Data (
        id INT PRIMARY KEY,
        service_id INT ,
        data_key VARCHAR(1024) ,
        data_value VARCHAR(1024), 
        FOREIGN KEY (service_id) REFERENCES Service(id) 
)ENGINE=INNODB ;

INSERT INTO Service_Data(id , service_id, data_key, data_value) VALUES
(1, 1, 'name','John'),
(2, 2, 'email','john@purdue.com'),
(3, 4, 'creditcard','1111 2222 3333 4444'),
(4, 1, 'payment.type','visa'),
(5, 3, 'address','305 N University St, West Lafayette, IN, US'), 
(6, 2, 'shipping.preference','expedited shipping');

CREATE TABLE Policy (
        id INT PRIMARY KEY,
        data_id INT ,
        policy VARCHAR(2048) ,
        rules VARCHAR(2048), 
        FOREIGN KEY (data_id) REFERENCES Service_Data(id) 
)ENGINE=INNODB ;

INSERT INTO Policy (id , data_id, policy, rules) VALUES
(1, 4, 'Payment type policy', '{"rating":4, "credit_limit":5000}'),
(2, 3, 'Credit card policy', '{"rating":4}'),
(3, 5, 'Mailing address policy', '{"rating":4}'),
(4, 6, 'Shipping preference policy', '{"rating":4}');