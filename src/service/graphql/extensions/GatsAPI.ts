import { Maybe } from 'graphql/jsutils/Maybe'
import { Area, Candidate, Job, Stage, CandidateTask, PaginationInput  } from 'interfaces/graphql'
import DataSource from './DataSource'

interface GetCandidateArgs {
  jobId: string;
}
interface GetCandidateResponse {
  success: boolean;
  data: Candidate;
}

interface GetJobArgs {
  jobId: string;
  publicationIndex: number;
}

interface GetJobResponse {
  data: Job;
  success: boolean;
}

interface GetStagesWithTasksArgs {
  jobId: string;
}

interface GetStagesWithTasksResponse {
  data: Stage[];
  success: boolean;
}

interface GetCandidateTasksArgs {
  candidateId: string;
}

interface GetCandidateTasksResponse {
  success: boolean;
  data: CandidateTask[];
}

interface GetAreasResponse {
  data: Area[];
  success: boolean;
}

class GatsAPI extends DataSource {
  constructor(authorization: string) {
    super(process.env.ATS_RESTIFY_BASE as string, authorization)
    // this.baseURL =
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getCandidate({ jobId }: GetCandidateArgs): Promise<GetCandidateResponse> {
    try {
      return this.get<GetCandidateResponse>(`/candidates/${jobId}/byJob`)
    } catch (error) {
      throw error
    }
  }

  async getJob({ jobId, publicationIndex }: GetJobArgs): Promise<GetJobResponse> {
    try {
      return this.get<GetJobResponse>(`/api/v1/jobs/${jobId}/${publicationIndex}`)
    } catch (error) {
      throw error
    }
  }

  async getStagesWithTasks({ jobId }: GetStagesWithTasksArgs): Promise<GetStagesWithTasksResponse> {
    try {
      return this.get<GetStagesWithTasksResponse>(`/api/v1/stages/${jobId}/withTasks`)
    } catch (error) {
      throw error
    }
  }

  async getCandidateTasks({ candidateId }: GetCandidateTasksArgs): Promise<GetCandidateTasksResponse> {
    try {
      return this.get<GetCandidateTasksResponse>(`/candidateTasks/${candidateId}/byCandidate`)
    } catch (error) {
      throw error
    }
  }
  async getAreas(args: Maybe<PaginationInput>): Promise<GetAreasResponse> {
    try {
      const { text, limit, skip } = args || {}

      return this.get<GetAreasResponse>(`/autocomplete/areas?text=${text || ''}&limit=${limit || 15}&skip=${skip || 0}`)
    } catch (error) {
      throw error
    }
  }
}

export default GatsAPI
