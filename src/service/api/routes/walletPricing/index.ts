import { Router } from 'express'
import { auth } from '../../middlewares/auth'
import PricingController from '../../controllers/pricing'

const router = Router()

router.use(auth)

router.post('/codes', async (req, res) => {
  try {
    const { tasks } = req.body
    const valid = await PricingController.getCodes({ tasks })
    res.json({ data: valid, success: true })
  } catch (error) {
    res.json({ error: { message: error.message }, success: false })
  }
})

export default router
