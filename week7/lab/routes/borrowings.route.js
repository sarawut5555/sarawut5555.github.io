const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/borrowing.controller');

// Borrowings API (6 endpoints)
router.get('/', BorrowingController.getAll);                           // GET /api/borrowings
router.get('/overdue', BorrowingController.getOverdue);                // GET /api/borrowings/overdue
router.get('/:id', BorrowingController.getById);                       // GET /api/borrowings/:id
router.get('/member/:memberId', BorrowingController.getByMember);      // GET /api/borrowings/member/:memberId
router.post('/borrow', BorrowingController.borrow);                    // POST /api/borrowings/borrow
router.put('/:id/return', BorrowingController.returnBook);             // PUT /api/borrowings/:id/return

module.exports = router;
