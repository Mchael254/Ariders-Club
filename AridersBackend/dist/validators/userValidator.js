"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMemberValidationSchema = exports.userRegisterValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userRegisterValidationSchema = joi_1.default.object({
    first_name: joi_1.default.string().required().min(2).max(30),
    last_name: joi_1.default.string().required().min(2).max(30),
    email: joi_1.default.string().email({
        minDomainSegments: 2, tlds: {
            allow: ['ke', 'com']
        }
    }),
    phone_number: joi_1.default.string().required().min(10).max(10),
    password: joi_1.default.string().required().pattern(new RegExp('^[a-zA-Z0-9!@#%$&*()]{0,30}$')),
    role: joi_1.default.string()
});
exports.loginMemberValidationSchema = joi_1.default.object({
    email: joi_1.default.string().required().email({
        minDomainSegments: 2, tlds: {
            allow: ['ke', 'com']
        }
    }),
    password: joi_1.default.string().required()
});
