import context from '../graphql/context'
import dataSources from '../graphql/dataSources'

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export interface DataSourcesType {
  dataSources:  ReturnType<typeof dataSources>;
}

export type IContext = ThenArg<ReturnType<typeof context>> & DataSourcesType

export type NormalizeId<T> = {
  [ P in keyof T ]: '_id' extends P ? string : NormalizeId<T[P]>
}
