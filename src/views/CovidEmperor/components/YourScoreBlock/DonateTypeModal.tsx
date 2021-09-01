import React from 'react'
import { Modal, Button } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'

interface DonateTypeModalProps {
  onConfirm: (type: string) => void
  onDismiss?: () => void
}

const DonateTypeModal: React.FC<DonateTypeModalProps> = ({ onConfirm, onDismiss }) => {
  const TranslateString = useI18n()

  return (
    <Modal title={TranslateString(1068, `In which currency would you like to donate?`)} onDismiss={onDismiss}>
      <DonateButtonContainer>
        <DonateTypeButton
          colorType="primaryBright"
          onClick={() => {
            onDismiss()
            onConfirm('avax')
          }}
          endIcon={<div>{` `}</div>}
        >
          {TranslateString(292, 'Donate AVAX')}
        </DonateTypeButton>
      </DonateButtonContainer>
      <DonateButtonContainer>
        <DonateTypeButton
          colorType="primaryBright"
          onClick={() => {
            onDismiss()
            onConfirm('pefi')
          }}
          endIcon={<div>{` `}</div>}
        >
          {TranslateString(292, 'Donate PEFI')}
        </DonateTypeButton>
      </DonateButtonContainer>
    </Modal>
  )
}

const DonateButtonContainer = styled.div`
  margin-bottom: 20px;
`

const DonateTypeButton = styled(Button)`
  font-size: 16px;
  padding: 0 24px;
  height: 48px;
  width: 100%;
  color: ${(props) => props.theme.colors.primaryBright};
  background: ${(props) => props.theme.colors.backgroundDisabled};
  box-shadow: none;
  justify-content: start;
`

export default DonateTypeModal
