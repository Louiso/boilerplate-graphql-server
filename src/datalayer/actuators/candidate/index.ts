import { Candidate, QueryGetCandidateArgs } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'

const getCandidateByJob = async ({ jobId, publicationIndex, slug }: QueryGetCandidateArgs, context: IContext): Promise<Candidate> => {
  try {
    const { dataSources: { gatsAPI, portalesAPI } } = context
    let candidate: Candidate
    const { success, data } = await gatsAPI.getCandidate({ jobId }).catch(() => ({ success: false, data: null }))

    if(!success) {
      let laborExchange
      if(slug) {
        const { data } = await portalesAPI.getLaborExchangeBySlug({ slug: slug })
        laborExchange = data
      }
      await gatsAPI.applyToJob({ jobId, publicationIndex: publicationIndex ?? 0, sourceApply: laborExchange?.name.toLowerCase() ?? 'landing' })

      const { success, data } = await gatsAPI.getCandidate({ jobId })

      if(!success) throw new Error(`Candidate for jobId:${jobId} userId:${context.userId} NotFound`)

      candidate = data
    } else {
      candidate = data!
    }

    return candidate
  } catch (error) {
    throw error
  }
}

export default {
  getCandidateByJob
}
