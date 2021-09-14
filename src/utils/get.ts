interface GetUrlApiArgs {
  urlApi: string;
  codeTask: string;
}

/*
  FORM_API
*/
export const getUrlApi = ({ urlApi, codeTask }: GetUrlApiArgs): string => {
  const envName = `${codeTask.toUpperCase()}_API`

  let url = process.env[envName]

  if(!url)
    url = urlApi

  return url
}
