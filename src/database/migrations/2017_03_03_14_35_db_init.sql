CREATE DATABASE gamehubone;
USE gamehubone;

CREATE TABLE users (
  id        CHAR(24) PRIMARY KEY                                  NOT NULL,
  mail      VARCHAR(254)                                          NOT NULL,
  username  VARCHAR(32)                                           NOT NULL,
  password  CHAR(60)                                              NOT NULL,
  lastLogin TIMESTAMP                                             NULL,
  avatar    VARCHAR(64) DEFAULT 'https://i.imgur.com/ZKxOqmm.png' NOT NULL
);

CREATE TABLE games (
  id                CHAR(24) PRIMARY KEY NOT NULL,
  name              VARCHAR(256)         NOT NULL,
  author            VARCHAR(39)          NOT NULL,
  icon              VARCHAR(256),
  github_name       VARCHAR(100)         NOT NULL,
  authorized_commit CHAR(40)             NOT NULL
);

CREATE TABLE friendship (
  wants_to_be CHAR(24)              NOT NULL,
  could_be    CHAR(24)              NOT NULL,
  accepted    BOOLEAN DEFAULT FALSE NOT NULL,
  FOREIGN KEY (wants_to_be) REFERENCES users (id),
  FOREIGN KEY (could_be) REFERENCES users (id)
);
