import { Candidate, CandidateTask, MutationCreateResultTaskArgs, QueryGetCandidateTaskArgs } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'
import { getUrlApi } from 'utils/get'
import Axios from 'axios'

const getCandidateTasksByCandidate = async ({ _id }: Candidate, { dataSources: { gatsAPI } }: IContext): Promise<Array<CandidateTask>> => {
  try {
    const { success, data: candidateTasks } = await gatsAPI.getCandidateTasks({ candidateId: _id })

    if(!success) throw new Error(`Error al traer los candidateTasks candidateId: ${_id}`)

    return candidateTasks
  } catch (error) {
    throw error
  }
}

const createResultTask = async (
  { candidateTaskId, taskId, jobId }: MutationCreateResultTaskArgs,
  { dataSources: { gatsAPI }, authorization, userId }: IContext
): Promise<CandidateTask> => {
  try {
    const [ { data: candidateTask }, { task }, { data: job } ] = await Promise.all([
      gatsAPI.getCandidateTask(candidateTaskId),
      gatsAPI.getTask(taskId),
      gatsAPI.getJob({ jobId, publicationIndex: 0 })
    ])

    const { taskConfig: { krowderGroups = [] } = {}, alias } = task

    const publications = job.publications! || []

    const [ publication ] = publications

    const urlApi = getUrlApi({
      codeTask: task.categoryTask.pathContentForm,
      urlApi  : task.categoryTask.urlApi!
    })

    let verifyResultTaskId = null

    if(!candidateTask.resultTaskId) {
      const { data: { data, success } } = await Axios.post(`${urlApi}/createTaskResult`, {
        input: {
          candidate      : candidateTask.candidateInfo,
          candidateId    : candidateTask.candidateId,
          candidateTaskId: candidateTask._id,
          job            : {
            _id  : job._id,
            title: publication.title
          },
          stageId: candidateTask.stageId,
          task   : {
            alias,
            contentTask: task.contentTask
          },
          taskId       : task._id,
          typeEvaluator: krowderGroups.length ? 'krowders' : 'custom',
          userId
        }
      }, {
        headers: {
          Authorization: authorization
        }
      })

      if(!success) throw new Error('Error al crear tarea')
      const { resultTaskId } = data

      verifyResultTaskId = resultTaskId
    } else {
      verifyResultTaskId = candidateTask.resultTaskId
    }

    await gatsAPI.updateCandidateTaskBy({
      candidateTaskId,
      input: {
        resultTaskId: verifyResultTaskId
      }
    })

    const { data: candidateTaskDb } = await gatsAPI.getCandidateTask(candidateTaskId)

    return candidateTaskDb
  } catch (error) {
    throw error
  }
}

const getCandidateTask = async (
  { candidateTaskId }: QueryGetCandidateTaskArgs,
  { dataSources: { gatsAPI } }: IContext
): Promise<CandidateTask> => {
  try {
    const { data: candidateTask } = await gatsAPI.getCandidateTask(candidateTaskId)

    return candidateTask
  } catch (error) {
    throw error
  }
}

export default {
  getCandidateTasksByCandidate,
  createResultTask,
  getCandidateTask
}
