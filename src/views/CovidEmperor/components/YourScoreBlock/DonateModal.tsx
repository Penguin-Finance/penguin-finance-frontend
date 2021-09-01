import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Text, Flex, Link } from 'penguinfinance-uikit2'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import useI18n from 'hooks/useI18n'
import { usePenguin } from 'hooks/useContract'
import { useDonations } from 'state/hooks'
import { getWeb3 } from 'utils/web3'

interface DonateModalProps {
  type?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
}

const DonateModal: React.FC<DonateModalProps> = ({ type, onConfirm, onDismiss }) => {
  const [amount, setAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const pefiContract = usePenguin()
  const { account } = useWeb3React()
  const { minDonationAvax, minDonationPefi } = useDonations()
  const web3 = getWeb3()

  const fetchPefiBalance = useCallback(async () => {
    const pefiBalance = (await pefiContract.methods.balanceOf(account).call()) / 1e18
    setMaxAmount(pefiBalance.toString())
  }, [account, pefiContract])

  const fetchAvaxBalance = useCallback(async () => {
    const _avaxAmount = await web3.eth.getBalance(account)
    setMaxAmount(web3.utils.fromWei(_avaxAmount, 'ether'))
  }, [account, web3])

  useEffect(() => {
    if (type === 'pefi') fetchPefiBalance()
    if (type === 'avax') fetchAvaxBalance()
  }, [type, fetchPefiBalance, fetchAvaxBalance])

  const onChangeAmount = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAmount(e.currentTarget.value)
    },
    [setAmount],
  )

  const handleSelectMax = useCallback(() => {
    setAmount(String(maxAmount))
  }, [maxAmount, setAmount])

  const checkCanConfirm = () => {
    if (pendingTx) return false
    if (amount.length === 0) return false
    if (Number(amount) > Number(maxAmount)) return false
    if (type === 'pefi' && Number(amount) < Number(minDonationPefi)) return false
    if (type === 'avax' && Number(amount) < Number(minDonationAvax)) return false
    return true
  }

  return (
    <Modal title={TranslateString(1068, `Donate ${type === 'pefi' ? 'PEFI' : 'AVAX'}`)} onDismiss={onDismiss}>
      <ModalInput
        value={amount}
        onSelectMax={handleSelectMax}
        max={maxAmount}
        symbol={type === 'pefi' ? 'PEFI' : 'AVAX'}
        onChange={onChangeAmount}
        inputTitle={TranslateString(1070, 'Amount')}
        showError={false}
      />
      <BidInfoContainer>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="14px">Min donation increase:</Text>
          <Text fontSize="14px" style={{ display: 'flex', alignItems: 'center' }}>
            {type === 'pefi' && minDonationPefi}
            {type === 'avax' && minDonationAvax}
          </Text>
        </Flex>
      </BidInfoContainer>
      <ModalActions>
        <Button variant="primary" onClick={onDismiss} scale="md">
          {TranslateString(462, 'Cancel')}
        </Button>
        <ButtonGroupContainer>
          <Link fontSize="14px" bold={false} href="./nests" external color="failure">
            <Button variant="primary" disabled onClick={onDismiss} scale="md">
              {TranslateString(462, 'Learn more')}
            </Button>
          </Link>
          <Button
            scale="md"
            disabled={!checkCanConfirm()}
            onClick={async () => {
              if (!checkCanConfirm()) return
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
    </Modal>
  )
}

const BidInfoContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  margin-top: 10px;
  padding: 0px 12px;
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

export default DonateModal
