// import { RESTDataSource } from 'apollo-datasource-rest'
import DataSource from './DataSource'

interface getUserResponse {
  success: boolean;
  user: {
    _id: string;
    emails: {
      _id: string;
      email: string;
      status: boolean;
    }[];
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    phones: {
      _id: string;
      phone: string;
      status: boolean;
    }[];
    photo: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface logoutResponse {
  success: boolean;
  data: any;
}
class AccountAPI extends DataSource {
  constructor(authorization: string) {
    super(process.env.ACCOUNTS_API as string, authorization)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getUser(userId: string) {
    try {
      return this.get<getUserResponse>(`api/getInfoUser?id=${userId}`)
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async authorization() {
    try {
      return this.get<{userId: string; success: boolean;}>('/api/authenticate')
    } catch (error) {
      throw error
    }
  }

  async logout(accessToken: string, refreshToken: string) {
    try {
      const url = `/api/logout?accessToken=${accessToken.replace('Bearer ', '')}&refreshToken=${refreshToken}`

      return this.get<logoutResponse>(url)
    } catch (error) {
      throw error
    }
  }

  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // willSendRequest(request: any) {
  //   request.headers.set('Authorization', this.context.authorization)
  // }
}

export default AccountAPI
