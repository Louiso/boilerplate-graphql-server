import AccountAPI from './extensions/AccountAPI'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (authorization: string) => ({
  accountAPI: new AccountAPI(authorization)
})
