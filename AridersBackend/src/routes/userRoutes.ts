import Router from 'express'
import {allMembers, loginMember, registerMember} from '../controllers/userController'
import { authenticateToken } from '../middlewares/auth'

const user_router = Router()

user_router.post('/registerMember',registerMember)
user_router.get('/allMembers',authenticateToken, allMembers)
user_router.post('/loginMember',loginMember)


export default user_router