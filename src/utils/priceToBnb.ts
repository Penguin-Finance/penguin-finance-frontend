import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'

const priceToBnb = (
  tokenName: string,
  tokenPrice: BigNumber,
  quoteToken: QuoteToken,
  avaxPriceUSD: BigNumber,
): BigNumber => {
  const tokenPriceBN = new BigNumber(tokenPrice)
  if (tokenName === 'AVAX') {
    return new BigNumber(1)
  }
  if (tokenPrice && quoteToken === QuoteToken.USDT) {
    return tokenPriceBN.div(avaxPriceUSD)
  }
  return tokenPriceBN
}

export default priceToBnb
