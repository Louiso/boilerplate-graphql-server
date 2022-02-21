import ClientModel from 'models/mongo/client'
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

    if(req.get('origin') === process.env.AUTH_APP)
      req.body = {
        ...req.body,
        client_secret: process.env.CLIENT_SECRET,
        client_id    : process.env.CLIENT_ID
      }

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

    if(req.get('origin') === process.env.AUTH_APP) {
      const client = await ClientModel
        .findById(process.env.CLIENT_ID)
        .select('redirectUris')
        .lean()

      if(!client) throw new Error('Client not found')

      req.body = {
        ...req.body,
        client_secret: process.env.CLIENT_SECRET,
        client_id    : process.env.CLIENT_ID,
        redirect_uri : client.redirectUris[0]
      }
    }

    console.log('req.body', req.body)

    const request = new Request(req)
    const response = new Response(res)

    const token = await OauthActuator.token(request, response)

    res.json({
      success: true,
      data   : token
    })
  } catch (error: any) {
    console.log('Luis Sullca ~ file: index.ts ~ line 94 ~ router.post ~ error', error)
    res
      .status(500)
      .json({
        error  : error.message,
        success: false
      })
  }
})

export default router

