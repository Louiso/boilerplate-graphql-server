import { Types } from 'mongoose'
import { IContext } from 'interfaces/general'

import { CategoryTask, Job, JobSimilar, QueryGetJobArgs, QueryGetSimilarJobsArgs } from 'interfaces/graphql'

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

        const CvCategoryTask: any = {
          _id     : String(Types.ObjectId('6116a2a35939b813602d1074')),
          codeTask: 'cv',
          title   : 'Perfil'
        }

        const CvTask: any = {
          _id         : String(Types.ObjectId('6116a290f707b7de87737113')),
          categoryTask: CvCategoryTask
        }

        if(index === 0)
          tasks.unshift(CvTask)

        return ({
          ...stage,
          tasks
        })
      })
    }
  } catch (error) {
    if(error.response?.data?.message.includes('NotFound')) throw new Error('Job NotFound')
    else throw error
  }
}

const getSimilarJobs = async ({ search, jobId, slug }: QueryGetSimilarJobsArgs, context: IContext): Promise<JobSimilar[]> => {
  try {
    const { data: { docs } } = await context.dataSources.portalesAPI.getSimilarJobs({ search, jobId, limit: 30, page: 1, slug })
    console.log('🚀 ~ file: index.ts ~ line 58 ~ getSimilarJobs ~ docs', docs)

    return docs
      .filter((doc) => doc.__typename === 'Job')
      .map((doc) => ({
        _id             : doc.job_id,
        title           : doc.title,
        companyPublished: {
          _id : doc.detailCompany?.company_id,
          name: doc.detailCompany?.company_name
        },
        jobDetail: {
          _id                 : doc.job_id,
          benefitsOfWork      : doc.benefits || [],
          publishday          : doc.publishDate,
          description         : doc.description,
          disability          : doc.disability as {accepted: boolean; visible: boolean;},
          expirationDate      : doc.expirationDate,
          firstPublicationDate: doc.first_publication_date,
          title               : doc.title,
          visibleInformation  : doc.visibleInformation,
          basicEdition        : doc.basicEdition,
          detailJob           : doc.detailJob,
          requirements        : doc.requirements,
          journeyType         : doc.journeyType,
          hierarchy           : doc.hierarchy,
          area                : doc.area,
          lcoation            : doc.location
        }
      }))
  } catch (error) {
    throw error
  }
}

const getJobInformation = async ({ jobId, publicationIndex }: QueryGetJobArgs, context: IContext): Promise<Job> => {
  try {
    const { data: job } = await context.dataSources.gatsAPI.getJob({ jobId, publicationIndex })

    return job
  } catch (error) {
    throw error
  }
}

export default {
  getJob,
  getSimilarJobs,
  getJobInformation
}
