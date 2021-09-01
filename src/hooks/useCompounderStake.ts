import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { fetchCompounderFarmUserDataAsync } from 'state/actions'
import { compounderStake } from 'utils/callHelpers'
import { getCompounderFarmLpAddress } from 'utils/addressHelpers'
import { useERC20, useStrategyContract } from './useContract'

const useStake = (lpSymbol: string, type?: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const lpAddress = getCompounderFarmLpAddress(lpSymbol, type)
  const lpContract = useERC20(lpAddress)
  const strategyContract = useStrategyContract(lpSymbol, type)

  const handleStake = useCallback(
    async (amount: string) => {
      const realAmount = new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
      const maxAmount = await lpContract.methods.balanceOf(account).call()
      const txHash = await compounderStake(strategyContract, realAmount > maxAmount ? maxAmount : realAmount, account)
      dispatch(fetchCompounderFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, lpContract, strategyContract],
  )

  return { onStake: handleStake }
}

export default useStake
