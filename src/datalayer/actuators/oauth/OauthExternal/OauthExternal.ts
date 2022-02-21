interface TokenInfo {
  firstName?: string;
  lastName?: string;
  photo?: string;
  userId?: string;
  expiresAt: number;
  email?: string;
  emailVerified?: boolean;
}

abstract class OauthExternal {
  // eslint-disable-next-line
  async getTokenInfo(accessToken: string): Promise<TokenInfo> {
    throw new Error('Not implemented')
  }
}

export default OauthExternal
