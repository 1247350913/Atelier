const mysql = require('mysql2');
const mysqlConfig = require('./config.js');

const connection = mysql.createConnection(mysqlConfig)

const meta = async (input) => {
  return connection.promise().query(`
  SELECT
  JSON_OBJECT(
    'characteristics',
    JSON_OBJECTAGG(
      characteristics.name,
      charRev.value
    ),
    'recommended',
    JSON_OBJECT(
      'true',
      SUM(CASE WHEN reviews.recomended = 1 THEN 1 ELSE 0 END),
      'false',
      SUM(CASE WHEN reviews.recomended = 0 THEN 1 ELSE 0 END)
    ),
    'ratings',
    JSON_OBJECTAGG(
      reviews.review_id,
      reviews.rating
    )
  ) as result
FROM characteristics
INNER JOIN charRev
  ON characteristics.id = charRev.charid
INNER JOIN reviews
  ON charRev.revid = reviews.review_id
WHERE reviews.product_id = ${input}
GROUP BY characteristics.product_id



`)
}
const reviewID = async (input) => {
  return connection.promise().query(`SELECT *,
  (
    SELECT COALESCE(GROUP_CONCAT(photos.url), '[]')
  FROM photos
  WHERE photos.review_id = reviews.review_id
  )
  AS photos
  FROM reviews
  WHERE reviews.product_id = ${input};
  `
  )
}

const revPost = async (input) => {
  return connection.promise().query(`
  BEGIN;
  INSERT INTO reviews (product_id, rating, date, summary, body, recommended, name, email)
  VALUES (${input.product_id}, ${input.rating}, CURRENT_TIMESTAMP(), '${input.summary}', '${input.body}', ${input.recommend}, '${input.name}', '${input.email}')
  INSERT INTO photos (review_id, url)
  VALUES (LAST_INSERT_ID(), '');
  COMMIT;

  `)
}




module.exports = {
reviewID,
meta,
revPost
}