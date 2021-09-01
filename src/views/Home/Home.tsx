import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Text, BaseLayout } from 'penguinfinance-uikit2'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import PefiStats from 'views/Home/components/PefiStats'
import TotalPefiStakedNests from 'views/Home/components/TotalPefiStakedNests'
import PercentagePefiStakedNests from 'views/Home/components/PercentagePefiStakedNests'
import BurnedPefiCard from 'views/Home/components/BurnedPefiCard'
import PoolCard from 'views/Pools/components/PoolCard'
// import { getBalanceNumber } from 'utils/formatBalance'
// import priceToBnb from 'utils/priceToBnb'
// import { SECONDS_PER_YEAR } from 'config'
import {
  // useFarms,
  // usePriceAvaxUsdt,
  usePools,
  // usePriceEthAvax
} from 'state/hooks'

const Hero = styled.div`
  position: relative;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
  height: 165px;

  h1 {
    color: white;
    font-weight: 500;
    font-size: 44px;
    margin-bottom: 10px;
    z-index: 1;
  }
  > div {
    color: white;
    z-index: 1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: center center;
    height: 165px;
  }
`

const HeroBgImageContainer = styled.div`
  position: absolute;
`

const HeroBgImage = styled.img`
  z-index: -1;
  object-fit: cover;
  min-height: 140px;
  border-radius: 20px;
`

const HeroLeftImage = styled.img`
  position: absolute;
  left: 0;
  top: 94px;
  z-index: 1;
  transform: scaleX(-1);
  height: 96px;

  @media (min-width: 640px) {
    left: 20px;
    top: 16px;
    height: 120px;
  }
  @media (min-width: 768px) {
    left: 20px;
    top: 0;
    height: 170px;
  }
  @media (min-width: 1200px) {
    left: 60px;
    height: 190px;
  }
`

const HeroRightImage = styled.img`
  position: absolute;
  z-index: 1;
  height: 90px;
  top: 96px;
  right: 0;

  @media (min-width: 640px) {
    height: 120px;
    top: 16px;
    right: 0;
  }
  @media (min-width: 768px) {
    height: 160px;
    top: 0;
    right: 0;
  }
  @media (min-width: 1200px) {
    height: 180px;
    top: 0;
    right: 0;
  }
`

const Header = styled(Text)`
  @font-face {
    font-family: 'GothamBold Font';
    src: url(${process.env.PUBLIC_URL}/fonts/GothamBold.ttf) format('truetype');
  }

  font-family: 'GothamBold Font';
  font-size: 32px;
  margin-top: -16px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 44px;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const PoolCardWrapper = styled.div`
  > div {
    > div {
      background: ${({ theme }) => theme.isDark && '#30264F'};
    }
  }
`

const PefiStatsCardWrapper = styled.div``

const SpacingWrapper = styled.div`
  height: 24px;
`

const HomeBgContainer = styled.div`
  background-image: url('/images/home/HomePageBackground.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: -1;
`

const Home: React.FC = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const pools = usePools(account)
  // const AVAX_BLOCK_TIME = useBlockGenerationTime()
  // const BLOCKS_PER_YEAR = new BigNumber(SECONDS_PER_YEAR).div(new BigNumber(AVAX_BLOCK_TIME))

  // const farms = useFarms()
  // const avaxPriceUSD = usePriceAvaxUsdt()
  // const ethPriceBnb = usePriceEthAvax()

  const poolsWithApy = pools.map((pool) => {
    // const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    // const stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    // const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'ETH' ? ethPriceBnb : 1

    // /!\ Assume that the farm quote price is AVAX
    // const stakingTokenPriceInAVAX = new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
    // const rewardTokenPriceInAVAX = priceToBnb(
    //   pool.tokenName,
    //   rewardTokenFarm?.tokenPriceVsQuote,
    //   rewardTokenFarm?.quoteTokenSymbol,
    //   avaxPriceUSD,
    // )

    // const totalRewardPricePerYear = rewardTokenPriceInAVAX.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    // const totalStakingTokenInPool = stakingTokenPriceInAVAX.times(getBalanceNumber(pool.totalStaked))
    // const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)

    return {
      ...pool,
      apy: new BigNumber(0),
    }
  })
  const pefiPool = poolsWithApy.length > 0 ? poolsWithApy[0] : null

  return (
    <>
      <Page>
        <Hero>
          <HeroBgImageContainer>
            <HeroBgImage src={`${process.env.PUBLIC_URL}/images/home/HomeBanner1.png`} alt="astronaut" />
            <HeroLeftImage src={`${process.env.PUBLIC_URL}/images/home/PenguinAstronaut.gif`} alt="astronaut" />
            <HeroRightImage src={`${process.env.PUBLIC_URL}/images/home/Astronaut2.gif`} alt="astronaut" />
          </HeroBgImageContainer>
          <Header color="primary">{TranslateString(576, 'Penguin Finance')}</Header>
          <Text>{TranslateString(578, 'The #1 project on Avalanche')}</Text>
        </Hero>
        <HomeBgContainer />
        <div>
          <Cards>
            <FarmStakingCard />
            <PefiStatsCardWrapper>
              <BurnedPefiCard />
              <SpacingWrapper />
              <PercentagePefiStakedNests pool={pefiPool} />
              <SpacingWrapper />
              <TotalPefiStakedNests pool={pefiPool} />
            </PefiStatsCardWrapper>
            {pefiPool && (
              <PoolCardWrapper>
                <PoolCard pool={pefiPool} isMainPool={false} isHomePage />
              </PoolCardWrapper>
            )}
            <PefiStats pool={pefiPool} />
            <SpacingWrapper />
          </Cards>
        </div>
      </Page>
    </>
  )
}

export default Home
