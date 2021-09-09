import { Maybe } from 'graphql/jsutils/Maybe'
import { Area, Candidate, Job, Stage, CandidateTask, PaginationInput, Task } from 'interfaces/graphql'
import { ProfileDb } from 'models/mongo/profile'
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

interface GetLocationResponse {
  data: {
    address: [{
      formatted_address: string;
      geometry: JSON;
    }];
  };
  success: boolean;
}

interface SendProfileArgs {
  jobId: string;
  userInfo: ProfileDb & { genre: string; };
}

interface SendProfileResponse {
  success: boolean;
  data: any;
}

interface ApplyToJobArgs {
  jobId: string;
  laborExchangeId?: string;
  publicationId: string;
  sourceApply: string;
  candidateIdTrack?: string;
}

interface ApplyToJobResponse {
  success: boolean;
  data: any;
}

interface LaborReferentToCreateInput {
  candidateId: string;
  experienceId?: string;
  fullName: string;
  email?: string;
  phone?: Maybe<string>;
  companyName?: Maybe<string>;
  jobPosition?: Maybe<string>;
  refId: string;
  refIdOrigin: string;
  position?: Maybe<string>;
}

interface CreateLaborReferentsResponse {
  success: boolean;
  data: any[];
}

interface GetCandidateTaskResponse {
  success: boolean;
  data: CandidateTask;
}

interface GetTaskResponse {
  success: boolean;
  task: Task;
}

interface UpdateCandidateTaskByArgs {
  candidateTaskId: string;
  input: {
    resultTaskId?: string;
  };
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

  async sendProfile(args: SendProfileArgs): Promise<SendProfileResponse> {
    try {
      return this.post<SendProfileResponse>('/candidates/sendProfile', args)
    } catch (error) {
      throw error
    }
  }

  async applyToJob(args: ApplyToJobArgs): Promise<ApplyToJobResponse> {
    try {
      return this.post<ApplyToJobResponse>('/candidates/apply', args)
    } catch (error) {
      throw error
    }
  }

  async createLaborReferents(candidateId:string, laborReferentInputs: LaborReferentToCreateInput[]): Promise<CreateLaborReferentsResponse> {
    try {
      return this.post('/api/v1/labor-referents/create', {
        candidateId,
        laborReferentInputs
      })
    } catch (error) {
      throw error
    }
  }

  async getLocation(args: Maybe<PaginationInput>): Promise<GetLocationResponse> {
    try {
      const { text, limit, skip } = args || {}

      return this.get<GetLocationResponse>(`/autocomplete/location?text=${text || ''}&limit=${limit || 15}&skip=${skip || 0}`)
    } catch (error) {
      throw error
    }
  }

  async getCandidateTask(candidateTaskId: string): Promise<GetCandidateTaskResponse> {
    try {
      return this.get<GetCandidateTaskResponse>(`/candidateTasks/${candidateTaskId}`)
    } catch (error) {
      throw error
    }
  }

  async getTask(taskId: string): Promise<GetTaskResponse> {
    try {
      return this.post<GetTaskResponse>('/api/v1/tasks/getTask', { taskId })
    } catch (error) {
      throw error
    }
  }

  async updateCandidateTaskBy({ candidateTaskId, input }: UpdateCandidateTaskByArgs): Promise<GetCandidateTaskResponse> {
    try {
      return this.post('/candidateTasks/updateCandidateTaskBy', {
        _id: candidateTaskId,
        input
      })
    } catch (error) {
      throw error
    }
  }
}

export default GatsAPI
