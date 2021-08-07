import { IContext } from 'interfaces/general'

import { CategoryTask, Job, QueryGetJobArgs } from 'interfaces/graphql'

type OldCategoryTask = CategoryTask & { pathContentForm: string; }

const getJob = async ({ jobId, publicationIndex }: QueryGetJobArgs, context: IContext): Promise<Job> => {
  try {
    const [
      { data: job },
      { data: stages }
    ] = await Promise.all([
      context.dataSources.gatsAPI.getJob({ jobId, publicationIndex }),
      context.dataSources.gatsAPI.getStagesWithTasks({ jobId })
    ])

    return {
      ...job,
      stages: stages.map((stage) => ({
        ...stage,
        tasks: stage.tasks.map((task) => ({
          ...task,
          categoryTask: {
            ...task.categoryTask,
            codeTask: (task.categoryTask as OldCategoryTask).pathContentForm
          }
        }))
      }))
    }
  } catch (error) {
    throw error
  }
}

export default {
  getJob
}
