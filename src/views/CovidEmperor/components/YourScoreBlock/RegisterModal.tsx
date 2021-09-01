import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'penguinfinance-uikit2'
import ModalActions from 'components/ModalActions'
import FieldInput from 'components/FieldInput'
import useI18n from 'hooks/useI18n'

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

  const onChangeStyle = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setStyle(e.currentTarget.value)
    },
    [setStyle],
  )

  const onChangeColor = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setColor(e.currentTarget.value)
    },
    [setColor],
  )

  return (
    <Modal title={TranslateString(1068, 'Register your penguin')} onDismiss={onDismiss}>
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
      <FieldInput
        value={style}
        placeholder="1, 2, 3, 4"
        onChange={onChangeStyle}
        inputTitle={TranslateString(1070, 'Style')}
      />
      <ModalActions>
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
      </ModalActions>
    </Modal>
  )
}

export default RegisterModal
