import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import FieldInput from 'components/FieldInput'
import useI18n from 'hooks/useI18n'

interface CustomStyleModalProps {
  onConfirmChangeStyle: (color: string) => void
  onConfirmChangeColor: (style: string) => void
  onDismiss?: () => void
}

const ButtonContainer = styled.div`
  padding: 0px 16px;
  margin-bottom: 20px;
  button {
    max-width: 200px;
    margin: 0px 8px;
  }
`

const CustomStyleModal: React.FC<CustomStyleModalProps> = ({
  onConfirmChangeStyle,
  onConfirmChangeColor,
  onDismiss,
}) => {
  const [color, setColor] = useState('')
  const [style, setStyle] = useState('')

  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()

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
    <Modal title={TranslateString(1068, 'Customize your penguin')} onDismiss={onDismiss}>
      <FieldInput
        value={color}
        placeholder="Red"
        onChange={onChangeColor}
        inputTitle={TranslateString(1070, 'Color')}
      />
      <ButtonContainer>
        <Button
          scale="md"
          disabled={pendingTx || color.length === 0}
          onClick={async () => {
            setPendingTx(true)
            await onConfirmChangeColor(color)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm Change')}
        </Button>
      </ButtonContainer>
      <FieldInput
        value={style}
        placeholder="1, 2, 3, 4"
        onChange={onChangeStyle}
        inputTitle={TranslateString(1070, 'Style')}
      />
      <ButtonContainer>
        <Button
          scale="md"
          disabled={pendingTx || style.length === 0}
          onClick={async () => {
            setPendingTx(true)
            await onConfirmChangeStyle(style)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm Change')}
        </Button>
      </ButtonContainer>
    </Modal>
  )
}

export default CustomStyleModal
