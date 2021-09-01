import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'

import getFarmMasterChefAbi from 'utils/getFarmMasterChefAbi'
import getFarmMasterChefAddress from 'utils/getFarmMasterChefAddress'
import farmsConfig from 'config/constants/compounderFarms'

export const fetchMasterChefGlobalData = async () => {
  const pefiMasterChefAddress = getFarmMasterChefAddress('Penguin')
  const gondolaMasterChefAddress = getFarmMasterChefAddress('Gondola')
  const lydiaMasterChefAddress = getFarmMasterChefAddress('Lydia')

  const pefiMasterChefAbi = getFarmMasterChefAbi('Penguin')
  const gondolaMasterChefAbi = getFarmMasterChefAbi('Gondola')
  const lydiaMasterChefAbi = getFarmMasterChefAbi('Lydia')

  const [pefiPerBlock] = await multicall(pefiMasterChefAbi, [
    {
      address: pefiMasterChefAddress,
      name: 'pefiPerBlock',
    },
  ])
  const [gondolaPerSec] = await multicall(gondolaMasterChefAbi, [
    {
      address: gondolaMasterChefAddress,
      name: 'gondolaPerSec',
    },
  ])
  const [lydPerSec] = await multicall(lydiaMasterChefAbi, [
    {
      address: lydiaMasterChefAddress,
      name: 'lydPerSec',
    },
  ])

  return {
    pefiPerBlock: new BigNumber(pefiPerBlock).div(new BigNumber(10).pow(18)).toNumber(),
    gondolaPerSec: new BigNumber(gondolaPerSec).div(new BigNumber(10).pow(18)).toNumber(),
    lydPerSec: new BigNumber(lydPerSec).div(new BigNumber(10).pow(18)).toNumber(),
  }
}

export const fetchCompounderFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const tokenAddress = getAddress(farmConfig.tokenAddresses)
      const quoteTokenAddress = getAddress(farmConfig.quoteTokenAddresses)
      const farmMasterChefAddress =
        farmConfig.type === 'Pangolin' ? farmConfig.stakingAddress : getFarmMasterChefAddress(farmConfig.type)
      const masterChefABI = getFarmMasterChefAbi(farmConfig.type)

      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'balanceOf',
          params: [farmConfig.type === 'Gondola' ? getAddress(farmConfig.swapAddresses) : lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteTokenAddresses),
          name: 'balanceOf',
          params: [farmConfig.type === 'Gondola' ? getAddress(farmConfig.swapAddresses) : lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [farmMasterChefAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteTokenAddresses),
          name: 'decimals',
        },
        // Total supply of Strategy LP tokens
        {
          address: farmConfig.strategyAddress,
          name: 'totalSupply',
        },
        // Balance of basic token in LP token contract
        {
          address: tokenAddress,
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token in LP token contract
        {
          address: quoteTokenAddress,
          name: 'balanceOf',
          params: [lpAddress],
        },
      ]
      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
        strategyTotalSupply,
        tokenBalanceInLp,
        quoteTokenBalanceInLp,
      ] = await multicall(erc20, calls)

      let lpTokenBalanceStrategy: any = new BigNumber(0)
      if (farmConfig.type !== 'Pangolin') {
        const call1 = [
          // Balance of LP tokens in the strategy contract
          {
            address: farmMasterChefAddress,
            name: 'userInfo',
            params: [farmConfig.pid, farmConfig.strategyAddress],
          },
        ]

        const res1 = await multicall(masterChefABI, call1)
        lpTokenBalanceStrategy = res1[0][0]
      } else {
        const call2 = [
          // Balance of LP tokens in the strategy contract
          {
            address: farmMasterChefAddress,
            name: 'balanceOf',
            params: [farmConfig.strategyAddress],
          },
        ]

        const res2 = await multicall(masterChefABI, call2)
        lpTokenBalanceStrategy = res2[0][0]
      }

      // get withdrawal fee of penguin igloos
      let withdrawalFee: any = 0

      if (farmConfig.type === 'Penguin') {
        const iglooPoolInfoCall = [
          {
            address: farmMasterChefAddress,
            name: 'poolInfo',
            params: [farmConfig.pid],
          },
        ]

        const iglooPoolInfoRes = await multicall(masterChefABI, iglooPoolInfoCall)
        withdrawalFee = iglooPoolInfoRes[0][4]
      }

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      // Ratio in % a LP tokens that are in strategy contract, vs the staking
      const strategyRatio = new BigNumber(lpTokenBalanceStrategy._hex).div(new BigNumber(lpTokenBalanceMC))

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(farmConfig.lpSymbol === 'USDT-ZUSDT LP' ? 6 : 18))
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      let info: any = { allocPoint: new BigNumber(1) }
      let totalAllocPoint = 1

      let rewardPerSec = new BigNumber(1)

      if (farmConfig.type !== 'Pangolin') {
        const res = await multicall(getFarmMasterChefAbi(farmConfig.type), [
          {
            address: farmMasterChefAddress,
            name: 'poolInfo',
            params: [farmConfig.pid],
          },
          {
            address: farmMasterChefAddress,
            name: 'totalAllocPoint',
          },
        ])

        info = res[0]
        totalAllocPoint = res[1]
      } else {
        const [rewardForDuration, rewardsDuration] = await multicall(getFarmMasterChefAbi(farmConfig.type), [
          {
            address: farmMasterChefAddress,
            name: 'getRewardForDuration',
          },
          {
            address: farmMasterChefAddress,
            name: 'rewardsDuration',
          },
        ])
        rewardPerSec = new BigNumber(rewardForDuration).div(new BigNumber(rewardsDuration)).div(1e18)
      }

      const allocPoint = farmConfig.type !== 'Pangolin' ? new BigNumber(info.allocPoint._hex) : new BigNumber(1)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        totalSupply: new BigNumber(lpTotalSupply).toNumber(),
        strategySupply: new BigNumber(strategyTotalSupply).toNumber(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        rewardPerSec: new BigNumber(rewardPerSec).toNumber(),
        strategyRatio: new BigNumber(strategyRatio).toNumber(),
        withdrawalFee: withdrawalFee / 100,
        tokenBalanceInLp: new BigNumber(tokenBalanceInLp).div(new BigNumber(10).pow(tokenDecimals)).toNumber(),
        quoteTokenBalanceInLp: new BigNumber(quoteTokenBalanceInLp)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .toNumber(),
        lpTokenBalanceStrategy: new BigNumber(lpTokenBalanceStrategy._hex).div(new BigNumber(10).pow(18)).toNumber(),
      }
    }),
  )

  return data
}
