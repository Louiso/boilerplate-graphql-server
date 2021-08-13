import { Candidate, CandidateTask } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'

const getCandidateTasksByCandidate = async ({ _id }: Candidate, { dataSources: { gatsAPI } }: IContext): Promise<Array<CandidateTask>> => {
  try {
    const { success, data: candidateTasks } = await gatsAPI.getCandidateTasks({ candidateId: _id })

    if(!success) throw new Error(`Error al traer los candidateTasks candidateId: ${_id}`)

    return candidateTasks
  } catch (error) {
    throw error
  }
}

export default {
  getCandidateTasksByCandidate
}
