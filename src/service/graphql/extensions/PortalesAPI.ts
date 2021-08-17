import { Maybe } from 'graphql/jsutils/Maybe'
import { Theme } from 'interfaces/graphql'
import DataSource from './DataSource'

interface GetThemeArgs {
  slug?: Maybe<string>;
}

interface GetThemeResponse {
  success: boolean;
  message: string;
  theme: Theme;
  cssTextFamily: string;
}

interface GetLaborExchangeBySlugArgs {
  slug: string;
}

interface GetLaborExchangeBySlugResponse {
  data: {
    _id: string;
    name: string;
    slug: string;
  };
  success: boolean;
}

class PortalesAPI extends DataSource {
  constructor(authorization: string) {
    super(`${process.env.PORTALES_API as string}/api/v1`, authorization)
    // this.baseURL =
  }
  async getTheme(data: GetThemeArgs): Promise<GetThemeResponse> {
    try {
      return this.get<GetThemeResponse>(`/laborexchange/theme/slug/${data.slug || 'krowdy'}`, data)
    } catch (error) {
      throw error
    }
  }

  async getLaborExchangeBySlug(data: GetLaborExchangeBySlugArgs): Promise<GetLaborExchangeBySlugResponse> {
    try {
      return this.get<GetLaborExchangeBySlugResponse>(`/laborexchange/${data.slug}/bySlug`)
    } catch (error) {
      throw error
    }
  }
}

export default PortalesAPI
