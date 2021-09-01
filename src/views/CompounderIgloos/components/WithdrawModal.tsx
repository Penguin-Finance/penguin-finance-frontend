import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Flex, Heading, Text } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import ModalActions from 'components/compounder/ModalActions'
import ModalInput from 'components/compounder/ModalInput'
import useI18n from 'hooks/useI18n'
import { useCompounderFarmUser } from 'state/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { Farm } from 'state/types'

interface WithdrawModalProps {
  max: BigNumber
  tokenName?: string
  farm: Farm
  onConfirm: (amount: string) => void
  onDismiss?: () => void
}

// header
const ModalHeader = styled.div`
  padding: 24px;
  font-weight: 600;
  margin-top: -22px;
`

// content
const ModalContent = styled.div`
  border-top: ${({ theme }) => (theme.isDark ? '1px solid #26183f' : '1px solid #e9eaeb')};
  padding: 24px 24px 16px;
`

const StyledFlex = styled(Flex)`
  margin-bottom: 16px;
  white-space: pre;
`
const BalanceInfoWrapper = styled(Flex)`
  > div:first-child {
    font-weight: 500;
    color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#373566')};
  }
  > div:last-child {
    font-weight: 400;
    color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#373566')};
  }
`
const StakeInfoWrapper = styled(Flex)`
  > div:first-child {
    color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#373566')};
    font-weight: 500;
  }
  > div:last-child {
    font-weight: 400;
    color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#373566')};
  }
`
const StyledButton = styled(Button)`
  background: ${({ theme }) => (theme.isDark ? '#ffffff' : '#d2474e')};
  color: ${({ theme }) => (theme.isDark ? '#30264f' : '#ffffff')};
  font-weight: 400;
  border-bottom: ${({ theme }) => (theme.isDark ? '3px solid #614284' : '3px solid #b73e4a')};
`

// footer
const ModalFooter = styled.div`
  border-top: ${({ theme }) => (theme.isDark ? '1px solid #26183f' : '1px solid#e9eaeb')};
`

const ModalHelper = styled.div`
  padding: 16px 24px;
  max-width: 470px;
  color: ${({ theme }) => (theme.isDark ? '#614e84' : '#373566')};
  line-height: 20px;
  font-weight: 400;
`

const WithdrawModal: React.FC<WithdrawModalProps> = ({ max, tokenName = '', farm, onConfirm, onDismiss }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()

  const { stakedReceiptBalance } = useCompounderFarmUser(farm.lpSymbol, farm.type)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const _stakedBalance = useMemo(() => {
    return String(getBalanceNumber(stakedReceiptBalance))
  }, [stakedReceiptBalance])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(_stakedBalance)
  }, [_stakedBalance, setVal])

  const displayBalance = !fullBalance ? '0' : parseFloat(fullBalance).toFixed(4)
  const displayStakedBalance = !stakedReceiptBalance
    ? '0'
    : parseFloat(getFullDisplayBalance(stakedReceiptBalance)).toFixed(4)

  return (
    <Modal title="" hideCloseButton bodyPadding="0px" onDismiss={onDismiss}>
      <ModalHeader>
        <Heading>{TranslateString(1068, `Withdraw ${tokenName}`)}</Heading>
      </ModalHeader>
      <ModalContent>
        <StyledFlex justifyContent="space-between">
          <BalanceInfoWrapper>
            <Text>{`Wallet Balance: `}</Text>
            <Text>{displayBalance}</Text>
          </BalanceInfoWrapper>
          <StakeInfoWrapper>
            <Text>{`Your Stake: `}</Text>
            <Text>{displayStakedBalance}</Text>
          </StakeInfoWrapper>
        </StyledFlex>
        <ModalInput
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          value={val}
          max={_stakedBalance}
          symbol={tokenName}
        />
        <ModalActions>
          <StyledButton variant="secondary" onClick={onDismiss} scale="md">
            {TranslateString(462, 'Cancel')}
          </StyledButton>
          <StyledButton
            disabled={pendingTx}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              setPendingTx(false)
              onDismiss()
            }}
            scale="md"
          >
            {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
          </StyledButton>
        </ModalActions>
      </ModalContent>
      {farm.type === 'Penguin' && (
        <ModalFooter>
          <ModalHelper>
            {`Note: There is a ${farm.withdrawalFee}% withdrawal fee on this farm. When auto-compounding Igloos, 50% of rewards are sent to nest.`}
          </ModalHelper>
        </ModalFooter>
      )}
    </Modal>
  )
}

export default WithdrawModal
