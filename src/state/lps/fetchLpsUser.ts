import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import lpsConfig from 'config/constants/lps'
import { getAddress } from 'utils/addressHelpers'

const fetchLpUserTokenBalances = async (account: string) => {
  const calls = lpsConfig.map((lp) => {
    const lpContractAddress = getAddress(lp.lpAddresses)

    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export default fetchLpUserTokenBalances
