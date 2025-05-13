import Router from 'express'
import {allMembers, updateProfilePicture, upload} from '../controllers/userController'
import { authenticateToken } from '../middlewares/auth'


const user_router = Router()

user_router.get('/allMembers',authenticateToken, allMembers)
user_router.post('/upload-profile-picture', upload.single('image'), updateProfilePicture);


export default user_router