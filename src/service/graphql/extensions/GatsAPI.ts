import { Candidate, Maybe  } from 'interfaces/graphql'
import DataSource from './DataSource'

interface getTaskResponse {
  success: boolean;
  task: {
    _id: string;
    isActive: boolean;
    isFinished: boolean;
    categoryTask: {
      categoryTaskId: string;
      pathContentForm: string;
    };
    jobId: string;
    stageId: string;
    alias: string;
    contentTask: {
      content: {
        questions: {
          _id: string;
          statement: string;
          order: number;
        }[];
      };
    };
  };
}

interface getLaborReferentsResponse {
  success: boolean;
  data: {
    _id: string;
    candidateId: string;
    companyName: string;
    email: string;
    experienceId?: string;
    fullName: string;
    jobPosition: string;
    phone: string;
    refId: string;
  }[];
}

interface getCandidateResponse {
  success: boolean;
  data: Candidate;
}

interface updateResultTaskIdResponse {
  success: boolean;
  data: {
    _id: string;
    resultTaskId: string;
  };
}

interface updateStatusCandidateTaskResponse {
  success: boolean;
  data: {
    _id: string;
    status: string;
  };
}

interface LaborReferentToCreateInput {
  candidateId: string;
  experienceId?: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobPosition: string;
  refId: string;
}

class GatsAPI extends DataSource {
  constructor(authorization: string) {
    super(process.env.ATS_RESTIFY_BASE as string, authorization)
    // this.baseURL =
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getLaborReferents(candidateId: string) {
    try {
      return this.get<getLaborReferentsResponse>(`/candidates/${candidateId}/laborReferents`)
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getTask(taskId: string) {
    try {
      return this.post<getTaskResponse>('/api/v1/tasks/getTask', {
        taskId
      })
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getCandidate(candidateId: string) {
    try {
      return this.get<getCandidateResponse>(`/candidates/${candidateId}`)
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateResultTaskId(candidateTaskId: string, backgroundCheckId: string) {
    try {
      return this.put<updateResultTaskIdResponse>(`/candidateTasks/${candidateTaskId}/resultTaskId`, {
        resultTaskId: backgroundCheckId
      })
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateAnswerLaborReferents(
    laborReferentRefId: string,
    laborReferentInput: {
      companyName?: Maybe<string>;
      email      ?: Maybe<string>;
      fullName   ?: Maybe<string>;
      jobPosition?: Maybe<string>;
      phone      ?: Maybe<string>;
    },
    questions: {
      _id: string; // question generado en backgroundCheck
      refId: string; // id question generado por el contentTask
      taskId: string;
      statement: string;
      answer: string;
    }[]
  ) {
    try {
      return this.put<updateResultTaskIdResponse>(`/api/v1/labor-referents/${laborReferentRefId}/answers`, {
        laborReferentInput,
        questions
      })
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateStatusCandidateTask(resultTaskId: string, status: string) {
    try {
      return this.post<updateStatusCandidateTaskResponse>('/candidateTasks/updateStatus', {
        resultTaskId,
        status
      })
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async createLaborReferents(candidateId:string, laborReferentInputs: LaborReferentToCreateInput[]) {
    try {
      return this.post('/api/v1/labor-referents/create', {
        candidateId,
        laborReferentInputs
      })
    } catch (error) {
      throw error
    }
  }
}

export default GatsAPI
