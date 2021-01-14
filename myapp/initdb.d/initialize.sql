DROP SCHEMA IF EXISTS ScreenReaderProject;
CREATE SCHEMA ScreenReaderProject;
USE ScreenReaderProject;
-- ユーザーテーブル
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_superuser INT DEFAULT 0,
    username VARCHAR(40),
    password VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- CONSTRAINT AK_TransactionID UNIQUE(TransactionID)   
-- UNIQUE[username]

);
INSERT INTO user (is_superuser, username, password)
VALUES (1, "Admin", "admin673");
-- トピックテーブル
DROP TABLE IF EXISTS topic;
CREATE TABLE topic (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- トピックに対するレスポンステーブル
DROP TABLE IF EXISTS response_to_topic;
CREATE TABLE response_to_topic (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    topic_id INT,
     FOREIGN KEY(topic_id)  REFERENCES topic(id)
);