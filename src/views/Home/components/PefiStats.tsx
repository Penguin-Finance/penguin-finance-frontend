import React, { useState, useCallback, useEffect } from 'react'
import { Card, CardBody, Heading, Text } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useXPefi } from 'hooks/useContract'
import { getPefiAddress } from 'utils/addressHelpers'
import {
  usePefiPerBlock,
  useFarms,
  usePriceAvaxUsdt,
  usePricePefiUsdt,
  usePriceEthUsdt,
  usePricePngUsdt,
  usePriceLinkUsdt,
  usePriceLydUsdt,
  useCompounderFarms,
} from 'state/hooks'
import { Pool } from 'state/types'
import { QuoteToken } from 'config/constants/types'
import { PEFI_MAX_SUPPLY } from 'config'
import CardValue from './CardValue'

const StyledPefiStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  background: ${({ theme }) => theme.isDark && '#30264F'};
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}

const PefiStats: React.FC<HarvestProps> = ({ pool }) => {
  const TranslateString = useI18n()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getPefiAddress())
  const xPefiContract = useXPefi()
  const pefiPerBlock = usePefiPerBlock()
  const farmsLP = useFarms()
  const compounderFarms = useCompounderFarms()
  const pefiPrice = usePricePefiUsdt()
  const avaxPrice = usePriceAvaxUsdt()
  const ethPriceUsd = usePriceEthUsdt()
  const pngPriceUsd = usePricePngUsdt()
  const linkPriceUsd = usePriceLinkUsdt()
  const lydPriceUsd = usePriceLydUsdt()
  const [handsOnPenalty, setHandsOnPenalty] = useState(0)

  const fetchEarlyWithdrawalFee = useCallback(async () => {
    const earlyWithdrawalFee = await xPefiContract.methods.earlyWithdrawalFee().call()
    const maxEarlyWithdrawalFee = await xPefiContract.methods.MAX_EARLY_WITHDRAW_FEE().call()
    const penalty = (earlyWithdrawalFee / maxEarlyWithdrawalFee) * 100
    setHandsOnPenalty(penalty)
  }, [xPefiContract])

  useEffect(() => {
    fetchEarlyWithdrawalFee()
  }, [fetchEarlyWithdrawalFee])

  const getXPefiToPefiRatio = () => {
    return pool.totalStaked && pool.totalSupply
      ? new BigNumber(pool.totalStaked).div(new BigNumber(pool.totalSupply)).toNumber()
      : 1
  }

  const getTokenPrice = (tokenSymbol: string) => {
    if (tokenSymbol === QuoteToken.PEFI) return pefiPrice
    if (tokenSymbol === QuoteToken.AVAX) return avaxPrice
    if (tokenSymbol === QuoteToken.ETH) return ethPriceUsd
    return new BigNumber(1)
  }

  // calculate TVL in igloos
  const getIgloosTVL = () => {
    let igloosTVL = new BigNumber(0)
    farmsLP.map((farmLP) => {
      const farmQuoteTokenPrice = getTokenPrice(farmLP.quoteTokenSymbol)
      if (farmLP.quoteTokenAmount) {
        const iglooTVL = farmQuoteTokenPrice.times(new BigNumber(farmLP.quoteTokenAmount)).times(new BigNumber(2))
        if (iglooTVL) igloosTVL = igloosTVL.plus(iglooTVL)
      }
      return igloosTVL
    })
    return igloosTVL.toNumber()
  }

  // calculate TVL in compounder farms
  const getCompounderFarmsTVL = () => {
    let compounderFarmsTVL = 0
    compounderFarms.map((compounderFarm) => {
      let totalValue = null
      if (!compounderFarm.lpTotalInQuoteToken) {
        totalValue = new BigNumber(0)
      } else if (compounderFarm.quoteTokenSymbol === QuoteToken.AVAX) {
        totalValue = avaxPrice.times(compounderFarm.lpTotalInQuoteToken)
      } else if (compounderFarm.quoteTokenSymbol === QuoteToken.PEFI) {
        totalValue = pefiPrice.times(compounderFarm.lpTotalInQuoteToken)
      } else if (compounderFarm.quoteTokenSymbol === QuoteToken.ETH) {
        totalValue = ethPriceUsd.times(compounderFarm.lpTotalInQuoteToken)
      } else if (compounderFarm.quoteTokenSymbol === QuoteToken.PNG) {
        totalValue = pngPriceUsd.times(compounderFarm.lpTotalInQuoteToken)
      } else if (compounderFarm.quoteTokenSymbol === QuoteToken.LYD) {
        totalValue = lydPriceUsd.times(compounderFarm.lpTotalInQuoteToken)
      } else if (compounderFarm.quoteTokenSymbol === QuoteToken.LINK) {
        totalValue = linkPriceUsd.times(compounderFarm.lpTotalInQuoteToken)
      } else {
        totalValue = compounderFarm.lpTotalInQuoteToken
      }

      if (compounderFarm.strategyRatio) {
        compounderFarmsTVL += totalValue.times(compounderFarm.strategyRatio).toNumber()
      }

      return compounderFarm
    })
    return compounderFarmsTVL
  }

  // calculate TVL in pefi nest
  const getNestTVL = () => {
    if (pool.totalSupply) return getXPefiToPefiRatio() * pefiPrice.toNumber() * getBalanceNumber(pool.totalSupply)
    return 0
  }

  // get pefi marketcap
  const getPefiMarketcap = () => {
    if (totalSupply) return pefiPrice.toNumber() * getBalanceNumber(totalSupply)
    return 0
  }

  const tvl = getIgloosTVL() + getCompounderFarmsTVL() + getNestTVL()
  const xPefiToPefiRatio = getXPefiToPefiRatio()
  const pefiMarketcap = getPefiMarketcap()

  return (
    <StyledPefiStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(534, 'PEFI Stats')}
        </Heading>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(536, 'Circulating PEFI Supply:')}
          </Text>
          {totalSupply && <CardValue fontSize="14px" suffix=" PEFI" value={getBalanceNumber(totalSupply)} />}
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(538, 'Total PEFI Burned:')}
          </Text>
          {burnedBalance && <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} />}
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(538, 'Total Value Locked:')}
          </Text>
          {tvl && <CardValue fontSize="14px" prefix="$" decimals={2} value={tvl || 0} />}
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(538, 'PEFI Marketcap:')}
          </Text>
          {pefiMarketcap && <CardValue fontSize="14px" prefix="$" value={pefiMarketcap} />}
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(540, 'XPEFI to PEFI ratio:')}
          </Text>
          <CardValue fontSize="14px" decimals={3} value={xPefiToPefiRatio} />
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(540, 'PEFI Emission Rate:')}
          </Text>
          <CardValue fontSize="14px" decimals={2} suffix=" PEFI/block" value={pefiPerBlock.toNumber()} />
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(540, 'Paper Hands Penalty:')}
          </Text>
          <CardValue fontSize="14px" decimals={2} suffix=" %" value={Number(handsOnPenalty)} />
        </Row>
        <Row>
          <Text color="primary" fontSize="14px">
            {TranslateString(538, 'Max PEFI Supply:')}
          </Text>
          <CardValue fontSize="14px" bold value={PEFI_MAX_SUPPLY} />
        </Row>
      </CardBody>
    </StyledPefiStats>
  )
}

export default PefiStats
