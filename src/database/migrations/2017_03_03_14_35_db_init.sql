CREATE DATABASE gamehubone;
USE gamehubone;

CREATE TABLE users (
  id        CHAR(24) PRIMARY KEY NOT NULL,
  mail      VARCHAR(254)         NOT NULL,
  username  VARCHAR(32)          NOT NULL,
  password  CHAR(60)             NOT NULL,
  lastLogin TIMESTAMP            NULL
);

CREATE TABLE games (
  id                CHAR(24) PRIMARY KEY NOT NULL,
  name              VARCHAR(256)         NOT NULL,
  author            VARCHAR(39)          NOT NULL,
  github_name       VARCHAR(100)         NOT NULL,
  authorized_commit CHAR(40)             NOT NULL
);
