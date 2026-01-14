const BookDB = require('../database/books.db');

class BookService {

    // ===== GET ALL BOOKS =====
    static async getAllBooks() {
        return await BookDB.findAll();
    }

    // ===== GET BOOK BY ID =====
    static async getBookById(id) {
        const book = await BookDB.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }
        return book;
    }

    // ===== SEARCH BOOKS =====
    static async searchBooks(keyword) {
        if (!keyword) {
            throw new Error('Search keyword is required');
        }
        return await BookDB.search(keyword);
    }

    // ===== CREATE BOOK =====
    static async createBook(bookData) {
        const {
            title,
            author,
            isbn,
            category,
            total_copies,
            available_copies
        } = bookData;

        // Validation
        if (!title || !author) {
            throw new Error('Title and author are required');
        }

        if (total_copies < 0 || available_copies < 0) {
            throw new Error('Copies must be >= 0');
        }

        if (available_copies > total_copies) {
            throw new Error('Available copies cannot exceed total copies');
        }

        return await BookDB.create(bookData);
    }

    // ===== UPDATE BOOK =====
    static async updateBook(id, bookData) {
        const book = await BookDB.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }

        if (bookData.available_copies > bookData.total_copies) {
            throw new Error('Available copies cannot exceed total copies');
        }

        return await BookDB.update(id, bookData);
    }
}

module.exports = BookService;
