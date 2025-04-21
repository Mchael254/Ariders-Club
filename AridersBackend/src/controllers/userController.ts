import express, { Request, Response } from 'express'
import bcrypt from "bcrypt";
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken'
import { loginMemberValidationSchema, userRegisterValidationSchema } from '../validators/userValidator';
import { supabase } from '../server';




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
export const registerMember = async (req: Request, res: Response) => {
    const { first_name, last_name, password, phone_number, email} = req.body;
    const { error: validationError } = userRegisterValidationSchema.validate(req.body)

    if (validationError) {
        res.status(400).json({ error: validationError.details[0].message });
    }

    try {

        let id = v4()
        const hashedPassword = await bcrypt.hash(password, 5);

        const { data, error } = await supabase.rpc('insert_member', {
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
    } catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).json({ message: 'Unexpected error', error: err });
    }
};

//login member
export const loginMember = async (req:Request, res:Response)=> {

    const {email, password} = req.body;
    const {error:validationError} = loginMemberValidationSchema.validate(req.body);
    const JWT_SECRET:any = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
         res.status(500).json({ message: 'JWT_SECRET issue' });
    }

    if(validationError){
        res.status(400).json({error:validationError.details[0].message});
    }

    try {
        const {data, error} = await supabase.rpc('login_member',{
            p_email:email,
        });
        if(error){
            res.status(400).json({message:error.message});
        }

        const member = data;
        const isPasswordValid = await bcrypt.compare(password,member.password)

        if(!isPasswordValid){
         res.status(401).json({message:'password is incorrect'})
        }

    if (!JWT_SECRET) {
        res.status(500).json({ message: 'JWT_SECRET is not defined' });
    }

    const token = jwt.sign(
        { id: member.id, email: member.email, role: member.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
        
        delete member.password

        res.status(200).json({
            message:'login successful',
            data:member,
            token
        });
        
    } catch (error) {
        console.log('login error', error);
         res.status(500).json({message:'server error', error:error})
    
    }

}

