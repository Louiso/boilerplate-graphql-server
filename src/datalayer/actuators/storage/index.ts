import { s3 } from 'config/connections'

interface Params {
    ContentType: string;
    Key: string;
    Bucket: string;
}

const generateTokenPut = (params: Params): string => {
  try {
    const url = s3.getSignedUrl('putObject', params)

    return url
  } catch (error) {
    throw error
  }
}

export default { generateTokenPut }
