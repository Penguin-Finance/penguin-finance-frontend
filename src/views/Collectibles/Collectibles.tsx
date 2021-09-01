import React from 'react'
import styled from 'styled-components';
import Page from 'components/layout/Page'
import useTheme from 'hooks/useTheme';
import NftList from './components/NftList'

const PageBgContainer = styled.div`
  background-image: ${({ theme }) => theme.isDark ? `url('/images/nfts/Background_for_NFT_Nightmode.png')` : `url('/images/nfts/NFTPattern.png')`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: -1;
`

const NFTPage = styled(Page)`
  max-width: 1200px;
  padding: 0 0 24px;
`;

const Collectibles = () => {
  const { isDark } = useTheme();
  return (
    <NFTPage>
      <PageBgContainer />
      <img src={`${process.env.PUBLIC_URL}/images/nfts/${isDark ? 'BannerNightNFTs' : 'NFTBannerAnimated'}.gif`} alt="ntf banner" />
      <NftList />
    </NFTPage>
  )
}

export default Collectibles
