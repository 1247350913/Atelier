require('dotenv').config({path: '../../.env'});
const db = require('../../db/db.js');

module.exports = {
  get: (productId, count) => {
    let query = `
    SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness, q.reported, 
      (SELECT json_agg(a) FROM (
        SELECT a.answer_id, a.body AS answer_body, a.answer_date, a.answer_name, a.answer_helpfulness, a.reported,
            (SELECT json_agg(p) FROM (
              SELECT p.photo_id, p.url
              FROM photos p
              WHERE p.answer_id = a.answer_id) p) AS photos
        FROM answers a
        WHERE a.question_id = q.question_id) a) AS answers
      FROM questions q
      WHERE q.product_id = ${productId}
      LIMIT ${count}`
    return db.query(query)
      .catch((err) => {
        return err;
      });
  },

  post: ({ product_id, body, name, email }) => {
    let questionTime = Date.now();
    let timestamp = new Date(questionTime * 1000).toLocaleString();

    return db.query(`INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported)
      VALUES (${product_id}, '${body}', '${timestamp}', '${name}', '${email}', 0, '0')`)
      .catch((err) => {
        return err;
      });
  },

  mark: (questionId) => {
    return db.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${questionId}`)
      .catch((err) => {
        return err;
      });
  },

  report: (questionId) => {
    return db.query(`UPDATE questions SET reported = '1' WHERE question_id = ${questionId}`)
     .catch((err) => {
      return err;
     });
  }
};