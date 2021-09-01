import styled from 'styled-components'
import { Text, Button as NormalButton } from 'penguinfinance-uikit2'
import Button from 'components/UnlockButton'

export const CardBlock = styled.div`
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media (min-width: 1200px) and (max-height: 800px) {
    width: 70%;
    margin-left: 15%;
  }
`

export const CardBlockHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 1;
  padding: 16px;
  width: 100%;
`

export const UnlockButton = styled(Button)`
  font-size: 10px;
  padding: 0 8px;
  height: 28px;
  @media (min-width: 640px) {
    font-size: 12px;
    padding: 0 12px;
    height: 36px;
  }
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 0 24px;
    height: 48px;
  }
  @media (min-width: 1200px) {
    font-size: 16px;
    padding: 0 24px;
    height: 48px;
  }
`

export const PGButton = styled(NormalButton)<{ colorType?: string }>`
  font-size: 10px;
  padding: 0 8px;
  height: 28px;
  width: 100% !important;
  background: ${(props) => (props.colorType ? props.theme.colors.primaryBright : props.theme.colors.primary)};
  @media (min-width: 640px) {
    font-size: 12px;
    padding: 0 12px;
    height: 36px;
  }
  @media (min-width: 768px) {
    font-size: 14px;
    padding: 0 24px;
    height: 48px;
  }
  @media (min-width: 1200px) {
    font-size: 16px;
    padding: 0 24px;
    height: 48px;
  }
`

export const Title = styled(Text)`
  font-size: 14px;
  line-height: 1.2;
  @media (min-width: 640px) {
    font-size: 16px;
    line-height: 1.2;
  }
  @media (min-width: 768px) {
    font-size: 18px;
    line-height: 1.4;
  }
  @media (min-width: 1200px) {
    font-size: 22px;
    line-height: 1.5;
  }
`

export const SubTitle = styled(Text)`
  font-size: 12px;
  @media (min-width: 640px) {
    font-size: 14px;
  }
  @media (min-width: 768px) {
    font-size: 16px;
  }
  @media (min-width: 1200px) {
    font-size: 18px;
  }
`

export const Caption = styled(Text)`
  font-size: 10px;
  @media (min-width: 640px) {
    font-size: 12px;
  }
  @media (min-width: 768px) {
    font-size: 12px;
  }
  @media (min-width: 1200px) {
    font-size: 14px;
  }
`
