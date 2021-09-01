import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Flex } from 'penguinfinance-uikit2'
import ModalActions from 'components/ModalActions'
import FieldInput from 'components/FieldInput'
import useI18n from 'hooks/useI18n'
import PenguinSelect from '../UI/PenguinSelect/PenguinSelect'
import { penguinImages } from '../utils'

// content
const ModalContent = styled.div`
  border-top: ${({ theme }) => (theme.isDark ? '1px solid #26183f' : '1px solid #e9eaeb')};
  padding: 24px 24px 16px;
`

const PenguinSelectContainer = styled.div`
  padding: 8px 24px 0;
`

interface RegisterModalProps {
  onConfirm: (nickName: string, color: string, style: string) => void
  onDismiss?: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onConfirm, onDismiss }) => {
  const [nickName, setNickName] = useState('')
  const [color, setColor] = useState('')
  const [style, setStyle] = useState('')

  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()

  const onChangeNickName = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setNickName(e.currentTarget.value)
    },
    [setNickName],
  )

  const onChangeColor = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setColor(e.currentTarget.value)
    },
    [setColor],
  )

  return (
    <Modal title={TranslateString(1068, 'Register your penguin')} bodyPadding="0px" onDismiss={onDismiss}>
      <ModalContent>
        <FieldInput
          value={nickName}
          placeholder="Cubiz"
          onChange={onChangeNickName}
          inputTitle={TranslateString(1070, 'Nickname')}
        />
        <FieldInput
          value={color}
          placeholder="Red"
          onChange={onChangeColor}
          inputTitle={TranslateString(1070, 'Color')}
        />
        <PenguinSelectContainer>
          <PenguinSelect
            value={style}
            placeholder="Select your penguin"
            options={penguinImages.map((penguin) => ({
              label: penguin.name,
              value: penguin.id,
            }))}
            onChange={setStyle}
          />
        </PenguinSelectContainer>
        <ModalActions>
          <Flex justifyContent="space-between" pl="24px" pr="24px">
            <Button variant="primary" onClick={onDismiss} scale="md">
              {TranslateString(462, 'Cancel')}
            </Button>
            <Button
              scale="md"
              disabled={pendingTx || nickName.length === 0 || color.length === 0 || style.length === 0}
              onClick={async () => {
                setPendingTx(true)
                await onConfirm(nickName, color, style)
                setPendingTx(false)
                onDismiss()
              }}
            >
              {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
            </Button>
          </Flex>
        </ModalActions>
      </ModalContent>
    </Modal>
  )
}

export default RegisterModal
