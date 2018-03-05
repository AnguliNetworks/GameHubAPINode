CREATE DATABASE gamehubone;
USE gamehubone;

CREATE TABLE users (
  id       CHAR(24) PRIMARY KEY NOT NULL,
  mail     VARCHAR(254)         NOT NULL,
  username VARCHAR(32)          NOT NULL,
  password CHAR(60)             NOT NULL,
  created  DATETIME,
  updated  DATETIME
);
