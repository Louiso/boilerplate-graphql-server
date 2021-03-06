import ClientModel from 'models/mongo/client'
import OauthTokenModel from 'models/mongo/oauthToken'
import UserModel from 'models/mongo/user'
import AuthorizationCodeModel from 'models/mongo/authorizationCode'
import OAuth2Server from 'oauth2-server'
import OauthExternalFactory from './OauthExternal'
import bcrypt from 'bcrypt'
import UserActuator from '../user'

const Scopes = {
  AuthRead : 'auth:read',
  AuthWrite: 'auth:write'
}

const VALID_SCOPES = [
  Scopes.AuthRead,
  Scopes.AuthWrite
]

const { CLIENT_ID: AUTH_CLIENT_ID } = process.env

/*
  flows:
    grant_type: authorization_code
      getAuthorizationCode
      revokeAuthorizationCode
    grant_type: password

*/

const OauthActuator = new OAuth2Server({
  model: {
    getAuthorizationCode: async (code: string) => {
      try {
        console.log('Luis Sullca ~ file: index.ts ~ line 31 ~ getAuthorizationCode: ~ getAuthorizationCode')
        const [ service, serviceCode ] = code.split(':')

        let oauthToken: {
          authorizationCode: string;
          expiresAt        : Date;
          scope            : string;
          userId           : string;
          clientId         : string;
        }

        if(!serviceCode) {
          oauthToken = await AuthorizationCodeModel.findOne({ authorizationCode: code }).lean()
        } else {
          const oauthExternalController = OauthExternalFactory.getInstance(service)

          const tokenInfo = await oauthExternalController.getTokenInfo(serviceCode)

          const [ client, _user ] = await Promise.all([
            ClientModel.findOne({ _id: AUTH_CLIENT_ID }).lean(),
            UserActuator.getBasicUserInformation({ email: tokenInfo.email })
          ])

          let user = _user

          if(!client) throw new Error('Client not found')
          if(!user)
            user = await UserModel.create({
              email        : tokenInfo.email,
              firstName    : tokenInfo.firstName,
              lastName     : tokenInfo.lastName,
              photo        : tokenInfo.photo,
              emailVerified: tokenInfo.emailVerified,
              providers    : [ {
                name         : service,
                emailVerified: tokenInfo.emailVerified
              } ]
            })

          oauthToken = {
            authorizationCode: code,
            expiresAt        : new Date(tokenInfo.expiresAt),
            scope            : Object.values(Scopes).filter((scope) => scope.includes('auth')).join(' '),
            userId           : String(user._id),
            clientId         : String(client._id)
          }
        }

        /* recibir el accessToken del servicio externo y validar */

        if(!oauthToken) throw new Error('Invalid access token')

        const results = await Promise.all([
          ClientModel
            .findOne({ _id: oauthToken.clientId })
            .lean(),
          UserActuator.getBasicUserInformation({ _id: oauthToken.userId })
        ]).then(([ client, user ]) => ({
          code             : oauthToken.authorizationCode,
          expiresAt        : oauthToken.expiresAt,
          scope            : oauthToken.scope,
          authorizationCode: oauthToken.authorizationCode,
          redirectUri      : client!.redirectUris[0],
          client           : {
            id          : String(client!._id),
            grants      : client!.grants,
            redirectUris: client!.redirectUris
          },
          user: {
            id: String(user!._id),
            ...user
          }
        }))

        return results
      } catch (error) {
        throw error
      }
    },
    getRefreshToken: async (refreshToken) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 115 ~ getRefreshToken: ~ getRefreshToken')
      const oauthToken = await OauthTokenModel.findOne({ refreshToken }).lean()

      if(!oauthToken) throw new Error('Invalid refreshToken')

      const now = new Date().getTime()

      return Promise.all([
        ClientModel
          .findOne({ _id: oauthToken.clientId })
          .lean(),
        UserActuator.getBasicUserInformation({ _id: oauthToken.userId })
      ]).then(([ client, user ]) => ({
        accessToken          : oauthToken.accessToken,
        accessTokenExpiresAt : oauthToken.accessTokenExpiresAt,
        refreshToken         : oauthToken.refreshToken,
        refreshTokenExpiresAt: oauthToken.refreshTokenExpiresAt,
        scope                : oauthToken.scope,
        client               : {
          id                  : String(client!._id),
          grants              : client!.grants,
          redirectUris        : client!.redirectUris,
          accessTokenLifetime : new Date(oauthToken.accessTokenExpiresAt).getTime() - now,
          refreshTokenLifetime: new Date(oauthToken.refreshTokenExpiresAt).getTime() - now
        },
        user: {
          id: String(user!._id),
          ...user
        }
      }))
    },
    getAccessToken: async (accessToken: string) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 119 ~ getAccessToken: ~ getAccessToken')
      const oauthToken = await OauthTokenModel.findOne({ accessToken }).lean()

      if(!oauthToken) throw new Error('Invalid access token')

      const now = new Date().getTime()

      return Promise.all([
        ClientModel.findOne({ _id: oauthToken.clientId }).lean(),
        UserActuator.getBasicUserInformation({ _id: oauthToken.userId })
      ]).then(([ client, user ]) => ({
        accessToken          : oauthToken.accessToken,
        accessTokenExpiresAt : oauthToken.accessTokenExpiresAt,
        refreshToken         : oauthToken.refreshToken,
        refreshTokenExpiresAt: oauthToken.refreshTokenExpiresAt,
        scope                : oauthToken.scope,
        client               : {
          id                  : String(client!._id),
          grants              : client!.grants,
          redirectUris        : client!.redirectUris,
          accessTokenLifetime : new Date(oauthToken.accessTokenExpiresAt).getTime() - now,
          refreshTokenLifetime: new Date(oauthToken.refreshTokenExpiresAt).getTime() - now
        },
        user: {
          id: String(user!._id),
          ...user
        }
      }))
    },
    getClient: async (clientId, clientSecret) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 187 ~ getClient: ~ getClient')

      const params: any = { _id: clientId }
      if(clientSecret)
        params.secret = clientSecret

      const client = await ClientModel.findOne(params).lean()

      if(!client) throw new Error('Client notfound')

      return ({
        id          : String(client._id),
        redirectUris: client.redirectUris,
        grants      : client.grants,
        userId      : String(client.userId)
      })
    },
    getUser: async (email, password) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 190 ~ getUser: ~ getUser')
      const user = await UserModel.findOne({ email }).lean()

      if(!user) throw new Error('email or password incorrect')

      const validationPassword = await bcrypt.compare(password, user.password)
      if(!validationPassword) throw new Error('email or password incorrect')

      delete(user as any).password

      return {
        id: String(user._id),
        ...user
      }
    },
    getUserFromClient: async (client) => { // para grant_type: client_credentials
      console.log('Luis Sullca ~ file: index.ts ~ line 206 ~ getUserFromClient: ~ client')
      const user = await UserModel.findOne({ _id: client.userId }).lean()

      if(!user) throw new Error('User notfound')

      delete(user as any).password

      return {
        id: String(user._id),
        ...user
      }
    },
    saveToken: async (token, client, user) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 219 ~ saveToken: ~ saveToken')
      const oauthToken = await OauthTokenModel
        .create({
          accessToken          : token.accessToken,
          accessTokenExpiresAt : token.accessTokenExpiresAt,
          refreshToken         : token.refreshToken,
          refreshTokenExpiresAt: token.refreshTokenExpiresAt,
          scope                : token.scope,
          clientId             : client.id,
          userId               : user.id
        })

      if(!oauthToken) throw new Error("Can't save token")

      return ({
        accessToken          : oauthToken.accessToken,
        accessTokenExpiresAt : oauthToken.accessTokenExpiresAt,
        refreshToken         : oauthToken.refreshToken,
        refreshTokenExpiresAt: oauthToken.refreshTokenExpiresAt,
        scope                : oauthToken.scope,
        client,
        user
      })
    },
    saveAuthorizationCode: async (code, client, user) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 244 ~ saveAuthorizationCode: ~ saveAuthorizationCode')
      const authorizationCode = await AuthorizationCodeModel
        .create({
          authorizationCode: code.authorizationCode,
          expiresAt        : code.expiresAt,
          redirectUri      : code.redirectUri,
          scope            : code.scope,
          clientId         : client.id,
          userId           : user.id
        })

      if(!authorizationCode) throw new Error("Can't save authorizationCode")

      return ({
        authorizationCode: authorizationCode.authorizationCode,
        expiresAt        : authorizationCode.expiresAt,
        redirectUri      : authorizationCode.redirectUri,
        scope            : authorizationCode.scope,
        client,
        user
      })
    },
    revokeAuthorizationCode: async (code) => {
      const [ , serviceCode ] = code.authorizationCode.split(':')

      if(serviceCode) {
        return true
      } else {
        const oauthToken = await AuthorizationCodeModel.deleteOne({ authorizationCode: code.authorizationCode }).lean()

        return oauthToken.deletedCount > 0
      }
    },
    revokeToken: async (token) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 273 ~ revokeToken: ~ revokeToken')
      const oauthToken = await OauthTokenModel.deleteOne({ refreshToken: token.refreshToken }).lean()

      return oauthToken.deletedCount > 0
    },
    validateScope: async (user, client, scope) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 279 ~ validateScope: ~ validateScope')
      if(!(Array.isArray(scope)  ? scope : (scope ?? '').split(' ')).every(s => VALID_SCOPES.indexOf(s) >= 0))
        return false

      return scope
    },
    verifyScope: async (token, scope) => {
      console.log('Luis Sullca ~ file: index.ts ~ line 286 ~ verifyScope: ~ verifyScope')
      if(!token.scope)
        return false

      const requestedScopes = (Array.isArray(scope) ? scope : (scope ?? '').split(' '))
      const authorizedScopes = (Array.isArray(token.scope)  ? token.scope : (token.scope ?? '').split(' '))

      return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0)
    }
  }
})

export default OauthActuator
