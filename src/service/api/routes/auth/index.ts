import { Request, Response } from 'oauth2-server'
import { Router } from 'express'
import OauthActuator from 'actuators/oauth'

const router = Router()

router.get('/authenticate', async (req, res) => {
  try {
    const request = new Request(req)
    const response = new Response(res)

    const token = await OauthActuator.authenticate(request, response)
    console.log('token', token)

    res.json({
      success: true,
      data   : {}
    })
  } catch (error: any) {
    res.json({
      error  : error.message,
      success: false
    })
  }
})

// genera código de autorización
router.get('/authorize', async (req, res) => {
  try {
    const request = new Request(req)
    const response = new Response(res)

    const token = await OauthActuator.authorize(request, response)

    res.json({
      success: true,
      data   : token
    })
  } catch (error: any) {
    res.json({
      error  : error.message,
      success: false
    })
  }
})

// genera accessToken
router.post('/token', async (req, res) => {
  try {
    const request = new Request(req)
    const response = new Response(res)

    const token = await OauthActuator.token(request, response)

    res.json({
      success: true,
      data   : token
    })
  } catch (error: any) {
    console.log('error', error)
    res.json({
      error  : error.message,
      success: false
    })
  }
})

export default router

