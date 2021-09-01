import React, { useCallback, useState } from 'react'
import { Button, Modal } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import FieldInput from 'components/FieldInput'
import useI18n from 'hooks/useI18n'
import PenguinSelect from '../UI/PenguinSelect/PenguinSelect'
import { penguinImages } from '../utils'

interface CustomStyleModalProps {
  onConfirmChangeStyle: (color: string) => void
  onConfirmChangeColor: (style: string) => void
  onDismiss?: () => void
}

// content
const ModalContent = styled.div`
  border-top: ${({ theme }) => (theme.isDark ? '1px solid #26183f' : '1px solid #e9eaeb')};
  padding: 24px 24px 16px;
`

const ButtonContainer = styled.div`
  padding: 0px 16px;
  margin-bottom: 20px;
  button {
    max-width: 200px;
    margin: 0px 8px;
  }
`

const PenguinSelectContainer = styled.div`
  padding: 0 24px;
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

  const onChangeColor = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setColor(e.currentTarget.value)
    },
    [setColor],
  )

  return (
    <Modal title={TranslateString(1068, 'Customize your penguin')} bodyPadding="0px" onDismiss={onDismiss}>
      <ModalContent>
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
      </ModalContent>
    </Modal>
  )
}

export default CustomStyleModal
