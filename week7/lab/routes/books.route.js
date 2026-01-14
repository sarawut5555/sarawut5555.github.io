const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book.controller');

// Books API (5 endpoints)
router.get('/', BookController.getAll);              // GET /api/books
router.get('/search', BookController.search);        // GET /api/books/search?q=
router.get('/:id', BookController.getById);          // GET /api/books/:id
router.post('/', BookController.create);             // POST /api/books
router.put('/:id', BookController.update);           // PUT /api/books/:id

module.exports = router;
