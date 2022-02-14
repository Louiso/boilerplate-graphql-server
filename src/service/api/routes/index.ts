import { Router } from 'express'
import authController  from './auth'

const router = Router()

router.use('/auth', authController)

export default router
