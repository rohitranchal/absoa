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
        context TEXT,
        status INT,
        source_path VARCHAR(2048)
) ENGINE=InnoDB;

INSERT INTO Service(id, name, display_name, rating, trust_level, req_data, host, port, url, context, status, source_path) VALUES
(1, 'localhost:4101','Shopping', 5.0, 8.0, 'payment_type', 'localhost', 4101, 'http://localhost:4101', 'normal', -1, 'scenarios/online-shopping/shopping'),
(2, 'localhost:4102','Seller', 5.0, 8.0, 'shipping_preference', 'localhost', 4102, 'http://localhost:4102', 'normal', -1, 'scenarios/online-shopping/seller'),
(3, 'localhost:4103','Shipping', 5.0, 8.0, 'address', 'localhost', 4103, 'http://localhost:4103', 'normal', -1, 'scenarios/online-shopping/shipping'),
(4, 'localhost:4104','Payment', 5.0, 8.0, 'creditcard', 'localhost', 4104, 'http://localhost:4104', 'normal', -1, 'scenarios/online-shopping/payment'),
(5, 'localhost:4201','Hospital', 5.0, 8.0, 'ehr', 'localhost', 4201, 'http://localhost:4201', 'normal', -1, 'scenarios/healthcare/hospital'),
(6, 'localhost:4202','Doctor', 5.0, 8.0, 'ehr', 'localhost', 4202, 'http://localhost:4202', 'normal', -1, 'scenarios/healthcare/doctor'),
(7, 'localhost:4203','Laboratory', 5.0, 8.0, 'test_prescription', 'localhost', 4203, 'http://localhost:4203', 'normal', -1, 'scenarios/healthcare/laboratory'),
(8, 'localhost:4204','Paramedic', 5.0, 8.0, 'medical_data', 'localhost', 4204, 'http://localhost:4204', 'normal', -1, 'scenarios/healthcare/paramedic'),
(9, 'localhost:4205','Pharmacy', 5.0, 8.0, 'prescription', 'localhost', 4205, 'http://localhost:4205', 'normal', -1, 'scenarios/healthcare/pharmacy'),
(10, 'localhost:4001','S1', 5.0, 8.0, 'creditcard', 'localhost', 4001, 'http://localhost:4001', 'normal', -1, 'scenarios/online-shopping/S1'),
(11, 'localhost:4002','S2', 5.0, 8.0, 'ehr', 'localhost', 4002, 'http://localhost:4002', 'normal', -1, 'scenarios/healthcare/S2'),
(12, 'localhost:4003','S3', 5.0, 8.0, 'ehr', 'localhost', 4003, 'http://localhost:4003', 'normal', -1, 'scenarios/healthcare/S3'),
(13, 'localhost:4004','S4', 5.0, 8.0, 'test_prescription', 'localhost', 4004, 'http://localhost:4004', 'normal', -1, 'scenarios/healthcare/S4'),
(14, 'localhost:4005','S5', 5.0, 8.0, 'medical_data', 'localhost', 4005, 'http://localhost:4005', 'normal', -1, 'scenarios/healthcare/S5'),
(15, 'localhost:4006','Service 1', 5.0, 8.0, 'test_prescription', 'localhost', 4006, 'http://localhost:4006', 'normal', -1, 'scenarios/healthcare/Service1');

CREATE TABLE Service_Log (
        service_id INT PRIMARY KEY,
        log VARCHAR(2048),
        FOREIGN KEY (service_id) REFERENCES Service(id)
) ENGINE=InnoDB;

INSERT INTO Service_Log(service_id, log) VALUES
(1, 'AB Data: visa'),
(2, 'AB Data: expedited shipping'),
(3, 'AB Data: 305 N Univ St West Lafayette IN'),
(4, 'AB Data: 1234 5678 9012 3456'),
(5, 'Patient Id: 5'),
(6, 'AB Data: Tcode'),
(7, 'AB Data: Insurance Id'),
(8, 'AB Data: Ecode');

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
        resource VARCHAR(2048) ,
        rules VARCHAR(2048), 
        FOREIGN KEY (data_id) REFERENCES Service_Data(id) 
)ENGINE=INNODB ;

INSERT INTO Policy (id , data_id, policy, resource, rules) VALUES
(1, 4, 'Payment type policy', 'payment.type', '{"rating":4, "credit_limit":5000}'),
(2, 3, 'Credit card policy', 'creditcard', '{"rating":4}'),
(3, 5, 'Mailing address policy', 'address', '{"rating":4}'),
(4, 6, 'Shipping preference policy', 'shipping.preference', '{"rating":4}');