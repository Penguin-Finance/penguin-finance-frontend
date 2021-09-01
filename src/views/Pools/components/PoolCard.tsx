import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import styled, { keyframes } from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Image, Text, Flex, Tag } from 'penguinfinance-uikit2'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import Balance from 'components/Balance'
import { useERC20, useXPefi } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber, getNumberWithCommas } from 'utils/formatBalance'
import { useNestApr, useNestApy } from 'state/hooks'
import { PoolCategory } from 'config/constants/types'
import { APY_TOOLTIP_TEXT } from 'config'
import { Pool } from 'state/types'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CardTitle from './CardTitle'
import Card from './Card'
import CardFooter from './CardFooter'
import PenaltyConfirmModal from './PenaltyConfirmModal'

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCard = styled(Card)<{ isNestPage?: boolean }>`
  min-width: 350px;
  @media (min-width: 640px) {
    transform: ${(props) => props.isNestPage && 'scale(1.3)'};
    margin-top: ${(props) => props.isNestPage && '60px'};
    margin-bottom: ${(props) => props.isNestPage && '60px'};
  }
`

const PGUnlockButton = styled(UnlockButton)<{ isHomePage?: boolean }>`
  background: ${({ theme, isHomePage }) => !theme.isDark && isHomePage && '#383466'};
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const MultiplierTag = styled(Tag)``

const APYTag = styled(Tag)`
  margin-right: 6px;
  span {
    color: #ce022d;
    margin-right: 4px;
  }
`

const APYToolTipWrapper = styled.div``

const HelperTag = styled(Tag)`
  margin-right: 6px;
  width: 28px;
  border-radius: 50%;
  span {
    color: #ce022d;
  }
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
  border-radius: 16px !important;
  margin-top: 0px !important;
  > div {
    width: 100%;
    white-space: pre-wrap !important;
  }
  &:after {
    border-top-color: ${({ theme }) => (theme.isDark ? '#ffffff!important' : '#383466!important')};
    border-bottom-color: ${({ theme }) => (theme.isDark ? '#ffffff!important' : '#383466!important')};
  }
`

const CardContent = styled.div`
  padding: 24px;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px 32px 0 0;
`

const CardAction = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: 0 0 32px 32px;
`

interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
  isMainPool: boolean
  isNestPage?: boolean
  isHomePage?: boolean
}

