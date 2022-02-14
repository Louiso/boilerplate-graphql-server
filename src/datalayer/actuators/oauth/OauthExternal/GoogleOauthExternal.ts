import { OAuth2Client } from 'google-auth-library'
import OauthExternal from './OauthExternal'

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class GoogleOauthExternal extends OauthExternal {
  async getTokenInfo(accessToken: string) {
    const tokenInfo = await oAuth2Client.getTokenInfo(
      accessToken
    )

    return {
      expiresAt    : tokenInfo.expiry_date,
      email        : tokenInfo.email,
      userId       : tokenInfo.user_id,
      accessType   : tokenInfo.access_type,
      emailVerified: tokenInfo.email_verified
    }
  }
}

export default GoogleOauthExternal

