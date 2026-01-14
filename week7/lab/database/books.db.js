const db = require('./connection');

class BookDatabase {
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน findById
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // TODO: นักศึกษาเขียน search (ค้นหาจาก title หรือ author)
    static search(keyword) {
        const sql = `
        SELECT * FROM books
        WHERE title LIKE ? OR author LIKE ?
    `;
    const q = `%${keyword}%`;

    return new Promise((resolve, reject) => {
        db.all(sql, [q, q], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    }

    // TODO: นักศึกษาเขียน create
    static create(bookData) {
        const sql = `
        INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.total_copies,
        book.available_copies
    ];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
    }

    // TODO: นักศึกษาเขียน update
    static update(id, bookData) {
        const sql = `
        UPDATE books
        SET title=?, author=?, isbn=?, category=?, total_copies=?, available_copies=?
        WHERE id=?
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [
            book.title,
            book.author,
            book.isbn,
            book.category,
            book.total_copies,
            book.available_copies,
            id
        ], function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
    }

    // ✅ ให้โค้ดสมบูรณ์ - ฟังก์ชันสำคัญสำหรับ borrowing
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: นักศึกษาเขียน increaseAvailableCopies (สำหรับคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        // เขียนโค้ดตรงนี้
    }
}

module.exports = BookDatabase;