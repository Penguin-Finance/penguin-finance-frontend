import React from 'react'
import styled from 'styled-components'
import { Text } from 'penguinfinance-uikit2'
import { useWeb3React } from '@web3-react/core'
import { useEmperor } from 'state/hooks'
import { getShortenNickName, formatTime, badWordsFilter } from 'utils/address'
import SvgIcon from 'components/SvgIcon'
import { getPenguinColor } from '../utils'
import { UnlockButton as Button, CardBlockHeader, CardBlock } from '../UI'

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
  position: absolute;
  margin-top: ${(props) => (props.account ? 0 : '-30%')};

  svg {
    #Banner-Avatar {
      path {
        fill: ${({ color }) => `#${color}`};
      }
    }
  }

  transform: ${(props) => props.account && 'scale(1.2)'};
  @media (min-width: 640px) {
    transform: ${(props) => props.account && 'scale(1.4)'};
    margin-top: ${(props) => (props.account ? '10%' : '-30%')};
  }
  @media (min-width: 768px) {
    margin-top: ${(props) => (props.account ? '10%' : '-20%')};
  }
  @media (min-width: 1200px) and (max-height: 800px) {
    transform: ${(props) => props.account && 'scale(1.4)'};
  }
  @media (min-width: 1450px) and (max-height: 800px) {
    img {
      margin-left: 8%;
    }
  }
`

const CardBlockBody = styled.div<{ account: string }>`
  background: ${(props) => props.theme.card.background};
  border-radius: 8px;
  position: relative;
  text-align: center;
  margin-top: 20%;
  min-width: 180px;
  padding: 44px 8px 8px;
  padding-top: ${(props) => !props.account && '32px'};
  @media (min-width: 640px) {
    width: 100%;
    margin-top: 28%;
    padding: 64px 16px 12px;
    padding-top: ${(props) => !props.account && '40px'};
  }
  @media (min-width: 768px) {
    width: 100%;
    padding: 56px 20px 16px;
    padding-top: ${(props) => !props.account && '40px'};
    margin-top: 32%;
  }
  @media (min-width: 1200px) {
    width: 100%;
    border-radius: 16px;
    padding: 52px 24px 16px;
    padding-top: ${(props) => !props.account && '48px'};
    margin-top: 32%;
  }
  @media (min-width: 1450px) {
    min-width: 240px;
    padding: 44px 24px 16px;
    padding-top: ${(props) => !props.account && '40px'};
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

const EmperorRow = styled.div`
  padding: 6px 0px;
  border-top: 1px solid #42bcf5;
  display: flex;
  min-height: 44px;
  &:last-child {
    border-bottom: none;
  }
  /* position: relative;
  margin-top: -38px;
  text-align:center; */
`

const NumberField = styled.div`
  width: 10%;
  margin-right: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
`

const TimeField = styled.div`
  width: 35%;
  padding-right: 10px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  > div {
    margin-right: 5px;
  }
`

const AddressField = styled.div`
  width: 35%;
  padding-right: 10px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;

  @media only screen and (min-width: 1200px) and (max-width: 1450px) {
    width: 30%;
  }
`

const AvatarField = styled.div<{ color: string }>`
  width: 20%;
  overflow: hidden;
  align-items: center;
  display: flex;
  justify-content: center;
  svg {
    #Color_1_default {
      path {
        fill: ${({ color }) => `#${color}`};
      }
    }
  }
  @media only screen and (min-width: 1200px) and (max-width: 1450px) {
    width: 30px;
    min-width: 30px;
  }
`

const UnlockButton = styled(Button)`
  @media (min-width: 1200px) {
    margin-top: -8px;
  }
`

const TopPenguinsBlock: React.FC = () => {
  const { account } = useWeb3React()
  const { currentEmperor, topEmperors } = useEmperor()
  const _topEmperors = topEmperors.map((row, index) => {
    return { id: index, ...row }
  })

  const headerColor: string =
    topEmperors.length > 0 ? getPenguinColor(topEmperors[0]).code : getPenguinColor(currentEmperor).code

  return (
    <CardBlock>
      <CardBlockContent>
        <CardBlockHeader>
          <TitleBgWrapper color={headerColor} account={account}>
            {account ? (
              <img
                src={`${process.env.PUBLIC_URL}/images/emperor/banner/top_penguins_banner.svg`}
                width="100%"
                height="120px"
                alt="blitz-title"
              />
            ) : (
              <SvgIcon
                src={`${process.env.PUBLIC_URL}/images/emperor/banner/top_penguins_banner_locked.svg`}
                width="100%"
                height="20px"
              />
            )}
          </TitleBgWrapper>
        </CardBlockHeader>
        <CardBlockBody account={account}>
          {!account && (
            <WalletContainer>
              <UnlockButton />
            </WalletContainer>
          )}
          {account && topEmperors && (
            <EmperorInfoContainer>
              {_topEmperors.map((topEmperor, index) => {
                return (
                  <EmperorRow key={topEmperor.id}>
                    <NumberField>
                      <Text color="secondary" fontSize="12px">
                        {`#${index + 1}`}
                      </Text>
                    </NumberField>
                    <TimeField>
                      <Text color="secondary" fontSize="12px">
                        {formatTime(topEmperor.timeAsEmperor)}
                      </Text>
                      <Text color="secondary" fontSize="12px">
                        min
                      </Text>
                    </TimeField>
                    <AddressField>
                      <Text color="secondary" fontSize="12px">
                        {getShortenNickName(badWordsFilter(topEmperor.nickname))}
                      </Text>
                    </AddressField>
                    <AvatarField color={getPenguinColor(topEmperor)}>
                      <SvgIcon
                        src={`${process.env.PUBLIC_URL}/images/emperor/penguin_red.svg`}
                        width="30px"
                        height="30px"
                      />
                    </AvatarField>
                  </EmperorRow>
                )
              })}
            </EmperorInfoContainer>
          )}
        </CardBlockBody>
      </CardBlockContent>
    </CardBlock>
  )
}

export default TopPenguinsBlock
