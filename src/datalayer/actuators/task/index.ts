import { IContext } from 'interfaces/general'
import {
  MutationUpdateTaskDateArgs,
  MutationResetTaskArgs,
  SuccessResponse,
  Task
} from 'interfaces/graphql'

const updateTaskDate = async ({ input }: MutationUpdateTaskDateArgs, context: IContext): Promise<SuccessResponse> => {
  try {
    const data =  await context.dataSources.gatsAPI.updateTaskDate(input)

    return data
  } catch (error) {
    throw error
  }
}

const getTaskById = async ({ taskId }: {taskId:string;}, context: IContext): Promise<Task> => {
  try {
    const { success, task }  =  await context.dataSources.gatsAPI.getTask(taskId)

    if(!success) throw Error('Error al traer tarea')

    return task
  } catch (error) {
    throw error
  }
}

const resetTask = async ({ candidateTaskId }: MutationResetTaskArgs, context: IContext): Promise<SuccessResponse> => {
  try {
    const { success } = await context.dataSources.gatsAPI.resetTask({ candidateTaskId })

    if(!success) throw Error('Error al resetear tarea')

    return { success }
  } catch (error) {
    throw error
  }
}

export default {
  updateTaskDate,
  getTaskById,
  resetTask
}
