import { Candidate, QueryGetCandidateArgs } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'

const getCandidateByJob = async ({ jobId }: QueryGetCandidateArgs, { dataSources: { gatsAPI } }: IContext): Promise<Candidate> => {
  try {
    const { success, data: candidate } = await gatsAPI.getCandidate({ jobId })

    if(!success) throw new Error(`Candidate NotFound JobId ${jobId}`)

    return candidate
  } catch (error) {
    throw error
  }
}

export default {
  getCandidateByJob
}
