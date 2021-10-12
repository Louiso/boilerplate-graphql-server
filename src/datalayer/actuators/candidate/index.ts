import { Candidate, QueryGetCandidateArgs, SuccessResponse, MutationLeavePostulationArgs } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'
import JobActuator from '../job'

const getCandidateByJob = async (
  { jobId, publicationIndex, slug, trackingCandidateId }: QueryGetCandidateArgs,
  context: IContext
): Promise<Candidate> => {
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

      const [ job, { data: laborExchange } = { data: null } ] = await Promise.all(promises)

      const [ publication ] = job.publications!

      const applyJobResult = await gatsAPI.applyToJob({
        jobId,
        publicationId   : publication._id,
        sourceApply     : slug ? laborExchange?.name.toLowerCase() : trackingCandidateId ? null : 'landing',
        laborExchangeId : laborExchange?._id,
        candidateIdTrack: trackingCandidateId
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

const leavePostulation = async ({ candidateId }: MutationLeavePostulationArgs, context: IContext): Promise<SuccessResponse> => {
  try {
    const { dataSources: { gatsAPI } } = context

    const { success } = await gatsAPI.leaveJob({ candidateId }).catch(() => ({ success: false, data: null }))

    return { success }
  } catch (error) {
    throw error
  }
}

export default {
  getCandidateByJob,
  leavePostulation
}
