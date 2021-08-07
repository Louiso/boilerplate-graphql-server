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

class PortalesAPI extends DataSource {
  constructor(authorization: string) {
    super(`${process.env.PORTALES_API as string}/api/v1`, authorization)
    // this.baseURL =
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getTheme(data: GetThemeArgs) {
    try {
      return this.get<GetThemeResponse>(`/laborexchange/theme/slug/${data.slug || 'krowdy'}`, data)
    } catch (error) {
      throw error
    }
  }
}

export default PortalesAPI
