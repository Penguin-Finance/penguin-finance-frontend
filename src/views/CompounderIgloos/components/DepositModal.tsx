import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Text, LinkExternal, Flex, Heading } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import ModalActions from 'components/compounder/ModalActions'
import ModalInput from 'components/compounder/ModalInput'
import useI18n from 'hooks/useI18n'
import { useCompounderFarmUser } from 'state/hooks'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { Farm } from 'state/types'

interface DepositModalProps {
  max: BigNumber
  tokenName?: string
  addLiquidityUrl?: string
  farm: Farm
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  onApprove: () => void
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

const StyledLinkExternal = styled(LinkExternal)`
  color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#d2474e')};
  font-weight: 800;
  margin: auto;
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

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  tokenName = '',
  addLiquidityUrl,
  farm,
  onConfirm,
  onDismiss,
  onApprove,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { allowance, stakedReceiptBalance } = useCompounderFarmUser(farm.lpSymbol, farm.type)
  const isApproved = allowance && allowance.isGreaterThan(0)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleApprove = async () => {
    setRequestedApproval(true)
    try {
      await onApprove()
      setRequestedApproval(false)
    } catch (error) {
      setRequestedApproval(false)
    }
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const displayBalance = !fullBalance ? '0' : parseFloat(fullBalance).toFixed(4)
  const displayStakedBalance = !stakedReceiptBalance
    ? '0'
    : parseFloat(getFullDisplayBalance(stakedReceiptBalance)).toFixed(4)

  return (
    <Modal title="" hideCloseButton bodyPadding="0px" onDismiss={onDismiss}>
      <ModalHeader>
        <Heading>{TranslateString(1068, `Deposit ${tokenName}`)}</Heading>
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
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
          addLiquidityUrl={addLiquidityUrl}
        />
        <ModalActions>
          <StyledButton variant="primary" onClick={onDismiss} scale="md">
            {TranslateString(462, 'Cancel')}
          </StyledButton>
          {isApproved ? (
            <StyledButton
              scale="md"
              disabled={pendingTx || fullBalance === '0' || val === '0'}
              onClick={async () => {
                setPendingTx(true)
                await onConfirm(val)
                setPendingTx(false)
                onDismiss()
              }}
            >
              {pendingTx ? TranslateString(488, 'Pending Compounding') : TranslateString(464, 'Compound')}
            </StyledButton>
          ) : (
            <StyledButton scale="md" disabled={requestedApproval} onClick={handleApprove}>
              {requestedApproval
                ? TranslateString(488, 'Transaction Pending')
                : TranslateString(464, 'Approve Contract')}
            </StyledButton>
          )}
        </ModalActions>
        <StyledLinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
          {TranslateString(999, 'Get')} {tokenName}
        </StyledLinkExternal>
      </ModalContent>
      {farm.type === 'Penguin' && (
        <ModalFooter>
          <ModalHelper>
            {`Note: There is a ${farm.withdrawalFee}% withdrawal fee on this farm. When auto-compounding Igloos, 50% of rewards are sent to your Nest (xPEFI).`}
          </ModalHelper>
        </ModalFooter>
      )}
    </Modal>
  )
}

export default DepositModal
