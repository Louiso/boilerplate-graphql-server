import { QueryGetCountryCodeArgs, KrowdyGeoCountryCode } from 'interfaces/graphql'
import geoip from 'krowdy-geoip'

const getCountryCode = async ({ ip }: QueryGetCountryCodeArgs): Promise<KrowdyGeoCountryCode> => {
  try {
    const data = geoip.lookup(ip)

    return {
      range      : data.range,
      countryCode: data.country
    }
  } catch (error) {
    throw error
  }
}

export default {
  getCountryCode
}
