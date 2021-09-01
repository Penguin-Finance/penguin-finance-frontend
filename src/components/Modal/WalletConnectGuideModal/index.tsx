import React from 'react'
import { Modal, Overlay, Button, Text } from 'penguinfinance-uikit2'
import styled from 'styled-components'
import { useGlobal } from 'state/hooks'
import { hideWrongNetworkGuidModal } from 'state/global'
import { useAppDispatch } from 'state'

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
`

const GuideLink = styled.a`
  padding: 10px;
  display: block;
  width: block;
`

const WalletConnectGuideModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const onDismiss = () => {
    dispatch(hideWrongNetworkGuidModal())
  }

  const { wrongNetworkGuideModalOpened } = useGlobal()

  return (
    <>
      {wrongNetworkGuideModalOpened && (
        <ModalWrapper>
          <Overlay show onClick={onDismiss} />
          <Modal title="New to Penguin Finance?" onDismiss={onDismiss}>
            <Button width="100%" variant="tertiary" style={{ justifyContent: 'space-between' }}>
              <Text bold color="primary" mr="16px" style={{ width: '100%', textAlign: 'left' }}>
                <GuideLink
                  href="https://penguin-finance.medium.com/penguin-finance-getting-started-923c383bb060"
                  target="_blank"
                >
                  Quick guide
                </GuideLink>
              </Text>
            </Button>
          </Modal>
        </ModalWrapper>
      )}
    </>
  )
}

export default WalletConnectGuideModal
