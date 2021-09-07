import { Types } from 'mongoose'
import { IContext } from 'interfaces/general'

import { CategoryTask, Job, QueryGetJobArgs, QueryGetSimilarJobsArgs } from 'interfaces/graphql'

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

const getSimilarJobs = async ({ search, jobId, slug }: QueryGetSimilarJobsArgs, context: IContext): Promise<Job[]> => {
  try {
    console.log('search, jobId, slug', search, jobId, slug)
    const { data: { docs } } = await context.dataSources.portalesAPI.getSimilarJobs({ search, jobId, limit: 30, page: 1, slug })

    return docs
      .filter((doc) => doc.__typename === 'Job')
      .map((doc) => ({
        _id             : doc.job_id,
        title           : doc.title,
        companyPublished: {
          _id : doc.detailCompany?.company_id,
          name: doc.detailCompany?.company_name
        },
        stages: []
      }))
  } catch (error) {
    throw error
  }
}

export default {
  getJob,
  getSimilarJobs
}
