import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Sound from 'react-sound'
import { useWeb3React } from '@web3-react/core'
import { Text } from 'penguinfinance-uikit2'

import { useEmperor } from 'state/hooks'
import Page from 'components/layout/Page'
import useUserSetting from 'hooks/useUserSetting';
import EmperorBlock from './components/EmperorBlock'
import YourScoreBlock from './components/YourScoreBlock'
import TopPenguinsBlock from './components/TopPenguinsBlock'

const JACKPOTS = {
  LOCK: `${process.env.PUBLIC_URL}/images/emperor/jackpot/jackpot_lock.gif`,
  OPEN: `${process.env.PUBLIC_URL}/images/emperor/jackpot/jackpot_open.gif`,
  UNLOCK: `${process.env.PUBLIC_URL}/images/emperor/jackpot/jackpot_unlock.gif`,
}

const EmperorPage = styled(Page)`
  max-width: 100%; //1120px;
  overflow: hidden;
`

const ChestWrapper = styled.div<{ jackpot: string }>`
  position: absolute;
  width: 9.5%;
  left: 26%;
  bottom: 18%;
  z-index: 11;

  img {
    cursor: pointer;
  }
  .jackpot-lock {
    display: ${(props) => props.jackpot !== JACKPOTS.LOCK && 'none'};
  }
  .jackpot-open {
    display: ${(props) => props.jackpot !== JACKPOTS.OPEN && 'none'};
  }
  .jackpot-unlock {
    display: ${(props) => props.jackpot !== JACKPOTS.UNLOCK && 'none'};
  }
`

const PaperWrapper = styled.div<{ isOpen: boolean }>`
  @font-face {
    font-family: 'GothamBold Font';
    src: url(${process.env.PUBLIC_URL}/fonts/GothamBold.ttf) format('truetype');
  }

  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10%;

  div {
    position: absolute;
    font-family: 'GothamBold Font';
    min-width: 120px;
    text-align: center;

    span {
      color: #9b1919;
    }

    font-size: 10px;
    @media (min-width: 640px) {
      font-size: 12px;
    }
    @media (min-width: 768px) {
      font-size: 14px;
    }
    @media (min-width: 1200px) {
      min-width: 180px;
      font-size: 16px;
    }
    @media (min-width: 1450px) {
      min-width: 12 0px;
      font-size: 16px;
    }
    @media (min-width: 1600px) {
      font-size: 20px;
    }
  }
  @media (min-width: 1200px) {
    margin-bottom: 14%;
  }
  @media (min-width: 1450px) {
    margin-bottom: 12%;
  }
`

const JackpotPaper = styled.img`
  object-fit: cover;
  position: absolute;
  min-width: 120px;

  @media (min-width: 1200px) {
    min-width: 180px;
  }
`

const GridItem = styled.div`
  margin-bottom: '10px';
  max-width: 280px;
  margin: 0px 4px;
  width: 200px;

  @media (min-width: 640px) {
    max-width: 280px;
    width: 260px;
  }
  @media (min-width: 768px) {
    max-width: 260px;
  }
  @media (min-width: 1200px) {
    width: 280px;
    max-width: 280px;
  }
`

const Grid = styled.div<{ align: string; marginTop?: { xs?: number; sm?: number; md?: number; lg?: number } }>`
  display: flex;
  margin-bottom: 24px;
  justify-content: space-around;
  justify-content: ${({ align }) => (align === 'center' ? 'center' : 'space-between')};
  margin-top: ${({ marginTop }) => `${marginTop.xs}px`};
  padding: 0 3%;
  @media (min-width: 640px) {
    ${({ marginTop }) =>
      marginTop.xs && {
        marginTop: `${marginTop.xs}px`,
      }}
  }
  @media (min-width: 768px) {
    ${({ marginTop }) =>
      marginTop.sm && {
        marginTop: `${marginTop.sm}px`,
      }}
  }
  @media (min-width: 1200px) {
    ${({ marginTop }) =>
      marginTop.md && {
        marginTop: `${marginTop.md}px`,
      }}
  }
  @media (min-width: 1450px) {
    ${({ marginTop }) =>
      marginTop.lg && {
        marginTop: `${marginTop.lg}px`,
      }}
  }
  @media (max-width: 1600px) {
    font-size: 24px;
  }
  width: 100%;
`

