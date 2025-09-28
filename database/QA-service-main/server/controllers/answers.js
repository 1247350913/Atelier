const Answer = require('../models/Answer.js');

module.exports = {
  getAnswers: (req, res) => {
    let count = req.query.count || 50;
    Answer.get(req.params.question_id, count)
      .then((results) => {
        let data = {results: results}
        res.status(200).send(data);
      })
      .catch((err) => {
        res.send(err);
      })
  },

  postAnswer: (req, res) => {
    Answer.post(req.params.question_id, req.query)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.send(err);
      })
  },

  markAnswer: (req, res) => {
    Answer.mark(req.params.answer_id)
      .then(() => {
        res.status(204).send('Liked!');
      })
      .catch((err) => {
        res.send(err);
      })
  },

  reportAnswer: (req, res) => {
    Answer.report(req.params.answer_id)
      .then(() => {
        res.status(204).send('answer reported');
      })
      .catch((err) => {
        res.send(err);
      })
  }
};