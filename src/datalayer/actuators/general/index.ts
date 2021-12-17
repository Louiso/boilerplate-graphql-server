import { QueryGetCountryCodeArgs, KrowdyGeoCountryCode } from 'interfaces/graphql'
import geoip from 'krowdy-geoip'
import { IP2Location } from 'ip2location-nodejs'
import { Maybe } from 'graphql/jsutils/Maybe'

const ip2location = new IP2Location()

ip2location.open('./bin_db/IP2LOCATION-LITE-DB3.BIN')

const formatLocation = ({ city, countryLong }: {countryLong: string; city: string;}): Maybe<string> => {
  if(city && countryLong)
    return `${city}, ${countryLong}`

  return null
}

const getCountryCode = async ({ ip }: QueryGetCountryCodeArgs): Promise<KrowdyGeoCountryCode> => {
  try {
    const data = geoip.lookup(ip)
    const geo = ip2location.getAll(ip)

    return {
      range      : data.range,
      countryCode: data.country,
      location   : formatLocation(geo)
    }
  } catch (error) {
    throw error
  }
}

export default {
  getCountryCode
}
