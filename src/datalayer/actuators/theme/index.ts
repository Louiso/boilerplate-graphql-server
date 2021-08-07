import { IContext } from 'interfaces/general'
import { QueryGetThemeArgs, Theme } from 'interfaces/graphql'

const getTheme = async ({ slug }: QueryGetThemeArgs, context: IContext): Promise<Theme> => {
  try {
    const data = await context.dataSources.portalesAPI.getTheme({ slug })

    return {
      ... data.theme,
      cssTextFamily: data.cssTextFamily
    }
  } catch (error) {
    throw error
  }
}

export default {
  getTheme
}
