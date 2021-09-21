import { IContext } from 'interfaces/general'
import { getUrlApi } from 'utils/get'
import Axios from 'axios'

import {
  Candidate,
  CandidateTask,
  MutationCreateResultTaskArgs,
  QueryGetCandidateTaskArgs,
  QueryGetAppSectionsArgs,
  Section,
  MutationNotifyOpenTaskInDesktopArgs,
  MutationUpdateBasicCandidateTaskArgs,
  MutationExecutedArgs
} from 'interfaces/graphql'

import { messageController } from 'actuators/messages'

import JobActuator from 'actuators/job'

const getCandidateTasksByCandidate = async ({ _id }: Candidate, { dataSources: { gatsAPI } }: IContext): Promise<Array<CandidateTask>> => {
  try {
    const { success, data: candidateTasks } = await gatsAPI.getCandidateTasks({ candidateId: _id })

    if(!success) throw new Error(`Error al traer los candidateTasks candidateId: ${_id}`)

    return candidateTasks
  } catch (error) {
    throw error
  }
}

const notifyOpenTaskInDesktop = async (
  {
    taskId,
    jobId,
    publicationIndex,
    slug
  }: MutationNotifyOpenTaskInDesktopArgs,
  context: IContext): Promise<Candidate> => {
  try {
    const [ jobInformation, candidateInformation, taskInformation ] = await Promise.all([
      JobActuator.getJobInformation({ jobId, publicationIndex: 0 }, context),
      context.dataSources.gatsAPI.getCandidate({ jobId }),
      context.dataSources.gatsAPI.getTask(taskId)
    ])

    const {
      publications
    } = jobInformation

    const [ publication ] = publications!

    if(!candidateInformation || !candidateInformation?.data.firstName || !candidateInformation?.data.email) throw new Error('Error al enviar mailing de notificacion')

    const templateData = {
      companyLogo : jobInformation?.companyPublished?.profile?.logo || 'https://cdn.krowdy.com/images/magneto_2.png',
      destinatario: candidateInformation.data.firstName,
      company     : jobInformation?.companyPublished?.name || 'Confidencial',
      job         : publication?.title || 'Puesto laboral',
      jobUrl      : `${process.env.APP_URL}/job/${jobId}/publication/${publicationIndex}${slug ? `?slug=${slug}` : ''}`,
      email       : candidateInformation.data.email,
      subject     : 'Hola Mundo', // TODO: Corregir el subject
      taskName    : taskInformation.task.categoryTask.title!
    }

    await messageController.sendEmailOpenTaskInDesktop(templateData)

    return candidateInformation.data
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

const getAppSections = async (
  { taskId, candidateTaskId }: QueryGetAppSectionsArgs,
  { dataSources: { gatsAPI }, authorization }: IContext
): Promise<Section[]> => {
  try {
    const [ { data: candidateTask }, { task } ] = await Promise.all([
      gatsAPI.getCandidateTask(candidateTaskId),
      gatsAPI.getTask(taskId)
    ])
    const urlApi = getUrlApi({
      codeTask: task.categoryTask.pathContentForm,
      urlApi  : task.categoryTask.urlApi!
    })

    const url = `${urlApi}/app/sections/${candidateTask.resultTaskId}`

    const { data: { data: sections } } = await Axios.get(url, {
      headers: {
        Authorization: authorization
      }
    })

    return sections
  } catch (error) {
    throw error
  }
}

const updateBasicCandidateTask = async (
  { candidateTaskId, input }: MutationUpdateBasicCandidateTaskArgs,
  { dataSources: { gatsAPI } }: IContext
): Promise<CandidateTask> => {
  try {
    const { data: candidateTask } = await gatsAPI.updateBasicCandidateTask({
      candidateTaskId,
      input
    })

    return candidateTask
  } catch (error) {
    throw error
  }
}

const executed = async (
  { candidateTaskId }: MutationExecutedArgs,
  { dataSources: { gatsAPI } }: IContext
): Promise<CandidateTask> => {
  try {
    await gatsAPI.executed({ candidateTaskId })

    const { data: candidateTask } = await gatsAPI.getCandidateTask(candidateTaskId)

    return candidateTask
  } catch (error) {
    throw error
  }
}

export default {
  getCandidateTasksByCandidate,
  createResultTask,
  getCandidateTask,
  getAppSections,
  notifyOpenTaskInDesktop,
  updateBasicCandidateTask,
  executed
}
