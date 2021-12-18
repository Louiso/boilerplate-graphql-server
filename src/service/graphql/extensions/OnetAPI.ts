import { QueryGetGroupOnetSuggestionsArgs, OnetSuggestion } from 'interfaces/graphql'
import DataSource from './DataSource'

export interface OnetSuggestionResponse {
    success: boolean;
    information: OnetSuggestion[];
}

class OnetAPI extends DataSource {
  constructor(authorization: string) {
    super(process.env.APP_SCRAPPER_ONETS_URL as string, authorization)
  }

  async groupOnetSuggestions({ textSearch }: QueryGetGroupOnetSuggestionsArgs): Promise<OnetSuggestionResponse> {
    try {
      return this.get(`/api/v1/onet/find?key=${textSearch}`)
    } catch (error) {
      throw error
    }
  }

  async jobOnetSuggestions({ textSearch }: QueryGetGroupOnetSuggestionsArgs): Promise<OnetSuggestionResponse> {
    try {
      return this.get(`/api/v1/onet/find?key=${textSearch}`)
    } catch (error) {
      throw error
    }
  }
}

export default OnetAPI
