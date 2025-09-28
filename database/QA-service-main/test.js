const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const expect = chai.expect;
const server = require('./server/index.js');

chai.use(chaiHttp);

describe('Questions GET Requests', () => {
  it('Should return an array of objects', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/10')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results.length).to.equal(3);
        done();
      })
  })

  it('Should return the correct product_id', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/10')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results[0].product_id).to.equal(10);
        done();
      })
  })

  it('Should return the correct question body', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/10')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results[0].question_body).to.equal('HI GUYS?');
        done();
      })
  })  

  it('Should return the correct question id', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/10')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results[2].question_id).to.equal(54);
        done();
      })
  })    
})

describe('Answers GET Requests', () => {
  it('Should return an array of objects', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/52/answers')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results.length).to.equal(1);
        done();
      })
  })

  it('Should return the correct answer_id', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/52/answers')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results[0].answer_id).to.equal(69);
        done();
      })
  })

  it('Should return the correct answer body', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/52/answers')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results[0].body).to.equal('Mine started showing wear a weeks in');
        done();
      })
  })  

  it('Should return the correct question id', (done) => {
    chai.request('http://localhost:3001')
      .get('/qa/questions/52/answers')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.results[0].question_id).to.equal(52);
        done();
      })
  })    
})
