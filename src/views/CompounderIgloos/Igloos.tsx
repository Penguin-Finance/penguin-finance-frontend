import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { Text, Flex } from 'penguinfinance-uikit2'
import ReactTooltip from 'react-tooltip'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { SECONDS_PER_YEAR, WEEKS_PER_YEAR, PEFI_POOL_PID, SNOWBALL_TOOLTIP_TEXT } from 'config'
import useTheme from 'hooks/useTheme'
import useBlockGenerationTime from 'hooks/useBlockGenerationTime'
import Page from 'components/layout/Page'
import {
  usePefiPerBlock,
  useGondolaPerSec,
  useLydPerSec,
  usePriceAvaxUsdt,
  usePricePefiUsdt,
  usePriceEthUsdt,
  usePricePngUsdt,
  usePriceLinkUsdt,
  usePriceLydUsdt,
  usePriceGdlUsdt,
  useCompounderFarms,
} from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchCompounderFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import Select from 'components/Select/Select'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'

// temporarily hide projects that wont appear during release so that we don't have empty categories (10.06.2021)
const PROJECTS = ['All', 'Your Farms', 'Penguin Finance', 'Pangolin', 'Gondola', 'Lydia', 'Snowball']

//
const Igloos: React.FC = () => {
  const { path } = useRouteMatch()
  const pefiPerBlock = usePefiPerBlock()
  const gondolaPerSec = useGondolaPerSec()
  const lydPerSec = useLydPerSec()
  const farmsLP = useCompounderFarms()
  const pefiPrice = usePricePefiUsdt()
  const avaxPrice = usePriceAvaxUsdt()
  const { account } = useWeb3React()
  const ethPriceUsd = usePriceEthUsdt()
  const pngPriceUsd = usePricePngUsdt()
  const linkPriceUsd = usePriceLinkUsdt()
  const lydPriceUsd = usePriceLydUsdt()
  const gdlPriceUsd = usePriceGdlUsdt()
  const { isDark } = useTheme()
  const [selectedProject, setProject] = useState('All')
  const [sortType, setSortType] = useState('farm-tvl')
  const AVAX_BLOCK_TIME = useBlockGenerationTime()
  const BLOCKS_PER_YEAR = new BigNumber(SECONDS_PER_YEAR).div(new BigNumber(AVAX_BLOCK_TIME))
  const BLOCKS_PER_WEEK = BLOCKS_PER_YEAR.div(new BigNumber(WEEKS_PER_YEAR))

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchCompounderFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === '0X')

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD

  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const pefiPriceVsAVAX = new BigNumber(farmsLP.find((farm) => farm.pid === PEFI_POOL_PID)?.tokenPriceVsQuote || 0)
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const pefiRewardPerBlock = pefiPerBlock.times(farm.poolWeight)
        const gondolaRewardPerSec = gondolaPerSec.times(farm.poolWeight)
        const lydRewardPerSec = lydPerSec.times(farm.poolWeight)
        const pefiRewardPerYear = pefiRewardPerBlock.times(BLOCKS_PER_WEEK).times(new BigNumber(WEEKS_PER_YEAR))
        const gondolaRewardPerYear = gondolaRewardPerSec.times(SECONDS_PER_YEAR)
        const lydRewardPerYear = lydRewardPerSec.times(SECONDS_PER_YEAR)

        let rewardPerYear = pefiRewardPerYear
        let rewardTokenPrice = pefiPrice
        if (farm.type === 'Gondola') {
          rewardPerYear = gondolaRewardPerYear
          rewardTokenPrice = gdlPriceUsd
        }
        if (farm.type === 'Lydia') {
          rewardPerYear = lydRewardPerYear
          rewardTokenPrice = lydPriceUsd
        }
        if (farm.type === 'Pangolin') {
          rewardPerYear = new BigNumber(farm.rewardPerSec).times(SECONDS_PER_YEAR)
          rewardTokenPrice = pngPriceUsd
        }
        // pefiPriceInQuote * rewardPerWeek / lpTotalInQuoteToken
        let apy = pefiPriceVsAVAX.times(rewardPerYear).div(farm.lpTotalInQuoteToken)

        if (farm.quoteTokenSymbol === QuoteToken.USDT || farm.quoteTokenSymbol === QuoteToken.UST) {
          if (farm.lpTotalInQuoteToken === '0') {
            apy = new BigNumber(0)
          } else {
            // apy = pefiPriceVsAVAX.times(rewardPerYear).div(farm.lpTotalInQuoteToken).times(avaxPrice)
            apy = rewardPerYear.div(farm.lpTotalInQuoteToken)
          }
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          if (farm.lpTotalInQuoteToken === '0') {
            apy = new BigNumber(0)
          } else {
            apy = rewardTokenPrice.div(ethPriceUsd).times(rewardPerYear).div(farm.lpTotalInQuoteToken)
          }
        } else if (farm.quoteTokenSymbol === QuoteToken.PEFI) {
          apy = rewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.AVAX) {
          apy = rewardTokenPrice.div(avaxPrice).times(rewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.LYD) {
          apy = rewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.PNG) {
          apy = rewardPerYear.div(farm.lpTotalInQuoteToken)
        }

        let totalValue = null
        if (!farm.lpTotalInQuoteToken) {
          totalValue = null
        } else if (farm.quoteTokenSymbol === QuoteToken.AVAX) {
          totalValue = avaxPrice.times(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.PEFI) {
          totalValue = pefiPrice.times(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          totalValue = ethPriceUsd.times(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.PNG) {
          totalValue = pngPriceUsd.times(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.LYD) {
          totalValue = lydPriceUsd.times(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.LINK) {
          totalValue = linkPriceUsd.times(farm.lpTotalInQuoteToken)
        } else {
          totalValue = farm.lpTotalInQuoteToken
        }
        return { ...farm, apy, totalValue }
      })

      farmsToDisplayWithAPY = farmsToDisplayWithAPY.sort((farm1, farm2) => {
        if (sortType === 'farm-tvl') {
          const farm1TotalValue = farm1.totalValue ? Number(farm1.totalValue.times(farm1.strategyRatio)) : 0
          const farm2TotalValue = farm2.totalValue ? Number(farm2.totalValue.times(farm2.strategyRatio)) : 0

          return farm1TotalValue < farm2TotalValue ? 1 : -1
        }
        return farm1.apy < farm2.apy ? 1 : -1
      })

      return farmsToDisplayWithAPY.map((farm, index) => (
        <FarmCard
          key={`${farm.type}-${farm.pid}`}
          index={index}
          farm={farm}
          removed={removed}
          account={account}
          avaxPrice={avaxPrice}
          pefiPrice={pefiPrice}
          ethPrice={ethPriceUsd}
          pngPrice={pngPriceUsd}
          lydPrice={lydPriceUsd}
          linkPrice={linkPriceUsd}
        />
      ))
    },
    [
      BLOCKS_PER_WEEK,
      farmsLP,
      avaxPrice,
      ethPriceUsd,
      pefiPrice,
      pngPriceUsd,
      linkPriceUsd,
      lydPriceUsd,
      gdlPriceUsd,
      pefiPerBlock,
      gondolaPerSec,
      lydPerSec,
      account,
      sortType,
    ],
  )

  const handleSelectProject = (project) => () => {
    if (project === 'Snowball') {
      window.open('https://app.snowball.network/snob/', '_blank')
      return
    }
    setProject(project)
  }

  const { filteredActiveFarms, filteredInActiveFarms } = useMemo(() => {
    let filteredActiveFarmList = [...activeFarms]
    let filteredInActiveFarmList = [...inactiveFarms]

    if (selectedProject !== 'All') {
      if (selectedProject === 'Your Farms') {
        filteredActiveFarmList = activeFarms.filter((farm) => farm.userData && Number(farm.userData.stakedBalance) > 0)
        filteredInActiveFarmList = inactiveFarms.filter(
          (farm) => farm.userData && Number(farm.userData.stakedBalance) > 0,
        )
      } else {
        filteredActiveFarmList = activeFarms.filter((farm) => selectedProject.includes(farm.type))
        filteredInActiveFarmList = inactiveFarms.filter((farm) => selectedProject.includes(farm.type))
      }
    }

    return {
      filteredActiveFarms: filteredActiveFarmList,
      filteredInActiveFarms: filteredInActiveFarmList,
    }
  }, [activeFarms, inactiveFarms, selectedProject])

  return (
    <CompounderIglooPage>
      <BgWrapper>
        <IgloosBgContainer />
      </BgWrapper>
      <IgloosBannerContainer>
        <BannerImage
          src={`${process.env.PUBLIC_URL}/images/compounder-igloos/Compounder${isDark ? 'Night' : 'Day'}.gif`}
          alt="compounder igloos banner"
        />
      </IgloosBannerContainer>
      <CompounderContent>
        <FilterContainer>
          <LabelWrapper>
            <Text textTransform="uppercase">Sort by</Text>
            <Select
              value={sortType}
              options={[
                { label: 'Farm TVL', value: 'farm-tvl' },
                { label: 'APY', value: 'apy' },
              ]}
              onChange={setSortType}
            />
          </LabelWrapper>
          <ProjectFiltersWrapper>
            {PROJECTS.map((project) =>
              project === 'Snowball' ? (
                <div>
                  <ProjectLabel
                    data-for="custom-class"
                    data-tip={SNOWBALL_TOOLTIP_TEXT}
                    fontSize="18px"
                    active={project === selectedProject}
                    key={project}
                    onClick={handleSelectProject(project)}
                  >
                    {project}
                  </ProjectLabel>
                  <CustomToolTip
                    id="custom-class"
                    wrapper="div"
                    delayHide={300}
                    effect="solid"
                    multiline
                    place="left"
                    html
                  />
                </div>
              ) : (
                <ProjectLabel
                  fontSize="18px"
                  active={project === selectedProject}
                  key={project}
                  onClick={handleSelectProject(project)}
                >
                  {project}
                </ProjectLabel>
              ),
            )}
          </ProjectFiltersWrapper>
          <FilterWrapper>
            <Text textTransform="uppercase">Filter by</Text>
            <Select
              value={selectedProject}
              options={PROJECTS.map((project) => ({
                label: project,
                value: project,
              }))}
              onChange={setProject}
            />
          </FilterWrapper>
        </FilterContainer>
        <IgloosContentContainer>
          <Route exact path={`${path}`}>
            {farmsList(filteredActiveFarms, false)}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsList(filteredInActiveFarms, true)}
          </Route>
        </IgloosContentContainer>
      </CompounderContent>
    </CompounderIglooPage>
  )
}

