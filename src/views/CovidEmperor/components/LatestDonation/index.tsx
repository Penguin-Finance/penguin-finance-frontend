import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from 'penguinfinance-uikit2'
import useI18n from 'hooks/useI18n'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useDonations } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import SvgIcon from 'components/SvgIcon'
import { UnlockButton as Button, Title, Caption, CardBlockHeader, CardBlock as Block } from '../UI'
import { getPenguinColor, getKingPenguin, getNormalPenguin } from '../utils'

const CardBlock = styled(Block)`
  margin-top: -100px;

  @media (min-width: 1200px) and (max-height: 800px) {
    margin-top: -120px;
  }
`

const TitleBgWrapper = styled.div<{ color: string }>`
  z-index: -1;
  width: 100%;
  text-align: center;
  position: absolute;
  margin-top: -10%;

  svg {
    #Banner-Avatar {
      path {
        fill: ${({ color }) => `#${color}`};
      }
    }
  }

  transform: scale(2.2);
  @media (min-width: 640px) {
    transform: scale(2);
  }
  @media (min-width: 768px) {
    transform: scale(2);
  }
  @media (min-width: 1200px) {
    transform: scale(2);
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    transform: scale(2.3);
  }
`

const CardBlockContent = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  padding: 24px;
  padding-bottom: 16px;
  position: relative;
  text-align: center;
  margin-top: 25%;
  min-width: 150px;
  padding: 16px 8px 8px;
  @media (min-width: 640px) {
    width: 100%;
    margin-top: 25%;
    padding: 24px 16px 12px;
  }
  @media (min-width: 768px) {
    width: 100%;
    border-radius: 8px;
    margin-top: 25%;
    padding: 24px 20px 16px;
  }
  @media (min-width: 1200px) {
    width: 100%;
    margin-top: 25%;
    padding: 28px 24px 16px;
  }
  @media (min-width: 1450px) {
    min-width: 240px;
    padding: 24px 24px 16px;
    margin-top: 26%;
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    padding: 28px 24px 16px;
  }
`

const WalletContainer = styled.div`
  position: relative;
  z-index: 10;
`

const EmperorInfoContainer = styled.div`
  position: relative;
  z-index: 10;
`

const KingPenguinImageWrapper = styled.div<{ penguin: string; color: string }>`
  z-index: -1;
  position: absolute;
  width: 12.5%;
  left: 44%;
  bottom: 33%;
  svg {
    ${({ penguin, color }) => `.${penguin}-st0 {
          fill: #${color};
        }`}
  }
`

const MyPenguinImageWrapper = styled.div<{ penguin: string; color: string }>`
  position: absolute;
  width: 9.5%;
  right: 26%;
  bottom: 17%;
  &:hover {
    z-index: 11;
  }

  svg {
    transform: scaleX(-1);
    ${({ penguin, color }) => `.${penguin}-st0 {
          fill: #${color};
        }`}
  }
`

const DonationText = styled(Caption)`
  white-space: nowrap;
  @media (min-width: 768px) {
    margin-right: 4px;
  }
`

const Donations = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .exclamation {
    display: none;
  }
  @media (min-width: 640px) {
    flex-direction: column;
    .exclamation {
      display: none;
    }
  }
  @media (min-width: 1200px) {
    flex-direction: row;
    .exclamation {
      display: inline;
    }
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    flex-direction: column;
    .exclamation {
      display: none;
    }
  }
`

const UnlockButton = styled(Button)`
  margin-top: 4px;
  @media (min-width: 640px) {
    margin-top: 4px;
  }
  @media (min-width: 768px) {
    margin-top: 16px;
  }
  @media (min-width: 1200px) {
    margin-top: 8px;
  }
`

const LatestDonation: React.FC = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { myDonor, latestDonor } = useDonations()
  const lastDonorPenguin = getKingPenguin(latestDonor)
  const myDonorPenguin = getNormalPenguin(myDonor)
  const avaxDonations = getBalanceNumber(new BigNumber(latestDonor.avaxDonations))

  return (
    <CardBlock>
      <CardBlockHeader>
        <TitleBgWrapper color={getPenguinColor(latestDonor)}>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/images/covid-emperor/banner/penguin_without_borders.svg`}
            width="100%"
            height="20px"
          />
        </TitleBgWrapper>
      </CardBlockHeader>
      <CardBlockContent>
        {!account && (
          <WalletContainer>
            <UnlockButton />
          </WalletContainer>
        )}
        {account && (
          <EmperorInfoContainer>
            <Title bold color="primaryBright">
              {TranslateString(1074, latestDonor.latestDonorName)}
            </Title>
            {avaxDonations > 0 ? (
              <Donations>
                <DonationText bold color="secondary">
                  Thank you for donating
                </DonationText>
                <DonationText bold color="primaryBright" fontSize="14px">
                  {avaxDonations.toFixed(avaxDonations > 1 ? 0 : 3)} AVAX
                </DonationText>
                <Text className="exclamation" bold color="secondary" fontSize="16px" lineHeight={1.2}>
                  !
                </Text>
              </Donations>
            ) : (
              <DonationText bold color="secondary">
                Thank you for donating
              </DonationText>
            )}
          </EmperorInfoContainer>
        )}
      </CardBlockContent>
      {latestDonor.address && (
        <KingPenguinImageWrapper penguin={`${lastDonorPenguin}`} color={getPenguinColor(latestDonor)}>
          <SvgIcon
            src={
              latestDonor.style === '3'
                ? `${process.env.PUBLIC_URL}/images/covid-emperor/penguins/penguin_surgeon_crown_main.svg`
                : `${process.env.PUBLIC_URL}/images/covid-emperor/penguins/${lastDonorPenguin}.svg`
            }
            width="100%"
            height="20px"
          />
        </KingPenguinImageWrapper>
      )}
      {latestDonor.address && latestDonor.address !== account && myDonor.isRegistered && (
        <MyPenguinImageWrapper penguin={`${myDonorPenguin}`} color={getPenguinColor(myDonor)}>
          <SvgIcon
            src={
              myDonor.style === '3'
                ? `${process.env.PUBLIC_URL}/images/covid-emperor/penguins/penguin_surgeon_no_crown_main.svg`
                : `${process.env.PUBLIC_URL}/images/covid-emperor/penguins/${myDonorPenguin}.svg`
            }
            width="100%"
            height="20px"
          />
        </MyPenguinImageWrapper>
      )}
    </CardBlock>
  )
}

export default LatestDonation
