const MemberDB = require('../database/members.db');

class MemberService {

    // ===== GET ALL MEMBERS =====
    static async getAllMembers() {
        return await MemberDB.findAll();
    }

    // ===== GET MEMBER BY ID =====
    static async getMemberById(id) {
        const member = await MemberDB.findById(id);
        if (!member) {
            throw new Error('Member not found');
        }
        return member;
    }

    // ===== CREATE MEMBER =====
    static async createMember(memberData) {
        const { name, email } = memberData;

        if (!name || !email) {
            throw new Error('Name and email are required');
        }

        return await MemberDB.create(memberData);
    }

    // ===== UPDATE MEMBER =====
    static async updateMember(id, memberData) {
        const member = await MemberDB.findById(id);
        if (!member) {
            throw new Error('Member not found');
        }

        return await MemberDB.update(id, memberData);
    }
}

module.exports = MemberService;
