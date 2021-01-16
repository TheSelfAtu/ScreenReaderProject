DROP SCHEMA IF EXISTS ScreenReaderProject;

CREATE SCHEMA ScreenReaderProject;

USE ScreenReaderProject;

-- ユーザーテーブル
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_superuser INT NOT NULL DEFAULT 0,
    username VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
    user (is_superuser, username, password)
VALUES
    (1, "Admin", "admin673");

-- トピックテーブル
DROP TABLE IF EXISTS topic;

CREATE TABLE topic (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    post_user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_user_id) REFERENCES user(id)
);

-- トピックに対するレスポンステーブル
DROP TABLE IF EXISTS response_to_topic;

CREATE TABLE response_to_topic (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    topic_id INT NOT NULL,
    response_user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(topic_id) REFERENCES topic(id),
    FOREIGN KEY(response_user_id) REFERENCES user(id)
);