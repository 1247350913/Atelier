const express = require('express');
const db = require('../db/db.js');
const app = express();


// app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/reviews/:product_id', async (req, res) => {
  db.reviewID(req.params.product_id)
    .then((Data)=>{
      console.log(Data[0][0], ' DATA');
      // Data[0][0].photos = [];
      res.status(201).send({results: Data[0]})
    })
    .catch((err)=> {
      res.sendStatus(501)
    })

})
app.get('/reviews/meta/:product_id', async (req, res) => {
  db.meta(req.params.product_id)
    .then((data)=> {
      console.log(data[0], " data2")
      res.status(201).send(data[0][0].result)
    })
    .catch((err) => {
      res.status(501)
    })
} )
app.post('/reviews/', async (req, res) => {
  console.log('add ', req.body);
  db.revPost(req.body)
    .then((data)=> {
      console.log(data, " Post")
      res.status(201).send(data[0]);
    })
    .catch((err) => {
      console.log(err, ' ERR')
      res.sendStatus(501)
    })

})

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});