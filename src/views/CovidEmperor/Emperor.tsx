import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Sound from 'react-sound'
import { useWeb3React } from '@web3-react/core'
import { Text } from 'penguinfinance-uikit2'

import { useDonations } from 'state/hooks'
import Page from 'components/layout/Page'
import LatestDonation from './components/LatestDonation'
import YourScoreBlock from './components/YourScoreBlock'
import TopRaisedBlock from './components/TopRaisedBlock'

const AID_KIT = {
  LOCK: `${process.env.PUBLIC_URL}/images/covid-emperor/aid_kit/kit_lock.gif`,
  OPEN: `${process.env.PUBLIC_URL}/images/covid-emperor/aid_kit/kit_open.gif`,
  UNLOCK: `${process.env.PUBLIC_URL}/images/covid-emperor/aid_kit/kit_unlock.gif`,
}

const EmperorPage = styled(Page)`
  max-width: 1120px;
  overflow: hidden;
`

const ChestWrapper = styled.div<{ aidKit: string }>`
  position: absolute;
  width: 15%;
  left: 22%;
  bottom: 18%;

  &:hover {
    z-index: 15;
  }

  img {
    cursor: pointer;
  }
  .aid-kit-lock {
    display: ${(props) => props.aidKit !== AID_KIT.LOCK && 'none'};
  }
  .aid-kit-open {
    display: ${(props) => props.aidKit !== AID_KIT.OPEN && 'none'};
  }
  .aid-kit-unlock {
    display: ${(props) => props.aidKit !== AID_KIT.UNLOCK && 'none'};
  }
`

const PaperWrapper = styled.div`
  @font-face {
    font-family: 'GothamBold Font';
    src: url(${process.env.PUBLIC_URL}/fonts/GothamBold.ttf) format('truetype');
  }

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15%;

  .label {
    color: #3eb4d9;
  }

  .time-left {
    position: absolute;
    font-family: 'GothamBold Font';
    min-width: 100px;
    text-align: center;
    margin-left: 30%;
    margin-top: 5%;

    @media (min-width: 1200px) {
      min-width: 120px;
    }
    @media (min-width: 1450px) {
      margin-top: 3%;
    }
    div {
      line-height: 1.1;
      font-size: 10px;
      @media (min-width: 640px) {
        font-size: 12px;
      }
      @media (min-width: 1200px) {
        font-size: 18px;
      }
      @media (min-width: 1450px) {
        font-size: 22px;
      }
    }
  }
`

const KitPaper = styled.img`
  object-fit: cover;
  position: absolute;
  min-width: 100px;
  @media (min-width: 1200px) {
    min-width: 120px;
  }
`

const GridItem = styled.div`
  margin-bottom: '10px';
  max-width: 315px;
  margin: 0px -20px;
  width: 30%;
  display: flex;
  justify-content: center;
`

const Grid = styled.div<{ align: string; marginTop?: { xs?: number; sm?: number; md?: number; lg?: number } }>`
  display: flex;
  margin-bottom: 24px;
  justify-content: space-around;
  justify-content: ${({ align }) => (align === 'center' ? 'center' : 'space-between')};
  margin-top: ${({ marginTop }) => `${marginTop.xs}px`};
  @media (max-width: 640px) {
    ${({ marginTop }) =>
      marginTop.xs && {
        marginTop: `${marginTop.xs}px`,
      }}
  }
  @media (max-width: 768px) {
    ${({ marginTop }) =>
      marginTop.sm && {
        marginTop: `${marginTop.sm}px`,
      }}
  }
  @media (max-width: 1200px) {
    ${({ marginTop }) =>
      marginTop.md && {
        marginTop: `${marginTop.md}px`,
      }}
  }
  @media (max-width: 1450px) {
    ${({ marginTop }) =>
      marginTop.lg && {
        marginTop: `${marginTop.lg}px`,
      }}
  }
  @media (max-width: 1600px) {
    font-size: 24px;
  }
  padding: 0 5%;
  width: 100%;
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
  const [aidKit, setAidKit] = useState(AID_KIT.LOCK)
  const { account } = useWeb3React()
  const [aidKitOpenSound, setAidKitOpenSound] = useState(false)
  const [showTimeLeft, setShowTimeLeft] = useState(false)
  const aidKitRef = useRef(aidKit)
  const donations = useDonations()
  aidKitRef.current = aidKit

  const currentDate = new Date().getTime() / 1000
  const timeLeftInSecond = donations.finalDate ? Number(donations.finalDate) - currentDate : 0

  const handleOpenJackpot = () => {
    if (aidKitRef.current === AID_KIT.LOCK) {
      setAidKitOpenSound(true)
      setAidKit(AID_KIT.OPEN)
      setTimeout(() => {
        setAidKit(AID_KIT.UNLOCK)
        setAidKitOpenSound(false)
      }, 800)
    } else if (aidKitRef.current === AID_KIT.UNLOCK) {
      setAidKit(AID_KIT.LOCK)
    }
  }

  const onKitLoaded = () => {
    setShowTimeLeft(true)
  }

  const renderEmperorStatsPage = () => {
    return (
      <>
        {account && donations.finalDate && (
          <ChestWrapper aidKit={aidKit} onClick={handleOpenJackpot}>
            {aidKit === AID_KIT.UNLOCK && (
              <PaperWrapper>
                <KitPaper
                  onLoad={onKitLoaded}
                  src={`${process.env.PUBLIC_URL}/images/covid-emperor/aid_kit/KITcovidEmpty.png`}
                  alt="kit_paper"
                />
                {showTimeLeft && (
                  <div className="time-left">
                    <Text bold className="label">
                      Time Left:
                    </Text>
                    <Text bold>
                      {timeLeftInSecond / 3600 > 1
                        ? `${Number(timeLeftInSecond / 3600).toFixed(0)} hours`
                        : `${Number(timeLeftInSecond / 60).toFixed(0)} minutes`}
                    </Text>
                  </div>
                )}
              </PaperWrapper>
            )}
            <img className="aid-kit-lock" src={AID_KIT.LOCK} alt="aid_kit_lock" />
            <img className="aid-kit-open" src={AID_KIT.OPEN} alt="aid_kit_open" />
            <img className="aid-kit-unlock" src={AID_KIT.UNLOCK} alt="aid_kit_unlock" />
          </ChestWrapper>
        )}
        <Grid align="center" marginTop={{ xs: 100 }}>
          <GridItem>
            <LatestDonation />
          </GridItem>
        </Grid>
        <Grid align="between" marginTop={{ xs: -100, sm: -50, md: -60 }}>
          <GridItem>
            <TopRaisedBlock />
          </GridItem>
          <GridItem>
            <YourScoreBlock />
          </GridItem>
        </Grid>
      </>
    )
  }

  const renderEmperorEndPage = () => {
    return <>{/* <EmperorEndBgContainer /> */}</>
  }

  const emperorEnded = true
  const emperorDefaultVideo = '/videos/penguin_charity.mp4'
  // to change the video of emperor winner page background video, please change this video path
  const emperorWinnerVideo = '/videos/penguin_charity_end.mp4'

  return (
    <EmperorPage>
      <Sound
        url={`${emperorEnded ? '/sounds/charity_event.mp3' : '/sounds/charity_event.mp3'} `}
        playStatus={Sound.status.PLAYING}
        volume={20}
        loop
      />
      <Sound
        url="/sounds/jackpot_open.mp3"
        playStatus={aidKitOpenSound ? Sound.status.PLAYING : Sound.status.STOPPED}
        volume={100}
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
