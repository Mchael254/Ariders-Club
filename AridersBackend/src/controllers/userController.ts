import express, { Request, Response } from 'express'
import bcrypt from "bcrypt";
import { v4 } from 'uuid';
import multer from 'multer';
import jwt from 'jsonwebtoken'
import { loginMemberValidationSchema, userRegisterValidationSchema } from '../validators/userValidator';
import { supabase } from '../server';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv'
dotenv.config();


const storage = multer.memoryStorage();
export const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret

})

//all members
export const allMembers = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.rpc('get_members');

        if (error) {
            console.error('RPC Error:', error);
            res.status(500).json({ message: 'Error fetching riders', error });
        }

        res.status(200).json({
            message: 'okay',
            data,
        });
    } catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).json({ message: 'Unexpected error', error: err });
    }
};


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
export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.userId;
  
    if (!req.file || !userId) {
      res.status(400).json({ message: 'Missing profile picture or user ID.' });
      return;
    }
  
    try {
      const uploadStream = () =>
        new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile_pics',
              public_id: `user_${userId}_${Date.now()}`,
              transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
                { fetch_format: 'auto', quality: 'auto' }
              ],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
  
          if (req.file) {
            stream.end(req.file.buffer);
          } else {
            reject(new Error('File buffer is undefined.'));
          }
        });
  
      const result = await uploadStream();
  
      const { error: updateError } = await supabase
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
  
    } catch (error) {
      console.error('Upload failed:', error);
      res.status(500).json({ message: 'Failed to upload image', error });
    }
  };
  