import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Text, useModal } from 'penguinfinance-uikit2'
import ReactTooltip from 'react-tooltip'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import SvgIcon from 'components/SvgIcon'
import { useEmperor } from 'state/hooks'
import { useXPefi } from 'hooks/useContract'
import { getEmperorAddress } from 'utils/addressHelpers'
import { badWordsFilter } from 'utils/address'
import { useEmperorActions, useXPefiApprove } from 'hooks/useEmperor'
import { NON_ADDRESS } from 'config'
import RegisterModal from './RegisterModal'
// import StealCrownModal from './StealCrownModal'
import CustomStyleModal from './CustomStyleModal'
import { getPenguinColor, getStealCrownTooltip } from '../utils'
import { UnlockButton, CardBlockHeader, CardBlock } from '../UI'

const CardBlockContent = styled.div`
  display: block;
  position: relative;
  &:hover {
    z-index: 15;
  }
`

const TitleBgWrapper = styled.div<{ color: string; account: string }>`
  z-index: -1;
  width: 100%;
  text-align: center;
  margin-top: ${(props) => (props.account ? '7%' : '-30%')};
  position: absolute;

  svg {
    width: 300px;
  }

  transform: ${(props) => props.account && 'scale(1.3)'};
  @media (min-width: 640px) {
    transform: ${(props) => props.account && 'scale(1.4)'};
  }
  @media (min-width: 768px) {
    margin-top: ${(props) => (props.account ? '7%' : '-32%')};
  }
  @media (min-width: 1200px) {
    margin-top: ${(props) => (props.account ? '7%' : '-24%')};
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    transform: ${(props) => props.account && 'scale(1.5)'};
  }
  @media (min-width: 1450px) and (max-height: 800px) {
    img {
      margin-left: 6%;
    }
  }
`

const CardBlockBody = styled.div<{ account: string }>`
  background: ${(props) => props.theme.card.background};
  border-radius: 16px;
  padding: 16px;
  position: relative;
  text-align: center;

  margin-top: 25%;
  min-width: 120px;
  padding: 24px 8px 8px;

  @media (min-width: 640px) {
    width: 100%;
    margin-top: 25%;
    padding: 48px 16px 12px;
  }
  @media (min-width: 768px) {
    width: 100%;
    padding: 64px 20px 16px;
    padding-top: ${(props) => !props.account && '24px'};
    margin-top: 22%;
  }
  @media (min-width: 1200px) {
    width: 100%;
    border-radius: 16px;
    padding: 48px 24px 16px;
    padding-top: ${(props) => !props.account && '24px'};
    margin-top: 30%;
  }
  @media (min-width: 1450px) {
    min-width: 240px;
    padding: 40px 24px 16px;
    padding-top: ${(props) => !props.account && '24px'};
    margin-top: 32%;
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    padding-top: 16px;
  }
`

const WalletContainer = styled.div`
  text-align: center;
  position: relative;
  z-index: 10;
  margin-top: 10px;
  button {
    margin-top: 20px;
    @media (max-width: 640px) {
      margin-top: 10px;
    }
  }
`

const RegisterContainer = styled.div`
  margin-top: 10px;
  text-align: center;
  position: relative;
  z-index: 10;
  button {
    margin-top: 8px;
  }
`

const RegisterButtonContainer = styled.div`
  button {
    width: 200px;
    border-radius: 30px;
    @media only screen and (min-width: 1200px) and (max-width: 1450px) {
      width: 140px;
    }
  }
`

const StealButtonContainer = styled.div`
  button {
    width: 200px;
    border-radius: 30px;
    @media only screen and (min-width: 1200px) and (max-width: 1450px) {
      width: 140px;
    }
  }
`

const StealAndPoisonButtonContainer = styled.div`
  button {
    width: 200px;
    border-radius: 30px;
    background: #f5c83b;
    @media only screen and (min-width: 1200px) and (max-width: 1450px) {
      width: 140px;
    }
  }
`

const ButtonToolTipWrapper = styled.div``

