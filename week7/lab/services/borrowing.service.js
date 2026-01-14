const BorrowingDB = require('../database/borrowings.db');
const BookDB = require('../database/books.db');
const MemberDB = require('../database/members.db');

class BorrowingService {

    // ===== BORROW BOOK =====
    static async borrowBook({ book_id, member_id }) {

        // 1. ตรวจสอบหนังสือ
        const book = await BookDB.findById(book_id);
        if (!book) {
            const err = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        if (book.available_copies <= 0) {
            const err = new Error('No available copies');
            err.status = 400;
            throw err;
        }

        // 2. ตรวจสอบสมาชิก
        const member = await MemberDB.findById(member_id);
        if (!member || member.status !== 'active') {
            const err = new Error('Member is not active');
            err.status = 400;
            throw err;
        }

        // 3. จำกัดยืมไม่เกิน 3 เล่ม
        const borrowedCount = await BorrowingDB.countBorrowedByMember(member_id);
        if (borrowedCount >= 3) {
            const err = new Error('Borrow limit exceeded');
            err.status = 400;
            throw err;
        }

        // 4. คำนวณวัน
        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(borrowDate.getDate() + 14);

        // 5. สร้าง borrowing
        const borrowing = await BorrowingDB.create({
            book_id,
            member_id,
            borrow_date: borrowDate.toISOString().slice(0, 10),
            due_date: dueDate.toISOString().slice(0, 10),
            status: 'borrowed'
        });

        // 6. ลดจำนวนหนังสือ
        await BookDB.decreaseAvailableCopies(book_id);

        return borrowing;
    }

    // ===== RETURN BOOK =====
    static async returnBook(borrowingId) {

        const borrowing = await BorrowingDB.findById(borrowingId);
        if (!borrowing || borrowing.status !== 'borrowed') {
            const err = new Error('Invalid borrowing record');
            err.status = 400;
            throw err;
        }

        const returnDate = new Date();

        await BorrowingDB.returnBook(
            borrowingId,
            returnDate.toISOString().slice(0, 10)
        );

        await BookDB.increaseAvailableCopies(borrowing.book_id);

        const due = new Date(borrowing.due_date);
        const daysOverdue = Math.max(
            0,
            Math.ceil((returnDate - due) / (1000 * 60 * 60 * 24))
        );

        return {
            id: borrowingId,
            return_date: returnDate.toISOString().slice(0, 10),
            days_overdue: daysOverdue,
            fine: daysOverdue * 20
        };
    }

    // ===== OVERDUE =====
    static async getOverdueBorrowings() {
        return await BorrowingDB.findOverdue();
    }
}

module.exports = BorrowingService;