const PGGRid = styled(Grid)`
  @media (min-width: 640px) and (max-height: 900px) {
    margin-top: -80px;
  }
  @media (min-width: 768px) and (max-height: 900px) {
    margin-top: -140px;
  }
  @media (min-width: 992px) and (max-height: 900px) {
    margin-top: -160px;
  }
  @media (min-width: 1200px) and (max-height: 900px) {
    margin-top: -140px;
  }
`

const EmperorBgContainer = styled.video`
  object-fit: fill;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: -1;
`

const Emperor: React.FC = () => {
  const [jackpot, setJackpot] = useState(JACKPOTS.LOCK)
  const { currentEmperor } = useEmperor()
  const { account } = useWeb3React()
  const [jackpotOpenSound, setJackpotOpenSound] = useState(false)
  const [showJackpot, setShowJackpot] = useState(false)
  const jackpotRef = useRef(jackpot)
  const { isMusic } = useUserSetting()
  jackpotRef.current = jackpot

  const handleOpenJackpot = () => {
    if (jackpotRef.current === JACKPOTS.LOCK) {
      setJackpotOpenSound(true)
      setJackpot(JACKPOTS.OPEN)
      setTimeout(() => {
        setJackpot(JACKPOTS.UNLOCK)
        setJackpotOpenSound(false)
      }, 800)
    } else if (jackpotRef.current === JACKPOTS.UNLOCK) {
      setJackpot(JACKPOTS.LOCK)
    }
  }

  const onJackpotLoaded = () => {
    setShowJackpot(true)
  }

  const renderEmperorStatsPage = () => {
    return (
      <>
        {account && (
          <ChestWrapper jackpot={jackpot} onClick={handleOpenJackpot}>
            <PaperWrapper isOpen={jackpot === JACKPOTS.UNLOCK}>
              <JackpotPaper
                onLoad={onJackpotLoaded}
                src={`${process.env.PUBLIC_URL}/images/emperor/jackpot/Mapefi.svg`}
                alt="jackpot_paper"
              />
              {showJackpot && (
                <Text className="price" fontSize="24px">
                  {currentEmperor.jackpot} <span>x</span>PEFI
                </Text>
              )}
            </PaperWrapper>
            <img className="jackpot-lock" src={JACKPOTS.LOCK} alt="jackpot_lock" />
            <img className="jackpot-open" src={JACKPOTS.OPEN} alt="jackpot_open" />
            <img className="jackpot-unlock" src={JACKPOTS.UNLOCK} alt="jackpot_unlock" />
          </ChestWrapper>
        )}
        <Grid align="center" marginTop={{ xs: 80, sm: 100 }}>
          <GridItem>
            <EmperorBlock />
          </GridItem>
        </Grid>
        {account && (
          <PGGRid align="between" marginTop={{ xs: -40, sm: -190, md: -200, lg: -200 }}>
            <GridItem>
              <TopPenguinsBlock />
            </GridItem>
            <GridItem>
              <YourScoreBlock />
            </GridItem>
          </PGGRid>
        )}
      </>
    )
  }

  const renderEmperorEndPage = () => {
    return <>{/* <EmperorEndBgContainer /> */}</>
  }

  const emperorEnded = false
  const emperorDefaultVideo = 'https://res.cloudinary.com/dbyunrpzq/video/upload/v1624544908/penguin_emperor_ldeorc.mp4'
  // to change the video of emperor winner page background video, please change this video path
  const emperorWinnerVideo = '/videos/penguin_emperor_winner.mp4'

  return (
    <EmperorPage>
      <Sound
        url={`${emperorEnded ? '/sounds/penguin_emperor_winner.mp3' : '/sounds/penguin_emperor_page.mp3'} `}
        playStatus={Sound.status.PLAYING}
        volume={isMusic ? 20 : 0}
        loop
      />
      <Sound
        url="/sounds/jackpot_open.mp3"
        playStatus={jackpotOpenSound ? Sound.status.PLAYING : Sound.status.STOPPED}
        volume={isMusic ? 100 : 0}
      />

      {/* background video */}
      <EmperorBgContainer width="100%" height="100%" autoPlay loop muted>
        <source src={emperorEnded ? emperorWinnerVideo : emperorDefaultVideo} />
      </EmperorBgContainer>

      {!emperorEnded ? <>{renderEmperorStatsPage()}</> : <>{renderEmperorEndPage()}</>}
    </EmperorPage>
  )
}

export default Emperor
