import GoogleOauthExternal from './GoogleOauthExternal'

class OauthExternalFactory {
  static getInstance(service: string) {
    switch (service) {
      case 'google': {
        return new GoogleOauthExternal()
      }
      default: {
        throw new Error(`Unknown service ${service}`)
      }
    }
  }
}

export default OauthExternalFactory
