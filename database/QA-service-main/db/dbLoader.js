const fs = require('fs');
const csv = require('fast-csv');
require('dotenv').config();
const pgp = require('pg-promise')();
const db = require('./db.js');

const questionLoader = () => {
  const questionLoad = new Promise((resolve, reject) => {
    let questionData = [];
    const parser = csv.parse({ headers: true });
    const qcs = new pgp.helpers.ColumnSet([
      'product_id', 
      'question_body', 
      'question_date', 
      'asker_name', 
      'asker_email', 
      'question_helpfulness', 
      'reported'], 
      {table: 'questions'});
  
    fs.createReadStream('../csvdata/questions.csv')
      .pipe(parser)
      .transform(data => ({
        question_id: data.question_id,
        product_id: data.product_id,
        question_body: data.body,
        question_date: new Date(data.question_date * 1000).toLocaleString(),
        asker_name: data.asker_name,
        asker_email: data.asker_email,
        question_helpfulness: data.question_helpfulness,
        reported: data.reported
      }))
      .on('error', error => console.error(error))
      .on('data', row => {
        console.log(questionData.length)
        questionData.push(row);
        if (questionData.length === 10000) {
          parser.pause();
          console.log('loading')
          const query = pgp.helpers.insert(questionData, qcs);
          db.none(query).then(() => {
              questionData = [];
              parser.resume();
            })  
        }
      })
      .on('end', () => {
        const query = pgp.helpers.insert(questionData, qcs);
        db.none(query).then(() => {
          console.log('all question data loaded to db');
          resolve();
        });
      });
  });

  return questionLoad;
};  

const answerLoader = () => {
  const answerLoad = new Promise((resolve, reject) => {
    let answerData = [];
    const parser = csv.parse({ headers: true });
    const acs = new pgp.helpers.ColumnSet([
      'question_id',
      'body',
      'answer_date',
      'answer_name',
      'answer_email',
      'answer_helpfulness',
      'reported'],
      {table: 'answers'});
  
    fs.createReadStream('../csvdata/answers.csv')
      .pipe(parser)
      .transform(data => ({
        answer_id: data.answer_id,
        question_id: data.question_id,
        body: data.body,
        answer_date: new Date(data.answer_date * 1000).toLocaleString(),
        answer_name: data.answer_name,
        answer_email: data.answer_email,
        answer_helpfulness: data.answer_helpfulness,
        reported: data.reported
      }))
      .on('error', error => console.error(error))
      .on('data', row => {
        answerData.push(row)
        if (answerData.length === 10000) {
          parser.pause();
          const query = pgp.helpers.insert(answerData, acs);
          db.none(query).then(() => {
            answerData = [];
            parser.resume();
          });  
        };
      })
      .on('end', () => {
        const query = pgp.helpers.insert(answerData, acs);
        db.none(query).then(() => {
          console.log('all answer data loaded to db');
          resolve();
        });
      });
  });

  return answerLoad;
};

const photoLoader = () => {
  const photosLoad = new Promise((resolve, reject) => {
    let photos = [];
    const parser = csv.parse({ headers: true });
    const pcs = new pgp.helpers.ColumnSet([
      'answer_id',
      'url'],
      {table: 'photos'});

    fs.createReadStream('../csvdata/answers_photos.csv')
      .pipe(parser)
      .on('error', error => console.error(error))
      .on('data', row => {
        photos.push(row);
        if (photos.length === 10000) {
          parser.pause()
        const query = pgp.helpers.insert(photos, pcs);
        db.none(query).then(() => {
            photos = [];
            parser.resume();
          })  
        }
      })
      .on('end', () => {
        const query = pgp.helpers.insert(photos, pcs);
        db.none(query).then(() => {
          console.log('all photos data loaded to db');
          resolve();
        });
      });
  });

  return photosLoad;
};

const bulkLoadInitiate = () => {
  console.log('database load has begun, please wait')
  questionLoader()
    .then(() => {return answerLoader()})
    .then(() => {return photoLoader()})
    .then(() => {console.log('database load complete')})
};

bulkLoadInitiate();