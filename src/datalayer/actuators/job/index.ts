import { Types } from 'mongoose'
import { IContext } from 'interfaces/general'

import { CategoryTask, Job, QueryGetJobArgs } from 'interfaces/graphql'

type OldCategoryTask = CategoryTask & { pathContentForm: string; }

const getJob = async ({ jobId, publicationIndex }: QueryGetJobArgs, context: IContext): Promise<Job> => {
  try {
    const [
      { data: job },
      { data: [ , ...stages ] }
    ] = await Promise.all([
      context.dataSources.gatsAPI.getJob({ jobId, publicationIndex }),
      context.dataSources.gatsAPI.getStagesWithTasks({ jobId })
    ])

    return {
      ...job,
      stages: stages.map((stage, index) => {
        const tasks = stage.tasks.map((task) => ({
          ...task,
          categoryTask: {
            ...task.categoryTask,
            codeTask: (task.categoryTask as OldCategoryTask).pathContentForm
          }
        }))

        if(index === 0)
          tasks.unshift({
            _id         : String(Types.ObjectId('6116a290f707b7de87737113')),
            categoryTask: {
              _id     : String(Types.ObjectId('6116a2a35939b813602d1074')),
              codeTask: 'cv',
              title   : 'Perfil'
            }
          })

        return ({
          ...stage,
          tasks
        })
      })
    }
  } catch (error) {
    throw error
  }
}

export default {
  getJob
}
