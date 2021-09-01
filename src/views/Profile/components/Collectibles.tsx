import React from 'react'
import { Heading, Text, Flex, ChevronRightIcon } from 'penguinfinance-uikit2'
import { Link } from 'react-router-dom'
import useI18n from 'hooks/useI18n'
import nfts from 'config/constants/nfts'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import styled from 'styled-components'
import CollectibleCard from './CollectibleCard'

const CollectibleList = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 24px;
    grid-template-columns: repeat(3, 1fr);
    padding: 24px 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(5, 1fr);
  }
`

const Collectibles = () => {
  const TranslateString = useI18n()
  const { nfts: tokenIdsInWallet } = useGetWalletNfts()
  const bunnyIds = Object.keys(tokenIdsInWallet).map((nftWalletItem) => Number(nftWalletItem))
  const nftsInWallet = nfts.filter((nft) => bunnyIds.includes(nft.bunnyId))

  return (
    <>
      <Heading as="h4" size="md" mb="8px">
        {TranslateString(999, 'Pancake Collectibles')}
      </Heading>
      <Text as="p">
        {TranslateString(
          999,
          'Pancake Collectibles are special ERC-721 NFTs that can be used on the PenguinFinance platform.',
        )}
      </Text>
      <Text as="p">
        {TranslateString(
          999,
          "NFTs in this user's wallet that aren't approved Pancake Collectibles won't be shown here.",
        )}
      </Text>
      {nftsInWallet.length > 0 && (
        <CollectibleList>
          {nftsInWallet.map((nftInWallet) => (
            <CollectibleCard key={nftInWallet.bunnyId} nft={nftInWallet} />
          ))}
        </CollectibleList>
      )}
      {nftsInWallet.length === 0 && (
        <Flex justifyContent="center" p="32px">
          <Text fontSize="20px" bold color="textDisabled">
            {TranslateString(999, 'No NFTs Found')}
          </Text>
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="flex-end">
        <Link to="/collectibles">{TranslateString(999, 'See all approved Pancake Collectibles')}</Link>
        <ChevronRightIcon />
      </Flex>
    </>
  )
}

export default Collectibles
