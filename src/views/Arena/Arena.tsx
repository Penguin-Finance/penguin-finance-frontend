import React from 'react'
import Sound from 'react-sound'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import useUserSetting from 'hooks/useUserSetting'

const arenaBgVideoUrl = 'https://res.cloudinary.com/dbyunrpzq/video/upload/v1624544901/penguin_arena_clpyb0.mp4'

const Arena: React.FC = () => {
  const { isMusic } = useUserSetting()
  const volumeSize = isMusic ? 100 : 0

  return (
    <Page>
      <Sound url="/sounds/penguin_arena_page.mp3" playStatus={Sound.status.PLAYING} loop volume={volumeSize} />
      <ArenaBgContainer width="100%" height="100%" autoPlay loop muted>
        <source src={arenaBgVideoUrl} />
      </ArenaBgContainer>
    </Page>
  )
}

const ArenaBgContainer = styled.video`
  object-fit: fill;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 1;
`

export default Arena
