📚 Library Management System API

ENGCE301 – Week 7 Lab

RESTful API สำหรับระบบจัดการห้องสมุด
พัฒนาโดยใช้ Node.js, Express.js และ SQLite
ออกแบบตาม Layered Architecture (4 Layers)

📌 Features
จัดการข้อมูลหนังสือ (Books)
จัดการสมาชิก (Members)
ระบบยืม–คืนหนังสือ (Borrowings)
ตรวจสอบหนังสือเกินกำหนด (Overdue)
Business Logic ครบตามโจทย์

🛠️ Tech Stack
Backend: Node.js + Express.js
Database: SQLite
Architecture: Layered Architecture
Tools: Postman, DB Browser for SQLite

📂 Project Structure
engce301-week7-lab/
├── database/
│   ├── connection.js
│   ├── schema.sql
│   ├── init-db.js
│   ├── books.db.js
│   ├── members.db.js
│   └── borrowings.db.js
├── services/
│   ├── book.service.js
│   ├── member.service.js
│   └── borrowing.service.js
├── controllers/
│   ├── book.controller.js
│   ├── member.controller.js
│   └── borrowing.controller.js
├── routes/
│   ├── books.route.js
│   ├── members.route.js
│   └── borrowings.route.js
├── screenshots/
│   ├── postman_test1.png
│   ├── postman_test2.png
│   └── er_diagram.png
├── postman/
│   └── Library_API.postman_collection.json
├── server.js
├── package.json
└── README.md

🚀 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/engce301-week7-lab.git
cd engce301-week7-lab

2️⃣ Install Dependencies
npm install

3️⃣ Initialize Database
npm run init-db

4️⃣ Start Server
npm run dev


Server จะรันที่
👉 http://localhost:3000

🌐 API Endpoints
📘 Books API (5 Endpoints)
Method	Endpoint	Description
GET	/api/books	ดึงหนังสือทั้งหมด
GET	/api/books/:id	ดึงหนังสือ 1 เล่ม
GET	/api/books/search?q=ค้นหาหนังสือ
POST	/api/books	เพิ่มหนังสือ
PUT	/api/books/:id	แก้ไขหนังสือ

👤 Members API (4 Endpoints)
Method	Endpoint	Description
GET	/api/members	ดึงสมาชิกทั้งหมด
GET	/api/members/:id	ดึงสมาชิก 1 คน
POST	/api/members	เพิ่มสมาชิก
PUT	/api/members/:id	แก้ไขสมาชิก

🔄 Borrowings API (6 Endpoints)
Method	Endpoint	Description
GET	/api/borrowings	ดึงรายการยืมทั้งหมด
GET	/api/borrowings/:id	ดึงรายการยืม 1 รายการ
GET	/api/borrowings/member/:memberId	ดูการยืมของสมาชิก
POST	/api/borrowings/borrow	ยืมหนังสือ
PUT	/api/borrowings/:id/return	คืนหนังสือ
GET	/api/borrowings/overdue	ดูรายการเกินกำหนด

🧪 Example Test (Postman)
Borrow Book (Success)

POST /api/borrowings/borrow
{
  "book_id": 1,
  "member_id": 1
}

Response
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "id": 4,
    "book_id": 1,
    "member_id": 1,
    "status": "borrowed"
  }
}

Return Book (Overdue)
PUT /api/borrowings/1/return
{
  "success": true,
  "message": "Book returned successfully",
  "data": {
    "id": 1,
    "days_overdue": 3,
    "fine": 60
  }
}

🧠 Business Logic
สมาชิกต้องมีสถานะ active
หนังสือต้องมี available_copies > 0
สมาชิกยืมได้ไม่เกิน 3 เล่ม
ระยะเวลายืม 14 วัน
ค่าปรับ 20 บาท/วัน หากเกินกำหนด
ระบบปรับ available_copies อัตโนมัติ

📊 ER Diagram
ดูได้ที่
screenshots/er_diagram.png

🧪 Testing
ทดสอบทุก Endpoint ด้วย Postman
มี Screenshot การทดสอบในโฟลเดอร์ screenshots/
Export Postman Collection ใน postman/

👨‍🎓 Author
ชื่อ: นายศราวุฒิ ข่ายแก้ว
รหัสนักศึกษา: 67543206076-1
รายวิชา: ENGCE301