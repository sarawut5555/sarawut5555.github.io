const db = require('./connection');

class MemberDatabase {

    // ===== GET ALL MEMBERS =====
    static findAll() {
        const sql = `SELECT * FROM members ORDER BY id DESC`;

        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ===== GET MEMBER BY ID =====
    static findById(id) {
        const sql = `SELECT * FROM members WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // ===== CREATE MEMBER =====
    static create(member) {
        const sql = `
            INSERT INTO members (name, email, phone, status)
            VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(
                sql,
                [member.name, member.email, member.phone, member.status || 'active'],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });
    }

    // ===== UPDATE MEMBER =====
    static update(id, member) {
        const sql = `
            UPDATE members
            SET name = ?, email = ?, phone = ?, status = ?
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.run(
                sql,
                [member.name, member.email, member.phone, member.status, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });
    }
}

module.exports = MemberDatabase;
