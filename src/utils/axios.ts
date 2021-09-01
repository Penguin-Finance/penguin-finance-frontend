import { COINGECKO_API_ENDPOINT } from '../config'

export const appendParams = (url, params) => {
  let appendedUrl = url
  const tupleMap = Object.entries(params)
  const tupleMapLen = tupleMap.length
  if (tupleMapLen > 0) {
    appendedUrl += '?'
  }
  tupleMap.forEach(([key, value], index) => {
    if (key !== null && value !== null) {
      appendedUrl += `${key}=${value}`
      if (index < tupleMapLen - 1) {
        appendedUrl += '&'
      }
    }
  })
  return appendedUrl
}

export const coingeckoApiEndpoint = () => {
  return COINGECKO_API_ENDPOINT
}
