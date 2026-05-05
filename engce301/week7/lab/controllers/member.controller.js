const MemberService = require('../services/member.service');

class MemberController {

    // GET /api/members
    static async getAll(req, res, next) {
        try {
            const members = await MemberService.getAllMembers();
            res.json({ success: true, data: members });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/members/:id
    static async getById(req, res, next) {
        try {
            const member = await MemberService.getMemberById(req.params.id);
            res.json({ success: true, data: member });
        } catch (err) {
            err.status = 404;
            next(err);
        }
    }

    // POST /api/members
    static async create(req, res, next) {
        try {
            const member = await MemberService.createMember(req.body);
            res.status(201).json({
                success: true,
                message: 'Member created successfully',
                data: member
            });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    }

    // PUT /api/members/:id
    static async update(req, res, next) {
        try {
            const result = await MemberService.updateMember(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Member updated successfully',
                data: result
            });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    }
}

module.exports = MemberController;