const CustomizeStyleButtonContainer = styled.div`
  button {
    width: 200px;
    background: ${(props) => props.theme.colors.secondary};
    border-radius: 30px;
    @media only screen and (min-width: 1200px) and (max-width: 1450px) {
      width: 140px;
    }
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
  font-size: 18px !important;
  line-height: 24px !important;
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

const YourScoreBlock: React.FC = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { myEmperor, currentEmperor, maxBidIncrease, openingBib, finalDate, poisonDuration } = useEmperor()
  const { onRegister, onSteal, onStealAndPoison, onChangeStyle, onChangeColor } = useEmperorActions()
  const { onApproveXPefi } = useXPefiApprove()
  const xPefiContract = useXPefi()
  const [pendingTx, setPendingTx] = useState(false)
  const [maxAmount, setMaxAmount] = useState('')
  const currentEmperorBidAmount = (currentEmperor && currentEmperor.bidAmount) || 0
  const stealCrownTooltip = getStealCrownTooltip(myEmperor.lastPoisonedBy, myEmperor.timeLeftForPoison)
  const isMyEmperorPoisoned = Date.now() / 1000 < myEmperor.lastTimePoisoned + poisonDuration

  const fetchXPefiBalance = useCallback(async () => {
    const xPefiBalance = (await xPefiContract.methods.balanceOf(account).call()) / 1e18
    setMaxAmount(xPefiBalance.toString())
  }, [account, xPefiContract])

  useEffect(() => {
    fetchXPefiBalance()
  }, [fetchXPefiBalance])

  const getMyStatus = () => {
    if (account) {
      if (myEmperor.isRegistered) {
        if (myEmperor.address === currentEmperor.address) {
          return 'king'
        }
        return 'registered'
      }
      return 'not registered'
    }
    return 'not connected'
  }

  const myStatus = getMyStatus()

  const onRegisterPenguin = async (nickName, color, style) => {
    await onRegister(nickName, color, style)
  }

  const checkCanStealConfirm = () => {
    if (pendingTx) return false
    if (Number(finalDate) < Date.now() / 1000) return false
    if (isMyEmperorPoisoned) return false

    const amount = currentEmperor.address === NON_ADDRESS ? openingBib : currentEmperorBidAmount + maxBidIncrease
    if (amount > Number(maxAmount)) return false

    return true
  }

  const checkCanStealAndPoisonConfirm = () => {
    if (pendingTx) return false
    if (!myEmperor.canBePoisoned) return false
    if (Number(finalDate) < Date.now() / 1000) return false
    if (isMyEmperorPoisoned) return false

    return true
  }

  const onStealCrown = async () => {
    setPendingTx(true)
    try {
      const amount =
        currentEmperor.address === NON_ADDRESS
          ? new BigNumber(openingBib).toString()
          : new BigNumber(currentEmperorBidAmount).plus(new BigNumber(maxBidIncrease)).toString()
      const allowanceBalance = (await xPefiContract.methods.allowance(account, getEmperorAddress()).call()) / 1e18
      if (allowanceBalance === 0) {
        // call approve function
        await onApproveXPefi()
      }
      await onSteal(String(amount))
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  }

  const onStealCrownAndPoison = async () => {
    setPendingTx(true)
    try {
      const amount =
        currentEmperor.address === NON_ADDRESS
          ? new BigNumber(openingBib).toString()
          : new BigNumber(currentEmperorBidAmount).plus(new BigNumber(maxBidIncrease)).toString()
      const allowanceBalance = (await xPefiContract.methods.allowance(account, getEmperorAddress()).call()) / 1e18
      if (allowanceBalance === 0) {
        // call approve function
        await onApproveXPefi()
      }
      await onStealAndPoison(String(amount))
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  }

  const onChangeEmperorStyle = async (style: string) => {
    await onChangeStyle(style)
  }

  const onChangeEmperorColor = async (color: string) => {
    await onChangeColor(color)
  }

  const [onToggleRegister] = useModal(<RegisterModal onConfirm={onRegisterPenguin} />)

  // const [onToggleStealModal] = useModal(<StealCrownModal onConfirm={onStealCrown} />)

  const [onToggleCustomModal] = useModal(
    <CustomStyleModal onConfirmChangeStyle={onChangeEmperorStyle} onConfirmChangeColor={onChangeEmperorColor} />,
  )

  return (
    <CardBlock>
      <CardBlockContent>
        <CardBlockHeader>
          <TitleBgWrapper color={getPenguinColor(myEmperor)} account={account}>
            {account ? (
              <img
                src={`${process.env.PUBLIC_URL}/images/emperor/banner/your_penguin_banner.svg`}
                width="100%"
                height="120px"
                alt="blitz-title"
              />
            ) : (
              <SvgIcon
                src={
                  myStatus === 'registered' || myStatus === 'king'
                    ? `${process.env.PUBLIC_URL}/images/emperor/banner/your_penguin_banner.svg`
                    : `${process.env.PUBLIC_URL}/images/emperor/banner/your_score_banner_locked.svg`
                }
                width="100%"
                height="20px"
              />
            )}
          </TitleBgWrapper>
        </CardBlockHeader>
        <CardBlockBody account={account}>
          {myStatus === 'not connected' && (
            <WalletContainer>
              <Text bold color="secondary" fontSize="22px">
                {TranslateString(1074, 'Check your Rank')}
              </Text>
              <Text fontSize="14px">Connect wallet to view</Text>
              <UnlockButton />
            </WalletContainer>
          )}
          {myStatus === 'not registered' && (
            <RegisterContainer>
              <Text bold color="secondary" fontSize="16px">
                {TranslateString(1074, 'Start by styling your Penguin. Your crown awaits.')}
              </Text>
              <RegisterButtonContainer>
                <Button onClick={onToggleRegister}>{TranslateString(292, 'Register')}</Button>
              </RegisterButtonContainer>
            </RegisterContainer>
          )}

          {myStatus === 'registered' && (
            <RegisterContainer>
              <Text bold color="primary" fontSize="22px">
                {TranslateString(1074, myEmperor && badWordsFilter(myEmperor.nickname))}
              </Text>
              <Text bold color="secondary" fontSize="18px">
                {TranslateString(1074, 'You have been Emperor for:')}
              </Text>
              <Text bold color="primary" fontSize="18px">
                {`${myEmperor.timeAsEmperor} seconds`}
              </Text>
              <StealButtonContainer>
                <ButtonToolTipWrapper data-for="custom-class" data-tip={stealCrownTooltip}>
                  <Button
                    data-for="custom-class"
                    data-tip={stealCrownTooltip}
                    disabled={!checkCanStealConfirm()}
                    onClick={onStealCrown}
                    endIcon={<div>{` `}</div>}
                  >
                    {TranslateString(292, 'Steal Crown')}
                  </Button>
                </ButtonToolTipWrapper>
                {isMyEmperorPoisoned && (
                  <CustomToolTip
                    id="custom-class"
                    wrapper="div"
                    delayHide={0}
                    effect="solid"
                    multiline
                    place="bottom"
                    html
                  />
                )}
              </StealButtonContainer>
              {/* <StealAndPoisonButtonContainer>
                <ButtonToolTipWrapper data-for="custom-class-poison" data-tip={stealCrownTooltip}>
                  <Button
                    disabled={!checkCanStealAndPoisonConfirm()}
                    onClick={onStealCrownAndPoison}
                    endIcon={<div>{` `}</div>}
                  >
                    {TranslateString(292, 'Steal & Poison')}
                  </Button>
                </ButtonToolTipWrapper>
                {isMyEmperorPoisoned && (
                  <CustomToolTip
                    id="custom-class-poison"
                    wrapper="div"
                    delayHide={0}
                    effect="solid"
                    multiline
                    place="bottom"
                    html
                  />
                )}
              </StealAndPoisonButtonContainer> */}
              <CustomizeStyleButtonContainer>
                <Button onClick={onToggleCustomModal}>{TranslateString(292, 'Customize Penguin')}</Button>
              </CustomizeStyleButtonContainer>
            </RegisterContainer>
          )}

          {myStatus === 'king' && (
            <RegisterContainer>
              <Text bold color="secondary" fontSize="22px">
                {TranslateString(1074, myEmperor && badWordsFilter(myEmperor.nickname))}
              </Text>
              <Text bold color="secondary" fontSize="18px">
                {TranslateString(1074, 'You have been Emperor for:')}
              </Text>
              <Text bold color="primary" fontSize="22px">
                {`${myEmperor.timeAsEmperor} seconds`}
              </Text>
            </RegisterContainer>
          )}
        </CardBlockBody>
      </CardBlockContent>
    </CardBlock>
  )
}

export default YourScoreBlock
