# 📚 Library Management System API

**ENGCE301 – Week 7 Lab**

RESTful API สำหรับระบบจัดการห้องสมุด  
พัฒนาโดยใช้ **Node.js, Express.js และ SQLite**  
ออกแบบตามแนวคิด **Layered Architecture (4 Layers)**

---

## 📌 Features
- จัดการข้อมูลหนังสือ (Books)
- จัดการสมาชิก (Members)
- ระบบยืม–คืนหนังสือ (Borrowings)
- ตรวจสอบหนังสือที่เกินกำหนด (Overdue)
- มี Business Logic ครบตามโจทย์ที่กำหนด

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Architecture:** Layered Architecture
- **Tools:** Postman, DB Browser for SQLite

---

## 📂 Project Structure
week7/lab/
├── database/
│ ├── connection.js
│ ├── schema.sql
│ ├── init-db.js
│ ├── books.db.js
│ ├── members.db.js
│ └── borrowings.db.js
├── services/
│ ├── book.service.js
│ ├── member.service.js
│ └── borrowing.service.js
├── controllers/
│ ├── book.controller.js
│ ├── member.controller.js
│ └── borrowing.controller.js
├── routes/
│ ├── books.route.js
│ ├── members.route.js
│ └── borrowings.route.js
├── screenshots/
│ ├── postman_test1.png
│ ├── postman_test2.png
│ └── er_diagram.png
├── postman/
│ └── Library_API.postman_collection.json
├── server.js
├── package.json
└── README.md


---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository
```bash
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
```
🌐 API Endpoints
📘 Books API
| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/books`           | ดึงหนังสือทั้งหมด |
| GET    | `/api/books/:id`       | ดึงหนังสือ 1 เล่ม |
| GET    | `/api/books/search?q=` | ค้นหาหนังสือ      |
| POST   | `/api/books`           | เพิ่มหนังสือ      |
| PUT    | `/api/books/:id`       | แก้ไขหนังสือ      |

👤 Members API
| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/api/members`     | ดึงสมาชิกทั้งหมด |
| GET    | `/api/members/:id` | ดึงสมาชิก 1 คน   |
| POST   | `/api/members`     | เพิ่มสมาชิก      |
| PUT    | `/api/members/:id` | แก้ไขสมาชิก      |

🔄 Borrowings API
| Method | Endpoint                           | Description         |
| ------ | ---------------------------------- | ------------------- |
| GET    | `/api/borrowings`                  | ดึงรายการยืมทั้งหมด |
| GET    | `/api/borrowings/:id`              | ดึงรายการยืม        |
| GET    | `/api/borrowings/member/:memberId` | ดูการยืมของสมาชิก   |
| POST   | `/api/borrowings/borrow`           | ยืมหนังสือ          |
| PUT    | `/api/borrowings/:id/return`       | คืนหนังสือ          |
| GET    | `/api/borrowings/overdue`          | ดูรายการเกินกำหนด   |

🧠 Business Logic
<ul>
  <li>สมาชิกต้องมีสถานะ active</li>
  <li>หนังสือต้องมี available_copies > 0</li>
  <li>สมาชิกยืมหนังสือได้ไม่เกิน 3 เล่ม</li>
  <li>ระยะเวลาการยืม 14 วัน</li>
  <li>ค่าปรับ 20 บาท/วัน หากคืนเกินกำหนด</li>
  <li>เมื่อยืม / คืน ระบบจะปรับ available_copies อัตโนมัติ</li>
  <li>ไม่สามารถคืนหนังสือซ้ำได้</li>
</ul>

📊 ER Diagram
แผนภาพความสัมพันธ์ฐานข้อมูล (ER Diagram)
ดูได้ที่ไฟล์: `screenshots/er_diagram.png`

🧪 Testing
<ul>
  <li>ทดสอบทุก API Endpoint ด้วย Postman</li>
  <li>มี Screenshot การทดสอบอยู่ในโฟลเดอร์ screenshots</li>
  <li>มีไฟล์ Postman Collection สำหรับ Import: </li>
  <li>`postman/Library_API.postman_collection.json`</li>
</ul>

👨‍🎓 Author
<li>ชื่อ: นายศราวุฒิ ข่ายแก้ว</li>
<li>รหัสนักศึกษา: 67543206076-1</li>
<li>รายวิชา: ENGCE301</li>
<li>สาขา: วิศวกรรมคอมพิวเตอร์</li>