import React from 'react'
import { Button, Modal, Flex, Text } from 'penguinfinance-uikit2'
import styled from 'styled-components';
import useI18n from 'hooks/useI18n'

interface PenaltyConfirmModalProps {
  onConfirm: () => void
  onDismiss?: () => void,
  handsOnPenalty?: number 
}

const Container = styled.div`
  max-width: 320px;
`;

const PenaltyConfirmModal: React.FC<PenaltyConfirmModalProps> = ({
  handsOnPenalty,
  onConfirm,
  onDismiss,
}) => {
  const TranslateString = useI18n()

  return (
    <Modal bodyPadding='8px 24px 24px' title={TranslateString(1068, 'Paper Hands Penalty')} onDismiss={onDismiss}>
      <Container>
        <Text>{`The current paper hands penalty is ${Number(handsOnPenalty).toFixed(2)}%. The withdrawn amount will pay this penalty.`}</Text>
      </Container>
      <Flex justifyContent='space-between' pt='24px'> 
        <Button variant="secondary" onClick={onDismiss} scale="md">
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button scale="md" onClick={onConfirm}>
          {TranslateString(464, 'Confirm')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default PenaltyConfirmModal
