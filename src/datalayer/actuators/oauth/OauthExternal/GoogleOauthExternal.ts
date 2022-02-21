import { OAuth2Client } from 'google-auth-library'
import OauthExternal from './OauthExternal'

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class GoogleOauthExternal extends OauthExternal {
  async getTokenInfo(accessToken: string) {
    try {
      const ticket = await oAuth2Client.verifyIdToken({ audience: process.env.GOOGLE_API_KEY, idToken: accessToken })
      const tokenInfo = ticket.getPayload()

      if(!tokenInfo) throw new Error('Token info not found')

      return {
        expiresAt    : new Date().getTime() + tokenInfo?.exp,
        email        : tokenInfo?.email,
        emailVerified: tokenInfo?.email_verified,
        firstName    : tokenInfo?.given_name,
        lastName     : tokenInfo?.family_name,
        photo        : tokenInfo?.picture
      }
    } catch (error) {
      throw error
    }
  }
}

export default GoogleOauthExternal

