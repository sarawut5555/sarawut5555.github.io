const BorrowingService = require('../services/borrowing.service');
const BorrowingDB = require('../database/borrowings.db');

class BorrowingController {

    // GET /api/borrowings
    static async getAll(req, res, next) {
        try {
            const borrowings = await BorrowingDB.findAll();
            res.json({ success: true, data: borrowings });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/borrowings/:id
    static async getById(req, res, next) {
        try {
            const borrowing = await BorrowingDB.findById(req.params.id);
            if (!borrowing) {
                return res.status(404).json({ success: false, error: 'Borrowing not found' });
            }
            res.json({ success: true, data: borrowing });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/borrowings/member/:memberId
    static async getByMember(req, res, next) {
        try {
            const list = await BorrowingDB.findByMember(req.params.memberId);
            res.json({ success: true, data: list });
        } catch (err) {
            next(err);
        }
    }

    // POST /api/borrowings/borrow
    static async borrow(req, res, next) {
        try {
            const result = await BorrowingService.borrowBook(req.body);
            res.status(201).json({
                success: true,
                message: 'Book borrowed successfully',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    // PUT /api/borrowings/:id/return
    static async returnBook(req, res, next) {
        try {
            const result = await BorrowingService.returnBook(req.params.id);
            res.json({
                success: true,
                message: 'Book returned successfully',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/borrowings/overdue
    static async getOverdue(req, res, next) {
        try {
            const result = await BorrowingService.getOverdueBorrowings();
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = BorrowingController;
