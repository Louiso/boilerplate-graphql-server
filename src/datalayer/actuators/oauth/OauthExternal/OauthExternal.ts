interface TokenInfo {
  //  aud: string;
  userId?: string;
  //  scopes: string[];
  expiresAt: number;
  // sub?: string;
  //  azp?: string;
  accessType?: string;
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
