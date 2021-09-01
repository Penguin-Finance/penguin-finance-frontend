import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import getFarmMasterChefAddress from 'utils/getFarmMasterChefAddress';
import getFarmMasterChefAbi from 'utils/getFarmMasterChefAbi';
import { farmsConfig } from 'config/constants'
import useRefresh from './useRefresh'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account } = useWeb3React()

  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllBalances = async () => {
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

      const allBalances = await Promise.all(res);
      setBalance(allBalances.map(balance => balance[0]));
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh])

  return balances
}

export default useAllEarnings
