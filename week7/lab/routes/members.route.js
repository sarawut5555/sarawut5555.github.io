const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/member.controller');

// Members API (4 endpoints)
router.get('/', MemberController.getAll);         // GET /api/members
router.get('/:id', MemberController.getById);     // GET /api/members/:id
router.post('/', MemberController.create);        // POST /api/members
router.put('/:id', MemberController.update);      // PUT /api/members/:id

module.exports = router;
