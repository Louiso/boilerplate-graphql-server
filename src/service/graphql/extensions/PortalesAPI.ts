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

interface GetSimilarJobsArgs {
  search?: Maybe<string>;
  jobId: string;
  limit?: number;
  page?: number;
  slug?: Maybe<string>;
}

interface GetSimilarJobsResponse {
  data: {
    docs: {
      detailCompany?: {
        company_id: string;
        company_logo: string;
        company_name: string;
      };
      expirationDate: string;
      isLaborum: boolean;
      job_id: string;
      publishDate: string;
      title: string;
      visibleInformation: boolean;
      __typename: string;
    }[];
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
      return this.get<GetThemeResponse>(`/laborexchange/theme/slug/${data.slug || 'laborum'}`, data)
    } catch (error) {
      throw error
    }
  }

  async getLaborExchangeBySlug(data: GetLaborExchangeBySlugArgs): Promise<GetLaborExchangeBySlugResponse> {
    try {
      return this.get<GetLaborExchangeBySlugResponse>(`/laborexchange/${data.slug || 'laborum'}/bySlug`)
    } catch (error) {
      throw error
    }
  }

  async getSimilarJobs(data: GetSimilarJobsArgs): Promise<GetSimilarJobsResponse> {
    try {
      if(!data.slug) return {
        data: {
          docs: []
        },
        success: true
      }

      const { data: laborExchange } = await this.getLaborExchangeBySlug({ slug: data.slug || 'laborum' })

      return this.post<GetSimilarJobsResponse>(`/elastic/laborExchange/${laborExchange._id}/jobs`, {
        limit : data.limit ?? 30,
        page  : data.page ?? 1,
        jobId : data.jobId,
        search: data.search
      })
    } catch (error) {
      throw error
    }
  }
}

export default PortalesAPI
