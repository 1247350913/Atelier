// server/index.js
require('dotenv').config();
const path = require('path');
const axios = require('axios');
const express = require('express');
const compression = require('compression');
const Promise = require('bluebird');
const cloudinary = require('../cloudinary.config'); // uses env vars on load

const app = express();
app.set('trust proxy', true); // Render runs behind a proxy

// Middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve the built client
const DIST = path.join(__dirname, '../client/dist');
app.use(express.static(DIST));

// Upstream API config
const headers = { headers: { authorization: process.env.TOKEN } };
// IMPORTANT: https (not http)
const root = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';

// Helper to relay upstream errors with real status/message
function relayError(res, err) {
  const status = err?.response?.status || 500;
  const data = err?.response?.data || { error: err.message || 'Server error' };
  console.error('[Upstream error]', {
    status,
    message: err?.message,
    upstream: typeof data === 'string' ? data : JSON.stringify(data).slice(0, 500)
  });
  res.status(status).json(data);
}

// ---- Products ----
app.get('/products', (req, res) => {
  axios.get(`${root}/products?count=20`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

app.get('/products/:product_id', (req, res) => {
  axios.get(`${root}/products/${req.params.product_id}`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

app.get('/products/:product_id/styles', (req, res) => {
  axios.get(`${root}/products/${req.params.product_id}/styles`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

app.get('/products/:product_id/related', (req, res) => {
  axios.get(`${root}/products/${req.params.product_id}/related`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

// ---- QA ----
app.get('/qa/questions/:product_id', (req, res) => {
  axios.get(`${root}/qa/questions/?product_id=${req.params.product_id}&count=50`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  axios.get(`${root}/qa/questions/${req.params.question_id}/answers?count=50`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

app.post('/qa/questions', (req, res) => {
  axios.post(`${root}/qa/questions`, req.body, headers)
    .then(r => res.status(201).json(r.data))
    .catch(err => relayError(res, err));
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  axios.post(`${root}/qa/questions/${req.params.question_id}/answers`, req.body, headers)
    .then(r => res.status(201).json(r.data))
    .catch(err => relayError(res, err));
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  axios.put(`${root}/qa/questions/${req.params.question_id}/helpful`, {}, headers)
    .then(r => res.status(204).json(r.data))
    .catch(err => relayError(res, err));
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  axios.put(`${root}/qa/answers/${req.params.answer_id}/helpful`, {}, headers)
    .then(r => res.status(204).json(r.data))
    .catch(err => relayError(res, err));
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  axios.put(`${root}/qa/answers/${req.params.answer_id}/report`, {}, headers)
    .then(r => res.status(204).json(r.data))
    .catch(err => relayError(res, err));
});

// ---- Reviews ----
app.post('/reviews/:product_id', (req, res) => {
  const count = req.body?.count || 50;
  axios.get(`${root}/reviews/?product_id=${req.params.product_id}&count=${count}`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  axios.put(`${root}/reviews/${req.params.review_id}/helpful`, {}, headers)
    .then(() => res.status(200).json('updated helpful'))
    .catch(err => relayError(res, err));
});

app.put('/reviews/:review_id/report', (req, res) => {
  axios.put(`${root}/reviews/${req.params.review_id}/report`, {}, headers)
    .then(() => res.sendStatus(204))
    .catch(err => relayError(res, err));
});

app.post('/addReview', (req, res) => {
  const { review } = req.body || {};
  if (review && review.characteristics) {
    for (const k in review.characteristics) {
      review.characteristics[k] = parseInt(review.characteristics[k], 10);
    }
  }
  axios.post(`${root}/reviews`, review, headers)
    .then(() => res.status(201).json('added!'))
    .catch(err => relayError(res, err));
});

app.get('/reviews/meta/:product_id', (req, res) => {
  axios.get(`${root}/reviews/meta?product_id=${req.params.product_id}`, headers)
    .then(r => res.status(200).json(r.data))
    .catch(err => relayError(res, err));
});

// ---- Uploads (Cloudinary) ----
// Requires CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in env
app.post('/upload', (req, res) => {
  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  Promise.all(images.map(img => cloudinary.uploader.upload(img)))
    .then(results => res.status(201).json(results))
    .catch(err => relayError(res, err));
});

// ---- Healthcheck for Render ----
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// ---- SPA catch-all (after all API routes) ----
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: DIST }, (err) => {
    if (err) res.status(500).json({ error: 'Failed to send index.html' });
  });
});

// ---- Start ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
