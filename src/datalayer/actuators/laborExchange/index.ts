import { IContext } from 'interfaces/general'
import { QueryGetLaborExchangeTemplateArgs, LaborExchangeTemplate } from 'interfaces/graphql'

const getLaborExchangeTemplate = async ({ slug }: QueryGetLaborExchangeTemplateArgs, context: IContext): Promise<LaborExchangeTemplate> => {
  try {
    const data = await context.dataSources.portalesAPI.getTheme({ slug })

    return data.theme.template
  } catch (error) {
    throw error
  }
}

export default {
  getLaborExchangeTemplate
}
