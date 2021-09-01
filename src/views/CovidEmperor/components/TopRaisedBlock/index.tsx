import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Flex } from 'penguinfinance-uikit2'
import BigNumber from 'bignumber.js'
import { useDonations } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import SvgIcon from 'components/SvgIcon'
import { getPenguinColor } from '../utils'
import { UnlockButton as Button, Caption, SubTitle, CardBlockHeader, CardBlock } from '../UI'

const TitleBgWrapper = styled.div<{ color: string }>`
  z-index: -1;
  width: 100%;
  text-align: center;
  position: absolute;
  margin-top: 10%;

  svg {
    #Banner-Avatar {
      path {
        fill: ${({ color }) => `#${color}`};
      }
    }
  }

  transform: scale(1.2);
  @media (min-width: 640px) {
    transform: scale(1.4);
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    transform: scale(1.4);
  }
`

const CardBlockContent = styled.div<{ account: string }>`
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  position: relative;
  text-align: center;
  margin-top: 20%;
  min-width: 120px;
  padding: 24px 8px 8px;
  @media (min-width: 640px) {
    width: 100%;
    margin-top: 28%;
    padding: 32px 16px 12px;
  }
  @media (min-width: 768px) {
    width: 100%;
    padding: 40px 20px 16px;
    margin-top: 32%;
  }
  @media (min-width: 1200px) {
    width: 100%;
    border-radius: 16px;
    padding: 48px 24px 16px;
    margin-top: 32%;
  }
  @media (min-width: 1450px) {
    min-width: 240px;
    padding: 40px 24px 16px;
    margin-top: 36%;
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    padding-top: 36px;
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

const UnlockButton = styled(Button)`
  @media (min-width: 1200px) {
    margin-top: -8px;
  }
`

const TopRaisedBlock: React.FC = () => {
  const { account } = useWeb3React()
  const donations = useDonations()

  const headerColor: string = getPenguinColor(donations.latestDonor).code
  const totalAvaxRaised = getBalanceNumber(new BigNumber(donations.totalAvaxRaised))
  const totalPefiRaised = getBalanceNumber(new BigNumber(donations.totalPefiRaised))
  const pefiBurnt = getBalanceNumber(new BigNumber(donations.totalPefiRaised * 0.25))

  return (
    <CardBlock>
      <CardBlockHeader>
        <TitleBgWrapper color={headerColor}>
          <SvgIcon
            src={`${process.env.PUBLIC_URL}/images/covid-emperor/banner/total_raised.svg`}
            width="100%"
            height="20px"
          />
        </TitleBgWrapper>
      </CardBlockHeader>
      <CardBlockContent account={account}>
        {!account && (
          <WalletContainer>
            <UnlockButton />
          </WalletContainer>
        )}
        {account && donations && (
          <EmperorInfoContainer>
            <Flex justifyContent="space-between">
              <SubTitle bold color="secondary">
                AVAX
              </SubTitle>
              <SubTitle bold color="primaryBright">
                {totalAvaxRaised.toFixed(!totalAvaxRaised || totalAvaxRaised > 1 ? 0 : 3)}
              </SubTitle>
            </Flex>
            <Flex justifyContent="space-between">
              <SubTitle bold color="secondary">
                PEFI
              </SubTitle>
              <SubTitle bold color="primaryBright">
                {totalPefiRaised.toFixed(!totalPefiRaised || totalPefiRaised > 1 ? 0 : 3)}
              </SubTitle>
            </Flex>
            <Flex justifyContent="space-between" mt="8px">
              <Caption bold color="secondary">
                PEFI Burnt
              </Caption>
              <Caption bold color="primaryBright">
                {pefiBurnt.toFixed(!pefiBurnt || pefiBurnt > 1 ? 0 : 3)}
              </Caption>
            </Flex>
          </EmperorInfoContainer>
        )}
      </CardBlockContent>
    </CardBlock>
  )
}

export default TopRaisedBlock
