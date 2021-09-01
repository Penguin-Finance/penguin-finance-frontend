import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import getFarmMasterChefAbi from 'utils/getFarmMasterChefAbi';
import getFarmMasterChefAddress from 'utils/getFarmMasterChefAddress';
import { farmsConfig } from 'config/constants'
import { FarmConfig } from 'config/constants/types'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalances = async () => {
      const res = [];
      for (let i = 0; i < farmsConfig.length; i++) {
        const call = [{
          address: getFarmMasterChefAddress(farmsConfig[i].type),
          name: farmsConfig[i].name,
          params: [farmsConfig[i].pid, account],
        }];

        const masterChefABI = getFarmMasterChefAbi(farmsConfig[i].type);
        const farmRes = multicall(masterChefABI, call);
        res.push(farmRes);
      }

      const rawResults = await Promise.all(res);
      const results = farmsConfig.map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index][0]) }))

      setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance
