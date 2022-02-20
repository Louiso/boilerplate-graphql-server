import { Router } from 'express'
import authController  from './auth'
import userController  from './user'

const router = Router()

router.use('/auth', authController)
router.use('/user', userController)

export default router
