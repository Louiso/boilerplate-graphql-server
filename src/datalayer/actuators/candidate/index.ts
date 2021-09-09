import { Candidate, QueryGetCandidateArgs } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'
import JobActuator from '../job'

const getCandidateByJob = async ({ jobId, publicationIndex, slug }: QueryGetCandidateArgs, context: IContext): Promise<Candidate> => {
  try {
    const { dataSources: { gatsAPI, portalesAPI } } = context
    let candidate: Candidate
    const { success, data } = await gatsAPI.getCandidate({ jobId }).catch(() => ({ success: false, data: null }))

    if(!success) {
      const promises: Promise<any>[] = [
        JobActuator.getJob({ jobId, publicationIndex: publicationIndex ?? 0 }, context)
      ]

      if(slug)
        promises.push(portalesAPI.getLaborExchangeBySlug({ slug: slug }))

      const [ job, { data: laborExchange } ] = await Promise.all(promises)

      const [ publication ] = job.publications!

      const applyJobResult = await gatsAPI.applyToJob({
        jobId,
        publicationId  : publication._id,
        sourceApply    : slug ? laborExchange?.name.toLowerCase() : 'landing',
        laborExchangeId: laborExchange?._id
      })

      if(!applyJobResult.success) throw new Error('Error al aplicar a job')

      candidate = applyJobResult.data
    } else {
      candidate = data!
    }

    return candidate
  } catch (error) {
    console.log('getCandidateByJob -> error', error)
    throw error
  }
}

export default {
  getCandidateByJob
}
