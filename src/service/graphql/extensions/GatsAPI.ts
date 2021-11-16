import { Maybe } from 'graphql/jsutils/Maybe'
import { Area, Candidate, Job, Stage, CandidateTask, PaginationInput, Task, CandidateInfo } from 'interfaces/graphql'
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

interface SendProfileCVArgs {
  jobId: string;
  curriculum: ProfileDb['curriculum'];
}

interface GenerateInvitationCodeArgs {
  candidateId: string;
}

interface GenerateInvitationCodeResponse {
  success: boolean;
  data: any;
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
  candidateIdTrack?: Maybe<string>;
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

interface LeaveJobResponde {
  success: boolean;
}

interface UpdateCandidateTaskByArgs {
  candidateTaskId: string;
  input: {
    resultTaskId?: string;
    firstTimeIn?: string;
    wasNotified?: boolean;
  };
}

interface UpdateTaskDateArgs {
  candidateTaskId?: Maybe<string>;
  taskDate?: Maybe<string>;
  timeZone?: Maybe<string>;
}

interface UpdateBasicCandidateTaskArgs {
  candidateTaskId: string;
  input: {
    isIntroductionViewed?: Maybe<boolean>;
  };
}

interface UpdateBasicCandidateTaskResponse {
  success: boolean;
  data: CandidateTask;
}

interface ExecutedArgs {
  candidateTaskId: string;
}

interface ExecutedResponse {
  success: boolean;
  data: CandidateTask;
}

interface UpdateCandidateInfoArgs {
  candidateTaskId: string;
  input: {
    age?: Maybe<number>;
    docNumber?: Maybe<string>;
    gender?: Maybe<string>;
  };
}

interface UpdateCandidateInfoResponse {
  success: boolean;
  data: CandidateTask;
}

interface FinishMultiTestArgs {
  resultTaskId: string;
}

interface AddMergeTokenToCandidateArgs {
  email: string;
  jobId: string;
  trackId: string;
}

interface AddMergeTokenToCandidateResponse {
  success: boolean;
  data: CandidateInfo;
}

interface AddUserOnMergeCandidateArgs {
  jobId: string;
  token: string;
  trackId: string;
}

interface AddUserOnMergeCandidateResponse {
  success: boolean;
  data: CandidateInfo;
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

  async getCandidateById(candidateId: string): Promise<GetCandidateResponse> {
    try {
      return this.get<GetCandidateResponse>(`/candidates/${candidateId}`)
    } catch (error) {
      throw error
    }
  }

  async addMergeTokenToCandidate(args: AddMergeTokenToCandidateArgs): Promise<AddMergeTokenToCandidateResponse> {
    try {
      return this.post('/candidates/addMergeTokenToCandidate', args)
    } catch (error) {
      throw error
    }
  }

  async addUserOnMergeCandidate(args: AddUserOnMergeCandidateArgs): Promise<AddUserOnMergeCandidateResponse> {
    try {
      return this.post('/candidates/addUserOnMergeCandidate', args)
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

  async sendProfileCV(args: SendProfileCVArgs): Promise<SendProfileResponse> {
    try {
      return this.post<SendProfileResponse>('/candidates/sendCV', args)
    } catch (error) {
      throw error
    }
  }

  async generateInvitationCode(args: GenerateInvitationCodeArgs): Promise<GenerateInvitationCodeResponse> {
    try {
      return this.post<GenerateInvitationCodeResponse>('/candidates/generate/invitationCode', args)
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

  async leaveJob({ candidateId }: {candidateId: string;}): Promise<LeaveJobResponde> {
    try {
      return this.post('/candidates/leaveJob', { candidateId })
    } catch (error) {
      throw error
    }
  }

  async updateTaskDate({ candidateTaskId, taskDate, timeZone }: UpdateTaskDateArgs): Promise<any> {
    try {
      return this.post('/candidateTasks/updateTaskDate',
        {
          candidateTaskId,
          dataResultTask: {
            taskDate,
            timeZone
          }
        })
    } catch (error) {
      throw error
    }
  }

  async updateBasicCandidateTask({ candidateTaskId, input }: UpdateBasicCandidateTaskArgs): Promise<UpdateBasicCandidateTaskResponse> {
    try {
      return this.put(`/candidateTasks/${candidateTaskId}/basic`,
        {
          input
        })
    } catch (error) {
      throw error
    }
  }

  async executed({ candidateTaskId }: ExecutedArgs): Promise<ExecutedResponse> {
    try {
      return this.post('/candidateTasks/executed',
        {
          candidateTaskId,
          dataResultTask: {}
        })
    } catch (error) {
      throw error
    }
  }

  async updateCandidateInfo({ candidateTaskId, input }: UpdateCandidateInfoArgs): Promise<UpdateCandidateInfoResponse> {
    try {
      return this.post('/candidateTasks/updateCandidateInfo',
        {
          candidateTaskId,
          input
        })
    } catch (error) {
      throw error
    }
  }
  async finishMultiTest({ resultTaskId }: FinishMultiTestArgs): Promise<UpdateCandidateInfoResponse> {
    try {
      return this.get(`/api/v1/multitest/successedTask/${resultTaskId}`)
    } catch (error) {
      throw error
    }
  }
}

export default GatsAPI
