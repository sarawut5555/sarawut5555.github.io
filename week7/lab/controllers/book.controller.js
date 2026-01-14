const BookService = require('../services/book.service');

class BookController {

    // GET /api/books
    static async getAll(req, res, next) {
        try {
            const books = await BookService.getAllBooks();
            res.json({ success: true, data: books });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/books/:id
    static async getById(req, res, next) {
        try {
            const book = await BookService.getBookById(req.params.id);
            res.json({ success: true, data: book });
        } catch (err) {
            err.status = 404;
            next(err);
        }
    }

    // GET /api/books/search?q=
    static async search(req, res, next) {
        try {
            const result = await BookService.searchBooks(req.query.q);
            res.json({ success: true, data: result });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    }

    // POST /api/books
    static async create(req, res, next) {
        try {
            const book = await BookService.createBook(req.body);
            res.status(201).json({
                success: true,
                message: 'Book created successfully',
                data: book
            });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    }

    // PUT /api/books/:id
    static async update(req, res, next) {
        try {
            const result = await BookService.updateBook(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Book updated successfully',
                data: result
            });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    }
}

module.exports = BookController;
