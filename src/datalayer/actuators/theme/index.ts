import { IContext } from 'interfaces/general'
import { QueryGetThemeArgs, Theme } from 'interfaces/graphql'

const getTheme = async ({ slug, jobId }: QueryGetThemeArgs, context: IContext): Promise<Theme> => {
  try {
    const [ dataTheme, { data: job } ] = await Promise.all([
      context.dataSources.portalesAPI.getTheme({ slug }),
      context.dataSources.gatsAPI.getJob({ jobId, publicationIndex: 0 })
    ])

    let { theme } = dataTheme

    if(job.companyPublished?.premium)
      theme = job.companyPublished.theme!

    return {
      ...theme,
      cssTextFamily: dataTheme.cssTextFamily
    }
  } catch (error) {
    throw error
  }
}

export default {
  getTheme
}
