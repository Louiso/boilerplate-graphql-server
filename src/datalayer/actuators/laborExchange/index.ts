import { IContext } from 'interfaces/general'
import { QueryGetLaborExchangeTemplateArgs, LaborExchangeTemplate, QueryGetLaborExchangeBySlugArgs, LaborExchange } from 'interfaces/graphql'

const getLaborExchangeTemplate = async ({ slug }: QueryGetLaborExchangeTemplateArgs, context: IContext): Promise<LaborExchangeTemplate> => {
  try {
    const data = await context.dataSources.portalesAPI.getTheme({ slug })

    return data.theme.template!
  } catch (error) {
    throw error
  }
}

const getLaborExchangeBySlug = async ({ slug }: QueryGetLaborExchangeBySlugArgs, context: IContext): Promise<LaborExchange | null> => {
  try {
    if(!slug) return null

    const data = await context.dataSources.portalesAPI.getLaborExchangeBySlug({ slug })

    return data.data
  } catch (error) {
    throw error
  }
}

export default {
  getLaborExchangeTemplate,
  getLaborExchangeBySlug
}
