import { Candidate, QueryGetCandidateArgs } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'

const getCandidate = async ({ candidateId }: QueryGetCandidateArgs, { dataSources: { gatsAPI } }: IContext): Promise<Candidate> => {
  try {
    const { success, data: candidate } = await gatsAPI.getCandidate(candidateId)

    if(!success) throw new Error(`BackgroundCheck NotFound ${candidateId}`)

    return candidate
  } catch (error) {
    throw error
  }
}

export default {
  getCandidate
}
