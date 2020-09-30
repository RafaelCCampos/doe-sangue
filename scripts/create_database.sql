CREATE SCHEMA blood_donation;
USE blood_donation;

CREATE TABLE donor (
  id bigint NOT NULL AUTO_INCREMENT,
  name varchar(60) NOT NULL,
  email varchar(255) NOT NULL,
  blood varchar(20) NOT NULL,
  PRIMARY KEY (id)
);
