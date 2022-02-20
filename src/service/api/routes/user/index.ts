import { Router } from 'express'
import UserActuator from 'actuators/user'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password
    } = req.body

    const token = await UserActuator.register({
      firstName,
      lastName,
      email,
      password
    })

    res.json({
      success: true,
      data   : token
    })
  } catch (error: any) {
    res
      .status(500)
      .json({
        error  : error.message,
        success: false
      })
  }
})

export default router

