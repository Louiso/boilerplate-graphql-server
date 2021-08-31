interface GetUrlApiArgs {
  urlApi: string;
  codeTask: string;
}

/*
  FORM_API
*/
export const getUrlApi = ({ urlApi, codeTask }: GetUrlApiArgs): string => {
  let url = process.env[`${codeTask.toUpperCase()}_API`]

  if(!url)
    url = urlApi

  return urlApi
}
