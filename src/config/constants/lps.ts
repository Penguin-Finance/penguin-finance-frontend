import contracts from './contracts'
import { LPConfig, QuoteToken } from './types'

const lps: LPConfig[] = [
  {
    lpSymbol: 'USDT-AVAX LP',
    lpAddresses: {
      43113: '',
      43114: '0x9ee0a4e21bd333a6bb2ab298194320b8daa26516',
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      43113: '',
      43114: '0xde3A24028580884448a5397872046a019649b084',
    },
    quoteTokenSymbol: QuoteToken.AVAX,
    quoteTokenAddresses: contracts.wavax,
  },
  {
    lpSymbol: 'LYD-USDT LP',
    lpAddresses: {
      43113: '',
      43114: '0x752C59f22fAAA861108649F4596034796C69bC3f',
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      43113: '',
      43114: '0xde3A24028580884448a5397872046a019649b084',
    },
    quoteTokenSymbol: QuoteToken.LYD,
    quoteTokenAddresses: contracts.lyd,
  },

  // {
  //   lpSymbol: 'LYD-AVAX LP',
  //   lpAddresses: {
  //     43113: '',
  //     43114: '0x87b1cf8f0fd3e0243043642cea7164a67cb67e4d',
  //   },
  //   tokenSymbol: QuoteToken.AVAX,
  //   tokenAddresses: contracts.wavax,
  //   quoteTokenSymbol: QuoteToken.LYD,
  //   quoteTokenAddresses: contracts.lyd,
  // },
  {
    lpSymbol: 'GDL-AVAX LP',
    lpAddresses: {
      43113: '',
      43114: '0xc5ab0c94bc88b98f55f4e21c1474f67ab2329cfd',
    },
    tokenSymbol: QuoteToken.AVAX,
    tokenAddresses: contracts.wavax,
    quoteTokenSymbol: QuoteToken.GDL,
    quoteTokenAddresses: contracts.gdl,
  },
]

export default lps
