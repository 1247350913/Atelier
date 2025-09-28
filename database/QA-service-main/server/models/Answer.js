require('dotenv').config({path: '../../.env'});
const db = require('../../db/db.js');

module.exports = {
  get: (questionId, count) => {
    return db.query(`
      SELECT
        a.answer_id,
        a.body,
        a.answer_date AS "date",
        a.answer_name AS "answerer_name",
        a.answer_helpfulness AS "helpfulness",
      ARRAY(SELECT p.url FROM photos p WHERE p.answer_id = a.answer_id) AS "photos"
      FROM answers a
      WHERE a.question_id = ${questionId}
      LIMIT ${count}`)
      .catch((err) => {
        return err;
      });
  },
  
  post: (questionId, {body, name, email, photos}) => {
    let questionTime = Date.now();
    let timestamp = new Date(questionTime * 1000).toLocaleString();
    let photosArray = photos;

    return db.query(`INSERT INTO answers (question_id, body, answer_date, answer_name, answer_email, answer_helpfulness, reported) 
      VALUES (${questionId}, '${body}', '${timestamp}', '${name}', '${email}', 0, '0') RETURNING answer_id`)
      .then((id) => {
        for (var i = 0; i < photosArray.length; i++) {
          db.query(`INSERT INTO photos (answer_id, url)
          VALUES (${id[0].answer_id}, '${photosArray[i]}')`)
          .catch((err) => {
            return err;
          })
        }
      })
      .catch((err) => {
        return err;
      })
  },

  mark: (answerId) => {
    return db.query(`UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id = ${answerId}`)
      .catch((err) => {
        return err;
      });
  },

  report: (answerId) => {
    return db.query(`UPDATE answers SET reported = '1' WHERE answer_id = ${answerId}`)
    .catch((err) => {
     return err;
    });
  }
};