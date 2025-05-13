"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const user_router = (0, express_1.default)();
user_router.get('/allMembers', auth_1.authenticateToken, userController_1.allMembers);
user_router.post('/upload-profile-picture', userController_1.upload.single('image'), userController_1.updateProfilePicture);
exports.default = user_router;
