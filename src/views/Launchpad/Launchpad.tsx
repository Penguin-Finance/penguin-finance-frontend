import React from 'react'
import styled from 'styled-components'
import Page from 'components/layout/Page'

const Launchpad: React.FC = () => {
  return (
    <Page>
      <LaunchpadBgContainer width="100%" height="100%" autoPlay loop controls>
        <source src="https://res.cloudinary.com/dbyunrpzq/video/upload/v1624954572/Sample_Final_02_p5ubch.mp4" />
      </LaunchpadBgContainer>
    </Page>
  )
}

const LaunchpadBgContainer = styled.video`
  object-fit: fill;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 1;
`

export default Launchpad
