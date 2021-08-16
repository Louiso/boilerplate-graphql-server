import axios, { AxiosInstance } from 'axios'

class DataSource {
  instance: AxiosInstance
  constructor(baseURL: string, authorization?: string, tokenApp?: string) {
    this.instance = axios.create({ baseURL })
    if(authorization)
      this.instance.defaults.headers.common['Authorization'] = authorization
    if(tokenApp)
      this.instance.defaults.headers.common['AuthorizationApp'] = tokenApp
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async post<T>(path: string, params?: any): Promise<T> {
    try {
      const { data } = await this.instance.post(path, params)

      return data
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async get<T>(path: string, params?: any): Promise<T> {
    try {
      const { data } = await this.instance.get(path, params)

      return  data
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async put<T>(path: string, params?: any): Promise<T> {
    try {
      const { data } = await this.instance.put(path, params)

      return data
    } catch (error) {
      throw error
    }
  }

  async delete<T>(path: string, params: any): Promise<T> {
    try {
      const  { data } = await  this.instance.delete(path, { params })

      return data
    } catch (error) {
      throw error
    }
  }
}

export default DataSource
