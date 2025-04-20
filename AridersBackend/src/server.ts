import express, { json, Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config();


import cors from 'cors'
import user_router from './routes/userRoutes';


const app = express()
app.use(json())
app.use(cors())

const port = 3000

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Supabase URL or Key is not defined in environment variables");
}

export const supabase = createClient(supabaseUrl as string, supabaseKey as string);

app.use('/user',user_router)


app.get('/',(req:Request, res:Response) => {
    res.send("welcome venum")
})

app.listen(port, () => {
    console.log(`server runnig on ${port}`);
    
})