import { Request, Response } from 'oauth2-server'
import { Router } from 'express'
import OauthActuator from 'actuators/oauth'

const router = Router()

router.get('/authenticate', async (req, res) => {
  try {
    const request = new Request(req)
    const response = new Response(res)

    const token = await OauthActuator.authenticate(request, response)

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
    res
      .status(500)
      .json({
        error  : error.message,
        success: false
      })
  }
})

// genera accessToken
router.post('/token', async (req, res) => {
  try {
    const { email, ...restProps } = req.body
    req.body = {
      ...restProps,
      client_secret: req.body?.client_secret ?? process.env.CLIENT_SECRET,
      username     : email
    }

    if(req.get('origin') === process.env.AUTH_APP)
      req.body = {
        ...req.body,
        client_secret: process.env.CLIENT_SECRET,
        client_id    : process.env.CLIENT_ID
      }

    const request = new Request(req)
    const response = new Response(res)

    const token = await OauthActuator.token(request, response)

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

