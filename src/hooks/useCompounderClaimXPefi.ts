import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchCompounderFarmUserDataAsync } from 'state/actions'
import { claimXPefi } from 'utils/callHelpers'
import { useStrategyContract } from './useContract'

const useCompounderClaimXPefi = (lpSymbol: string, type?: string) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const strategyContract = useStrategyContract(lpSymbol, type)

  const handleClaimXPefi = useCallback(async () => {
    const txHash = await claimXPefi(strategyContract, account)
    dispatch(fetchCompounderFarmUserDataAsync(account))
    console.info(txHash)
  }, [account, dispatch, strategyContract])

  return { onClaimXPefi: handleClaimXPefi }
}

export default useCompounderClaimXPefi