const CompounderIglooPage = styled(Page)`
  max-width: 1200px;
`

// bg
const IgloosBgContainer = styled.div`
  background-image: url('/images/compounder-igloos/CompounderPattern.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: absolute;
  top: -8px;
  bottom: -8px;
  right: 0px;
  left: 0px;
  z-index: -1;
`

const BgWrapper = styled.div`
  background: ${({ theme }) => (theme.isDark ? '#1A1028' : '#F9F8F9')};
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: -1;
`

// banner
const IgloosBannerContainer = styled.div`
  margin-bottom: 24px;

  @media (min-width: 640px) {
    margin-bottom: 64px;
  }
`
const BannerImage = styled.img`
  z-index: -1;
  width: 100%;
`

// content
const CompounderContent = styled.div``

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (min-width: 1200px) {
    justify-content: space-between;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterWrapper = styled(LabelWrapper)`
  margin-left: 1rem;
  display: block;
  @media (min-width: 1200px) {
    display: none;
  }
`

const ProjectLabel = styled(Text)<{ active: boolean }>`
  cursor: pointer;
  margin-left: 1rem;
  margin-top: 0.5rem;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.menuIcon};
  border-bottom: ${(props) => props.active && `2px solid ${props.theme.colors.menuIcon}`};

  @media (min-width: 1450px) {
    margin-left: 1.5rem;
  }
`

const ProjectFiltersWrapper = styled(Flex)`
  display: none;
  @media (min-width: 1200px) {
    display: flex;
  }
`

const IgloosContentContainer = styled.div`
  position: relative;
`

const CustomToolTip = styled(ReactTooltip)`
  width: 100% !important;
  max-width: 300px !important;
  background: ${({ theme }) => (theme.isDark ? '#ffffff!important' : '#383466!important')};
  box-shadow: ${(props) => `${props.theme.card.boxShadow}!important`};
  color: ${({ theme }) => (theme.isDark ? '#2D2159!important' : '#ffffff!important')};
  opacity: 1 !important;
  padding: 16px !important;
  font-size: 16px !important;
  border: 2px solid #fff !important;
  border-radius: 16px !important;
  margin-top: 0px !important;
  line-height: 25px !important;
  > div {
    width: 100%;
    white-space: pre-wrap !important;
  }
  &:before {
    border-right-color: #ffffff !important;
    border-left-color: #ffffff !important;
  }
  &:after {
    border-left-color: ${({ theme }) => (theme.isDark ? '#ffffff!important' : '#383466!important')};
    border-right-color: ${({ theme }) => (theme.isDark ? '#ffffff!important' : '#383466!important')};
  }
`

export default Igloos
