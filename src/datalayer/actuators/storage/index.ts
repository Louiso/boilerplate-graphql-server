import { s3 } from 'config/connections'
import ProfileModel from 'models/mongo/profile'

import { IContext } from 'interfaces/general'
import { MutationGetStorageTokenArgs, AssetType, TokenObject } from 'interfaces/graphql'

interface Params {
  ContentType: string;
  Key: string;
  Bucket: string;
}

const { BUCKET_DIR } = process.env

const generateTokenPut = (params: Params): string => {
  try {
    const url = s3.getSignedUrl('putObject', params)

    return url
  } catch (error) {
    throw error
  }
}

// ruta actual de guardado
// https://s3.amazonaws.com/krowdy/assets/profile/5d5e7dc45ea55b00352567fd/avatar/2019-08-22T06-38-58-274Z.webp"

const getKeyDir = (profileId: string, assetType: AssetType) => {
  switch (assetType) {
    case AssetType.Avatar: {
      return `assets/profile/${profileId}/avatar`
    }
    case AssetType.Avatar: {
      return `assets/profile/${profileId}/docs`
    }
    case AssetType.Cv: {
      return `assets/profile/${profileId}/cv`
    }
    default: {
      return `assets/profile/${profileId}/`
    }
  }
}

const getStorageToken = async ({ contentType, fileName, assetType }: MutationGetStorageTokenArgs, context: IContext): Promise<TokenObject> => {
  try {
    const profile = await ProfileModel
      .findOne({
        idUser: context.userId!
      })
      .select('_id')
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const getDate = new Date()
    let timestamp = getDate.toISOString()
    timestamp = timestamp.replace(/:/g, '-')
    timestamp = timestamp.replace(/\./g, '-')

    const fileNameFinal = timestamp + fileName.replace(/ /g, '_')

    const key =  `${getKeyDir(profile._id, assetType)}/${fileNameFinal}`.replace(new RegExp('/+', 'g'), '/')

    const url = s3.getSignedUrl('putObject', {
      ContentType: contentType,
      Key        : key,
      ACL        : 'public-read',
      Expires    : 3600,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Bucket     : BUCKET_DIR!
    })

    return {
      token           : url,
      originalFileName: fileName,
      fileName        : fileNameFinal,
      key
    }
  } catch (error) {
    throw error
  }
}

export default {
  generateTokenPut,
  getStorageToken
}
