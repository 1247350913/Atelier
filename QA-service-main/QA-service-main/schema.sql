CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL INT NOT NULL,
  product_id INT,
  question_body TEXT,
  question_date VARCHAR(100),
  asker_name VARCHAR(50),
  asker_email VARCHAR(100),
  question_helpfulness INT DEFAULT 0,
  reported BIT,
  PRIMARY KEY (question_id)
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL INT NOT NULL,
  question_id INT,
  body TEXT,
  answer_date VARCHAR(500),
  answer_name VARCHAR(500),
  answer_email VARCHAR(500),
  answer_helpfulness INT DEFAULT 0,
  reported BIT,
  PRIMARY KEY (answer_id),
  FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id SERIAL INT NOT NULL,
  answer_id INT,
  url VARCHAR(2000),
  PRIMARY KEY (photo_id),
  FOREIGN KEY (answer_id) REFERENCES answers(answer_id)
);