import { setRedis } from './../../../utils/redis'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Theme } from 'interfaces/graphql'
import { getRedis } from 'utils/redis'
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

interface CreatePostulationLogArgs {
  jobId?: string;
  slug?: Maybe<string>;
  user?: {
    email?: string;
    dni?: Maybe<string>;
    gender?: Maybe<string>;
    firstName?: string;
    lastName?: string;
    userId?: Maybe<string>;
    phone?: Maybe<string>;
    location?: Maybe<string>;
  };
}

interface GetSimilarJobsResponse {
  data: {
    docs: {
      detailCompany?: {
        company_id: string;
        company_logo: string;
        company_name: string;
      };
      isLaborum: boolean;
      job_id: string;
      publishDate: string;
      benefits: [ {
        description: string;
        title: string;
      } ];
      description: string;
      disability: unknown;
      expirationDate: string;
      first_publication_date: string;
      title: string;
      visibleInformation?: Maybe<boolean>;
      basicEdition: [ {
        _id: string;
        description: string;
        title: string;
        visible: boolean;
      } ];
      detailJob: [ {
        title?: string;
        value?: Maybe<string>;
      } ];
      requirements: [ {
        title?: string;
        value?: Maybe<string>;
      } ];
      __typename: string;
    }[];
  };
  success: boolean;
}

interface DefaultSuccessResponse {
  success: boolean;
  data?: any;
}

class PortalesAPI extends DataSource {
  constructor(authorization: string) {
    super(`${process.env.PORTALES_API as string}/api/v1`, authorization)
    // this.baseURL =
  }
  async getTheme(data: GetThemeArgs): Promise<GetThemeResponse> {
    try {
      const options = {
        slug         : data.slug || 'laborum',
        dataSourceUrl: process.env.PORTALES_API
      }

      const REDIS_KEY = `getTheme(${JSON.stringify(options)})`

      const redisData = await getRedis(REDIS_KEY) as GetThemeResponse

      if(redisData) return redisData

      const resultData = await this.get<GetThemeResponse>(`/laborexchange/theme/slug/${options.slug}`, data)

      setRedis(REDIS_KEY, resultData)

      return resultData
    } catch (error) {
      throw error
    }
  }

  async getLaborExchangeBySlug(data: GetLaborExchangeBySlugArgs): Promise<GetLaborExchangeBySlugResponse> {
    try {
      const options = {
        slug         : data.slug || 'laborum',
        dataSourceUrl: process.env.PORTALES_API
      }

      const REDIS_KEY = `getLaborExchangeBySlug(${JSON.stringify(options)})`

      const redisData = await getRedis(REDIS_KEY) as GetLaborExchangeBySlugResponse

      if(redisData) return redisData

      const resultData = await this.get<GetLaborExchangeBySlugResponse>(`/laborexchange/${options.slug}/bySlug`)

      setRedis(REDIS_KEY, resultData)

      return resultData
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

  createPostulationLog({ jobId, slug, user }: CreatePostulationLogArgs): Promise<DefaultSuccessResponse> {
    try {
      return this.post('/apply/create-postulation', {
        jobId,
        slug,
        user
      })
    } catch (err) {
      throw err
    }
  }
}

export default PortalesAPI
