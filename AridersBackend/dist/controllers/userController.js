"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMember = exports.registerMember = exports.allMembers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userValidator_1 = require("../validators/userValidator");
const server_1 = require("../server");
//all members
const allMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield server_1.supabase.rpc('get_members');
        if (error) {
            console.error('RPC Error:', error);
            res.status(500).json({ message: 'Error fetching riders', error });
        }
        res.status(200).json({
            message: 'okay',
            data,
        });
    }
    catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).json({ message: 'Unexpected error', error: err });
    }
});
exports.allMembers = allMembers;
//add member
const registerMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, password, phone_number, email } = req.body;
    const { error: validationError } = userValidator_1.userRegisterValidationSchema.validate(req.body);
    if (validationError) {
        res.status(400).json({ error: validationError.details[0].message });
    }
    try {
        let id = (0, uuid_1.v4)();
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        const { data, error } = yield server_1.supabase.rpc('insert_member', {
            p_id: id,
            p_first_name: first_name,
            p_last_name: last_name,
            p_email: email,
            p_password: hashedPassword,
            p_phone_number: phone_number,
        });
        if (error) {
            console.error('RPC Error:', error);
            res.status(500).json({ message: error.message });
        }
        res.status(201).json({
            message: 'registration successfull',
            data,
        });
    }
    catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).json({ message: 'Unexpected error', error: err });
    }
});
exports.registerMember = registerMember;
//login member
const loginMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { error: validationError } = userValidator_1.loginMemberValidationSchema.validate(req.body);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        res.status(500).json({ message: 'JWT_SECRET issue' });
    }
    if (validationError) {
        res.status(400).json({ error: validationError.details[0].message });
    }
    try {
        const { data, error } = yield server_1.supabase.rpc('login_member', {
            p_email: email,
        });
        if (error) {
            res.status(400).json({ message: error.message });
        }
        const member = data;
        const isPasswordValid = yield bcrypt_1.default.compare(password, member.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'password is incorrect' });
        }
        if (!JWT_SECRET) {
            res.status(500).json({ message: 'JWT_SECRET is not defined' });
        }
        const token = jsonwebtoken_1.default.sign({ id: member.id, email: member.email, role: member.role }, JWT_SECRET, { expiresIn: '7d' });
        delete member.password;
        res.status(200).json({
            message: 'login successful',
            data: member,
            token
        });
    }
    catch (error) {
        console.log('login error', error);
        res.status(500).json({ message: 'server error', error: error });
    }
});
exports.loginMember = loginMember;
