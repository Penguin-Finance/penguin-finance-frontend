import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import farmsConfig from 'config/constants/farms'
import { getAddress } from 'utils/addressHelpers'
import getFarmMasterChefAbi from 'utils/getFarmMasterChefAbi';
import getFarmMasterChefAddress from 'utils/getFarmMasterChefAddress';

export const fetchFarmUserAllowances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    const masterChefAddress = getFarmMasterChefAddress(farm.type);
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)

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

export const fetchFarmUserStakedBalances = async (account: string) => {
  const results = [];
  for (let i = 0; i < farmsConfig.length; i++) {
    const call = [{
      address: getFarmMasterChefAddress(farmsConfig[i].type),
      name: 'userInfo',
      params: [farmsConfig[i].pid, account],
    }];

    const masterChefABI = getFarmMasterChefAbi(farmsConfig[i].type);
    const farmRes = multicall(masterChefABI, call);
    results.push(farmRes);
  }

  const rawStakedBalances = await Promise.all(results);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0][0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string) => {
  const results = [];
  for (let i = 0; i < farmsConfig.length; i++) {
    const call = [{
      address: getFarmMasterChefAddress(farmsConfig[i].type),
      name: farmsConfig[i].name,
      params: [farmsConfig[i].pid, account],
    }];

    const masterChefABI = getFarmMasterChefAbi(farmsConfig[i].type);
    const farmRes = multicall(masterChefABI, call);
    results.push(farmRes);
  }

  const rawEarnings = await Promise.all(results);

  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings[0]).toJSON()
  })

  return parsedEarnings
}
