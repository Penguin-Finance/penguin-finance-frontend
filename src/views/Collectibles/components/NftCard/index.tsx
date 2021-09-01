import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Heading,
  Tag,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  Text,
  CardFooter,
  useModal,
} from 'penguinfinance-uikit2'
import { useProfile } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { Nft } from 'config/constants/types'
import InfoRow from '../InfoRow'
import TransferNftModal from '../TransferNftModal'
import ClaimNftModal from '../ClaimNftModal'
import Preview from './Preview'

interface NftCardProps {
  nft: Nft
  canClaim?: boolean
  tokenIds?: number[]
  onSuccess: () => void
}

const Header = styled(InfoRow)`
  min-height: 28px;
`

const DetailsButton = styled(Button).attrs({ variant: 'text', fullWidth: true })`
  height: auto;
  border-radius: 8px;
  padding: 4px 24px;
  margin-bottom: 8px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.isDark ? '#121021' : '#fbca30'};
  color: #ffffff;

  svg {
    fill: #ffffff;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  padding: 16px 24px 24px;

  p {
    text-align: center;
  }
`

const Footer = styled(CardFooter)`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: none;
`;

const PGCard = styled(Card)`
  border-radius: 20px;
  padding: 8px 24px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  background: ${({ theme }) => theme.isDark && '#443C7C'};

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 360px;
  }
`;

const PGCardBody = styled(CardBody)`
  display: flex;
  justify-content: center;
  padding: 8px 0 12px;
`;

const NftCard: React.FC<NftCardProps> = ({ nft, onSuccess, canClaim = false, tokenIds = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()
  const { profile } = useProfile()
  const { bunnyId, name, description } = nft
  const walletOwnsNft = tokenIds.length > 0
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  const handleClick = async () => {
    setIsOpen(!isOpen)
  }

  const [onPresentTransferModal] = useModal(<TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={onSuccess} />)
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={onSuccess} />)

  return (
    <PGCard isActive={walletOwnsNft || canClaim}>
      <PGCardBody>
        <Header>
          <Heading size='lg'>{name}</Heading>
          {walletOwnsNft && (
            <Tag outline variant="secondary">
              {TranslateString(999, 'In Wallet')}
            </Tag>
          )}
          {profile?.nft?.bunnyId === bunnyId && (
            <Tag outline variant="success">
              {TranslateString(999, 'Profile Pic')}
            </Tag>
          )}
        </Header>
        {canClaim && (
          <Button scale="md" mt="24px" onClick={onPresentClaimModal}>
            {TranslateString(999, 'Claim this NFT')}
          </Button>
        )}
        {walletOwnsNft && (
          <Button scale="md" variant="secondary" mt="24px" onClick={onPresentTransferModal}>
            {TranslateString(999, 'Transfer')}
          </Button>
        )}
      </PGCardBody>
      <Preview nft={nft} isOwned={walletOwnsNft} />
      <Footer p="16px 0 0">
        <DetailsButton endIcon={<Icon width="32px" color="primary" />} onClick={handleClick}>
          {TranslateString(658, 'Details')}
        </DetailsButton>
        {isOpen && (
          <InfoBlock>
            <Text as="p" color="textSubtle">
              {description}
            </Text>
            <Text as="p" color="primary" mt='8px'>
              Coming Soon
            </Text>
          </InfoBlock>
        )}
      </Footer>
    </PGCard>
  )
}

export default NftCard
