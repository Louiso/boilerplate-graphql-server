import AccountAPI from './extensions/AccountAPI'
import GatsAPI from './extensions/GatsAPI'
import ResponsablesAPI from './extensions/ResponsablesAPI'

export default (authorization: string) => ({
  accountAPI     : new AccountAPI(authorization),
  gatsAPI        : new GatsAPI(authorization),
  responsablesAPI: new ResponsablesAPI(authorization)
  // https://www.apollographql.com/docs/apollo-server/data/data-sources
  // responsablesAPI   : new datasources.ResponsablesAPI()
})
