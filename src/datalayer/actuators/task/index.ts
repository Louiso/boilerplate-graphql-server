import { IContext } from 'interfaces/general'

const updateTaskDate = async ({ input }, context: IContext) => {
  try {
    const data =  await context.dataSources.gatsAPI.updateTaskDate(input) || {}
    console.log('🚀 ~ file: index.ts ~ line 4 ~ updateTaskDate ~ data', data)

    return data
  } catch (error) {
    console.log('🚀 ~ file: index.ts ~ line 5 ~ updateTaskDate ~ error', error)
    throw error
  }
}

const getTaskById = async ({ taskId }: {taskId:string;}, context: IContext) => {
  try {
    const { success, task }  =  await context.dataSources.gatsAPI.getTask(taskId) || {}

    if(!success) throw Error('Error al traer tarea')

    return task
  } catch (error) {
    throw error
  }
}

export default {
  updateTaskDate,
  getTaskById
}