const PoolCard: React.FC<HarvestProps> = ({ pool, isMainPool, isNestPage, isHomePage }) => {
  const {
    sousId,
    image,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    penguinNestsGuideLink,
    tokenDecimals,
    poolCategory,
    totalStaked,
    totalSupply,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
  } = pool

  // Pools using native AVAX behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { account } = useWeb3React()
  const block = useBlock()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const xPefiContract = useXPefi()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [handsOnPenalty, setHandsOnPenalty] = useState(0)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)

  const blocksUntilStart = Math.max(startBlock - block, 0)
  const blocksRemaining = Math.max(endBlock - block, 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isCardActive = isFinished && accountHasStakedBalance
  const rewardTokenRatio =
    totalStaked && totalSupply ? new BigNumber(totalStaked).div(new BigNumber(totalSupply)).toJSON() : 1
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))
  const displayedNestApr = (useNestApr() * 100).toFixed(2)
  const displayedNestApy = (useNestApy() * 100).toFixed(2)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={`x${stakingTokenName}`} />,
  )

  const [onPresentPenaltyConfirm] = useModal(
    <PenaltyConfirmModal handsOnPenalty={handsOnPenalty} onConfirm={onPresentWithdraw} />,
  )

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
      ? new BigNumber(pool.totalStaked).div(new BigNumber(pool.totalSupply)).toJSON()
      : 1
  }

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const xPefiToPefiRatio = getXPefiToPefiRatio()

  return (
    <StyledCard isNestPage={isNestPage} isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      {isMainPool && <StyledCardAccent />}
      {isFinished && sousId !== 0 && <PoolFinishedSash />}
      <CardContent>
        <CardTitle isFinished={isFinished && sousId !== 0}>
          {`x${tokenName}`} {TranslateString(348, 'Nest')}
        </CardTitle>
        <Flex justifyContent="flex-end">
          {/* <APYTag variant="primary" outline>
            <a href="/">
              <span>{getNumberWithCommas(displayedNestApr)}%</span> APR
            </a>
          </APYTag> */}
          <APYTag variant="primary" outline>
            <APYToolTipWrapper data-for="custom-class" data-tip={APY_TOOLTIP_TEXT}>
              <span>{getNumberWithCommas(displayedNestApy)}%</span> APY
            </APYToolTipWrapper>
            <CustomToolTip
              id="custom-class"
              wrapper="div"
              delayHide={300}
              effect="solid"
              multiline
              place="bottom"
              html
            />
          </APYTag>
          <HelperTag variant="primary" outline>
            <a
              href="https://penguin-finance.gitbook.io/penguin-finance/summary/penguin-nests-staking-and-fee-collection"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>?</span>
            </a>
          </HelperTag>
          <MultiplierTag variant="primary">160X</MultiplierTag>
        </Flex>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <Flex minWidth="100%" alignItems="center">
            <Image src={`/images/pools/${image || tokenName}.png`} width={64} height={64} alt={tokenName} />
            <Flex flexDirection="column" width="100%">
              <Flex ml="8px" justifyContent="space-between">
                <Text color="textSubtle" bold fontSize="14px">
                  xPEFI to PEFI:
                </Text>
                <Text color="textSubtle" bold fontSize="14px">
                  {Number(Number(xPefiToPefiRatio).toFixed(3))}
                </Text>
              </Flex>
              <Flex ml="8px" justifyContent="space-between">
                <Text color="textSubtle" bold fontSize="14px">
                  Paper Hands Penalty:
                </Text>
                <Text color="textSubtle" bold fontSize="14px">{`${Number(handsOnPenalty).toFixed(2)}%`}</Text>
              </Flex>
            </Flex>
          </Flex>
        </div>
        <StyledCardActions>
          {!account && <PGUnlockButton isHomePage={isHomePage} />}
          {account &&
            (needsApproval ? (
              <div style={{ flex: 1 }}>
                <Button disabled={isFinished || requestedApproval} onClick={handleApprove} scale="md">
                  {`Approve ${stakingTokenName}`}
                </Button>
              </div>
            ) : (
              <>
                <Button disabled={stakedBalance.eq(new BigNumber(0))} onClick={onPresentPenaltyConfirm}>
                  {`Unstake ${stakingTokenName}`}
                </Button>
                <StyledActionSpacer />
                <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                  <AddIcon color="background" />
                </IconButton>
              </>
            ))}
        </StyledCardActions>
        <StyledDetails>
          <Label style={{ flex: 1 }}>
            <Text color="primary">{TranslateString(384, 'Your Stake:')}</Text>
          </Label>
          <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
          <TokenSymbol>
            <Text color="primary" fontSize="14px">
              {`x${stakingTokenName}`}
            </Text>
          </TokenSymbol>
        </StyledDetails>
        <StyledDetails>
          <Label style={{ flex: 1 }}>
            <Text color="primary">{TranslateString(384, 'PEFI equivalent:')}</Text>
          </Label>
          <Balance
            fontSize="14px"
            isDisabled={isFinished}
            value={new BigNumber(getBalanceNumber(stakedBalance)).times(new BigNumber(rewardTokenRatio)).toNumber()}
          />
          <TokenSymbol>
            <Text color="primary" fontSize="14px">
              {stakingTokenName}
            </Text>
          </TokenSymbol>
        </StyledDetails>
      </CardContent>
      <CardAction>
        <CardFooter
          penguinNestsGuideLink={penguinNestsGuideLink}
          totalStaked={totalStaked}
          blocksRemaining={blocksRemaining}
          isFinished={isFinished}
          blocksUntilStart={blocksUntilStart}
          poolCategory={poolCategory}
        />
      </CardAction>
    </StyledCard>
  )
}

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  font-size: 14px;
`

const Label = styled.div`
  margin-left: 20px;
`

const TokenSymbol = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
`

export default PoolCard
