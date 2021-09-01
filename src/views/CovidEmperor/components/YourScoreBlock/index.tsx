import React from 'react'
import styled from 'styled-components'
import { useModal } from 'penguinfinance-uikit2'
import useI18n from 'hooks/useI18n'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import SvgIcon from 'components/SvgIcon'
import { useDonations } from 'state/hooks'
import { usePenguin } from 'hooks/useContract'
import { getWithoutBordersAddress } from 'utils/addressHelpers'
import { badWordsFilter } from 'utils/address'
import { getBalanceNumber } from 'utils/formatBalance'
import { useCharityEmperorActions, usePefiApprove } from 'hooks/useEmperor'
import RegisterModal from './RegisterModal'
import DonateModal from './DonateModal'
import DonateTypeModal from './DonateTypeModal'
import CustomStyleModal from './CustomStyleModal'
import { getPenguinColor } from '../utils'
import { UnlockButton, Title, SubTitle, Caption, PGButton, CardBlockHeader, CardBlock } from '../UI'

const TitleBgWrapper = styled.div<{ color: string }>`
  z-index: -1;
  width: 100%;
  text-align: center;
  margin-top: 7%;
  position: absolute;

  svg {
    width: 300px;
  }

  transform: scale(1.3);
  @media (min-width: 640px) {
    transform: scale(1.5);
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    transform: scale(1.5);
  }
`

const CardBlockContent = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: 16px;
  padding: 16px;
  position: relative;
  text-align: center;

  margin-top: 25%;
  min-width: 120px;
  padding: 16px 8px 8px;
  @media (min-width: 640px) {
    width: 100%;
    margin-top: 25%;
    padding: 32px 16px 12px;
  }
  @media (min-width: 768px) {
    width: 100%;
    padding: 40px 20px 16px;
    margin-top: 22%;
  }
  @media (min-width: 1200px) {
    width: 100%;
    border-radius: 16px;
    padding: 40px 24px 16px;
    margin-top: 30%;
  }
  @media (min-width: 1450px) {
    min-width: 240px;
    padding: 40px 24px 16px;
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
    margin-top: 10px;
  }
`

const RegisterButtonContainer = styled.div`
  button {
    width: 200px;
    border-radius: 30px;
  }
`
const CustomizeStyleButtonContainer = styled.div`
  button {
    width: 200px;
    background: ${(props) => props.theme.colors.secondary};
    border-radius: 30px;
  }
`

const YourScoreBlock: React.FC = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { myDonor } = useDonations()
  const { onRegister, onChangeStyle, onChangeColor, onDonateAvax, onDonatePefi } = useCharityEmperorActions()
  const { onApprovePefi } = usePefiApprove()
  const pefiContract = usePenguin()
  const myAvaxDonation = getBalanceNumber(new BigNumber(myDonor.avaxDonations))
  const myPefiDonation = getBalanceNumber(new BigNumber(myDonor.pefiDonations))

  const getMyStatus = () => {
    if (account) {
      if (myDonor.isRegistered) {
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

  const onConfirmDonatePefi = async (amount: string) => {
    const allowanceBalance = (await pefiContract.methods.allowance(account, getWithoutBordersAddress()).call()) / 1e18
    if (allowanceBalance === 0) {
      // call approve function
      await onApprovePefi()
    }
    await onDonatePefi(amount)
  }

  const onConfirmDonateAvax = async (amount: string) => {
    await onDonateAvax(amount)
  }

  const onSelectDonateType = (type: string) => {
    if (type === 'pefi') {
      onToggleDonatePefiModal()
    }
    if (type === 'avax') {
      onToggleDonateAvaxModal()
    }
  }

  const onChangeEmperorStyle = async (style: string) => {
    await onChangeStyle(style)
  }

  const onChangeEmperorColor = async (color: string) => {
    await onChangeColor(color)
  }

  const [onToggleRegister] = useModal(<RegisterModal onConfirm={onRegisterPenguin} />)

  const [onToggleDonateTypeModal] = useModal(<DonateTypeModal onConfirm={onSelectDonateType} />)

  const [onToggleDonatePefiModal] = useModal(<DonateModal type="pefi" onConfirm={onConfirmDonatePefi} />)

  const [onToggleDonateAvaxModal] = useModal(<DonateModal type="avax" onConfirm={onConfirmDonateAvax} />)

  const [onToggleCustomModal] = useModal(
    <CustomStyleModal onConfirmChangeStyle={onChangeEmperorStyle} onConfirmChangeColor={onChangeEmperorColor} />,
  )

  return (
    <CardBlock>
      <CardBlockHeader>
        <TitleBgWrapper color={getPenguinColor(myDonor).code}>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/images/covid-emperor/banner/your_penguin.svg`}
            width="100%"
            height="20px"
          />
        </TitleBgWrapper>
      </CardBlockHeader>
      <CardBlockContent>
        {myStatus === 'not connected' && (
          <WalletContainer>
            <Title bold color="secondary">
              {TranslateString(1074, 'Check your Rank')}
            </Title>
            <Caption>Connect wallet to view</Caption>
            <UnlockButton />
          </WalletContainer>
        )}
        {myStatus === 'not registered' && (
          <RegisterContainer>
            <SubTitle bold color="secondary">
              {TranslateString(1074, 'You must register your penguin before donating')}
            </SubTitle>
            <RegisterButtonContainer>
              <PGButton onClick={onToggleRegister}>{TranslateString(292, 'Register')}</PGButton>
            </RegisterButtonContainer>
          </RegisterContainer>
        )}

        {myStatus === 'registered' && (
          <RegisterContainer>
            <Title bold color="secondary">
              {TranslateString(1074, myDonor && badWordsFilter(myDonor.nickname))}
            </Title>
            <SubTitle bold color="primaryBright">
              {TranslateString(1074, 'You have donated:')}
            </SubTitle>
            <SubTitle bold color="secondary">
              {`${myPefiDonation} PEFI (${myAvaxDonation} AVAX)`}
            </SubTitle>
            <RegisterButtonContainer>
              <PGButton colorType="primaryBright" onClick={onToggleDonateTypeModal} endIcon={<div>{` `}</div>}>
                {TranslateString(292, 'Donate')}
              </PGButton>
            </RegisterButtonContainer>
            <CustomizeStyleButtonContainer>
              <PGButton onClick={onToggleCustomModal}>{TranslateString(292, 'Customize Penguin')}</PGButton>
            </CustomizeStyleButtonContainer>
          </RegisterContainer>
        )}
      </CardBlockContent>
    </CardBlock>
  )
}

export default YourScoreBlock
