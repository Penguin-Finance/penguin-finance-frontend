import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Link } from 'penguinfinance-uikit2'
import useI18n from '../../../hooks/useI18n'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  showError?: boolean
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 16px;
  width: 100%;
  min-width: 420px;
  background: ${({ theme }) => (theme.isDark ? '#614e84' : '#ebe8f1')};
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 0 8px;
  padding: 0 8px;
  font-family: 'Poppins';
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#373566')};
  background: ${({ theme }) => (theme.isDark ? '#614e84' : '#ebe8f1')};
  box-shadow: none !important;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`

const StyledButton = styled(Button)`
  background: ${({ theme }) => (theme.isDark ? '#ffffff' : '#d2474e')};
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  showError = true,
}) => {
  const TranslateString = useI18n()
  const isBalanceZero = max === '0' || !max

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex alignItems="center" justifyContent="space-between">
          <StyledInput onChange={onChange} placeholder="0" value={value} />
          <StyledButton size="sm" onClick={onSelectMax} mr="8px">
            {TranslateString(452, 'Max')}
          </StyledButton>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && showError && (
        <StyledErrorMessage fontSize="14px" color="failure">
          No tokens to stake:{' '}
          <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
            {TranslateString(999, 'get')} {symbol}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  )
}

export default ModalInput
