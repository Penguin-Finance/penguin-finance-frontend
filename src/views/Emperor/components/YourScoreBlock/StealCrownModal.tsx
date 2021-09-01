import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Text, Flex, Link } from 'penguinfinance-uikit2'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { useXPefi } from 'hooks/useContract'
import { useEmperor } from 'state/hooks'

interface StealCrownModalProps {
  onConfirm: (amount: string) => void
  onDismiss?: () => void
}

const StealCrownModal: React.FC<StealCrownModalProps> = ({ onConfirm, onDismiss }) => {
  const [amount, setAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const xPefiContract = useXPefi()
  const { account } = useWeb3React()
  const { maxBidIncrease, minBidIncrease, currentEmperor } = useEmperor()
  const currentBidAmount = currentEmperor.bidAmount

  const fetchXPefiBalance = useCallback(async () => {
    const xPefiBalance = (await xPefiContract.methods.balanceOf(account).call()) / 1e18
    setMaxAmount(xPefiBalance.toString())
  }, [account, xPefiContract])

  useEffect(() => {
    fetchXPefiBalance()
  }, [fetchXPefiBalance])

  const onChangeAmount = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAmount(e.currentTarget.value)
    },
    [setAmount],
  )

  const handleSelectMax = useCallback(() => {
    setAmount(String(currentBidAmount + maxBidIncrease))
  }, [currentBidAmount, maxBidIncrease, setAmount])

  const checkCanConfirm = () => {
    if (pendingTx) return false
    if (amount.length === 0) return false
    if (Number(amount) > Number(maxAmount)) return false
    if (Number(amount) < Number(currentBidAmount) + Number(minBidIncrease)) return false
    return true
  }

  return (
    <Modal title={TranslateString(1068, 'Steal the Crown')} bodyPadding="0px" onDismiss={onDismiss}>
      <ModalContent>
        <ModalInput
          value={amount}
          onSelectMax={handleSelectMax}
          max={maxAmount}
          symbol="xPEFI"
          onChange={onChangeAmount}
          inputTitle={TranslateString(1070, 'Amount')}
          showError={false}
        />
        <BidInfoContainer>
          <Text bold color="secondary" fontSize="18px">
            You should bid with a bigger amount than the current emperor bid.
          </Text>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">Current emperor bid:</Text>
            <Text fontSize="14px" style={{ display: 'flex', alignItems: 'center' }}>
              {currentBidAmount}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">Min bid increase:</Text>
            <Text fontSize="14px" style={{ display: 'flex', alignItems: 'center' }}>
              {minBidIncrease}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">Max bid increase:</Text>
            <Text fontSize="14px" style={{ display: 'flex', alignItems: 'center' }}>
              {maxBidIncrease}
            </Text>
          </Flex>
        </BidInfoContainer>
        <ModalActions>
          <Button variant="primary" onClick={onDismiss} scale="md">
            {TranslateString(462, 'Cancel')}
          </Button>
          <ButtonGroupContainer>
            <Link fontSize="14px" bold={false} href="./nests" external color="failure">
              <Button variant="primary" onClick={onDismiss} scale="md">
                {TranslateString(462, 'Get xPEFI')}
              </Button>
            </Link>
            <Button
              scale="md"
              disabled={!checkCanConfirm()}
              onClick={async () => {
                setPendingTx(true)
                await onConfirm(amount)
                setPendingTx(false)
                onDismiss()
              }}
            >
              {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
            </Button>
          </ButtonGroupContainer>
        </ModalActions>
      </ModalContent>
    </Modal>
  )
}

// content
const ModalContent = styled.div`
  border-top: ${({ theme }) => (theme.isDark ? '1px solid #26183f' : '1px solid #e9eaeb')};
  padding: 24px 24px 16px;
`

const BidInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 0px 12px;
  max-width: 450px;
`

const ButtonGroupContainer = styled.div`
  display: flex;
  button {
    margin-right: 20px;
  }
  a:hover {
    text-decoration: none !important;
  }
`

export default StealCrownModal
