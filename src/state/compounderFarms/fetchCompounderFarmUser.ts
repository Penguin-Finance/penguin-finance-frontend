import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import farmsConfig from 'config/constants/compounderFarms'
import { getAddress } from 'utils/addressHelpers'
import getFarmMasterChefAbi from 'utils/getFarmMasterChefAbi'
import getFarmMasterChefAddress from 'utils/getFarmMasterChefAddress'
import getStrategyAddress from 'utils/getStrategyAddress'
import getStrategyAbi from 'utils/getStrategyAbi'

export const fetchCompounderFarmUserAllowances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    const strategyContractAddress = getStrategyAddress(farm.lpSymbol, farm.type)
    return { address: lpContractAddress, name: 'allowance', params: [account, strategyContractAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })

  return parsedLpAllowances
}

export const fetchCompounderFarmUserTokenBalances = async (account: string) => {
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

export const fetchCompounderFarmUserStakedBalances = async (account: string) => {
  // get deposited Lp balances
  const depositedLpBalanceResults = []
  for (let i = 0; i < farmsConfig.length; i++) {
    const call = [
      {
        address: getStrategyAddress(farmsConfig[i].lpSymbol, farmsConfig[i].type),
        name: 'balanceOf',
        params: [account],
      },
    ]

    const strategyAbi = getStrategyAbi(farmsConfig[i].lpSymbol, farmsConfig[i].type)
    const farmRes = multicall(strategyAbi, call)
    depositedLpBalanceResults.push(farmRes)
  }

  const rawDepositedLpBalances = await Promise.all(depositedLpBalanceResults)
  const depositedLpBalances = rawDepositedLpBalances.map((balance) => {
    return new BigNumber(balance[0][0]._hex).toJSON()
  })

  // get receipt Lp balances
  const receiptLpBalanceResults = []
  for (let i = 0; i < depositedLpBalances.length; i++) {
    const call = [
      {
        address: getStrategyAddress(farmsConfig[i].lpSymbol, farmsConfig[i].type),
        name: 'getDepositTokensForShares',
        params: [depositedLpBalances[i]],
      },
    ]

    const strategyAbi = getStrategyAbi(farmsConfig[i].lpSymbol, farmsConfig[i].type)
    const res = multicall(strategyAbi, call)
    receiptLpBalanceResults.push(res)
  }

  const rawReceiptLpBalances = await Promise.all(receiptLpBalanceResults)
  const receiptLpBalances = rawReceiptLpBalances.map((receiptBalance) => {
    return new BigNumber(receiptBalance[0][0]._hex).toJSON()
  })

  return { depositedLpBalances, receiptLpBalances }
}

export const fetchCompounderFarmUserEarnings = async (account: string) => {
  const results = []
  for (let i = 0; i < farmsConfig.length; i++) {
    const masterChefAddress =
      farmsConfig[i].type === 'Pangolin' ? farmsConfig[i].stakingAddress : getFarmMasterChefAddress(farmsConfig[i].type)

    const call =
      farmsConfig[i].type === 'Pangolin'
        ? [
            {
              address: masterChefAddress,
              name: farmsConfig[i].name,
              params: [account],
            },
          ]
        : [
            {
              address: masterChefAddress,
              name: farmsConfig[i].name,
              params: [farmsConfig[i].pid, account],
            },
          ]

    const masterChefABI = getFarmMasterChefAbi(farmsConfig[i].type)
    const farmRes = multicall(masterChefABI, call)
    results.push(farmRes)
  }

  const rawEarnings = await Promise.all(results)

  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings[0]).toJSON()
  })

  return parsedEarnings
}

export const fetchCompounderPendingXPefiBalances = async (account: string) => {
  const results = []
  for (let i = 0; i < farmsConfig.length; i++) {
    if (farmsConfig[i].type === 'Penguin') {
      const call = [
        {
          address: farmsConfig[i].strategyAddress,
          name: 'pendingXPefi',
          params: [account],
        },
      ]

      const strategyABI = getStrategyAbi(farmsConfig[i].lpSymbol, farmsConfig[i].type)
      const pendingXPefi = multicall(strategyABI, call)
      results.push(pendingXPefi)
    } else {
      results.push([0])
    }
  }

  const rawPendingXPefi = await Promise.all(results)

  const parsedPendingXPefi = rawPendingXPefi.map((earnings) => {
    return new BigNumber(earnings[0]).toJSON()
  })

  return parsedPendingXPefi
}
