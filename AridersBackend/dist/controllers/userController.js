"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updateProfilePicture = exports.allMembers = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const server_1 = require("../server");
const cloudinary_1 = require("cloudinary");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
cloudinary_1.v2.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
});
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
// export const registerMember = async (req: Request, res: Response) => {
//     const { first_name, last_name, password, phone_number, email, role } = req.body;
//     const { error: validationError } = userRegisterValidationSchema.validate(req.body)
//     if (validationError) {
//         res.status(400).json({ error: validationError.details[0].message });
//         return;
//     }
//     try {
//         let id = v4()
//         const hashedPassword = await bcrypt.hash(password, 5);
//         const { data, error } = await supabase.rpc('register_member', {
//             p_id: id,
//             p_first_name: first_name,
//             p_last_name: last_name,
//             p_email: email,
//             p_password: hashedPassword,
//             p_phone_number: phone_number,
//             p_role: role
//         });
//         if (error) {
//             console.error('RPC Error:', error);
//             res.status(500).json({ message: error.message });
//         }
//         res.status(201).json({
//             message: 'registrations successfull',
//             data,
//         });
//     } catch (err) {
//         console.error('Unexpected Error:', err);
//         res.status(500).json({ message: 'Unexpected error', error: err });
//     }
// };
//update profile picture
const updateProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    if (!req.file || !userId) {
        res.status(400).json({ message: 'Missing profile picture or user ID.' });
        return;
    }
    try {
        const uploadStream = () => new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'profile_pics',
                public_id: `user_${userId}_${Date.now()}`,
                transformation: [
                    { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
                    { fetch_format: 'auto', quality: 'auto' }
                ],
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            if (req.file) {
                stream.end(req.file.buffer);
            }
            else {
                reject(new Error('File buffer is undefined.'));
            }
        });
        const result = yield uploadStream();
        const { error: updateError } = yield server_1.supabase
            .from('members')
            .update({ profile_image: result.secure_url })
            .eq('id', userId);
        if (updateError) {
            console.error('Supabase update error:', updateError);
            res.status(500).json({ message: 'Image uploaded but failed to update DB', error: updateError });
            return;
        }
        res.status(200).json({
            message: 'Profile picture updated successfully.',
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });
    }
    catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ message: 'Failed to upload image', error });
    }
});
exports.updateProfilePicture = updateProfilePicture;
