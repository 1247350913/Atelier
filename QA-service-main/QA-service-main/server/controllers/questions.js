const Question = require('../models/Question.js');

module.exports = {
  getQuestions: (req, res) => {
    let count = req.query.count || 50;
    Question.get(req.params.product_id, count)
      .then((results) => {
        let data = {results: results}
        res.status(200).send(data);
      })
      .catch((err) => {
        res.send(err);
      })
  },

  postQuestion: (req, res) => {
    Question.post(req.query)
      .then((data) => {
        res.status(201).send('question added');
      })
      .catch((err) => {
        res.send(err);
      });
  },

  markQuestion: (req, res) => {
    Question.mark(req.params.question_id)
      .then(() => {
        res.status(204).send('question marked');
      })
      .catch((err) => {
        res.send(err);
      })
  },

  reportQuestion: (req, res) => {
    Question.report(req.params.question_id)
      .then(() => {
        res.status(204).send('question reported');
      })
      .catch((err) => {
        res.send(err);
      })
  }
};