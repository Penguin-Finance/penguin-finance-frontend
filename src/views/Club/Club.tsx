import React from 'react'
import styled from 'styled-components'
import Page from 'components/layout/Page'

const Club: React.FC = () => {
  return (
    <Page>
      <ClubBgContainer width="100%" height="100%" />
    </Page>
  )
}

const ClubBgContainer = styled.video`
  object-fit: fill;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 1;
`

export default Club
