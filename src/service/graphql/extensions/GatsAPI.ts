import { Area, Candidate, Job, Stage, CandidateTask  } from 'interfaces/graphql'
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
  data: CandidateTask[];
}
interface GetAreasArgs {
  limit?: number;
  skip?: number;
  text?: string;
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
  async getAreas(args: GetAreasArgs): Promise<GetAreasResponse> {
    try {
      return this.get<GetAreasResponse>('/autocomplete/areas', args)
    } catch (error) {
      throw error
    }
  }
}

export default GatsAPI
