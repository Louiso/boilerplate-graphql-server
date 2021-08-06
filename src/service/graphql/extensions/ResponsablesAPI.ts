import DataSource from './DataSource'

interface finishActivityArgs {
  resultTaskId: string;
  points?: {
    code: string;
    total: number;
  }[];
}

interface finishActivityResponse {
  success: boolean;
  message: string;
}

class ResponsablesAPI extends DataSource {
  constructor(authorization: string) {
    super(process.env.RESPONSABLES_API as string, authorization)
    // this.baseURL =
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async finishActivity(data: finishActivityArgs) {
    try {
      return this.post<finishActivityResponse>('/activities/finish', data)
    } catch (error) {
      throw error
    }
  }
}

export default ResponsablesAPI
