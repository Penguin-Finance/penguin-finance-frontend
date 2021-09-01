import React from 'react'
import styled from 'styled-components'
import { Card } from 'penguinfinance-uikit2'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalClaim } from 'hooks/useTickets'

const StyledCard = styled(Card)`
  ${(props) =>
    props.isDisabled
      ? `  
        margin-top: 16px;
        background-color: unset;
        box-shadow: unset;
        border: 1px solid ${props.theme.colors.textDisabled};

        ${props.theme.mediaQueries.sm} {
          margin-top: 24px;
        }

        ${props.theme.mediaQueries.lg} {
          margin-top: 32px;
        }
        `
      : ``}
`

const YourPrizesCard: React.FC = () => {
  const { claimAmount } = useTotalClaim()

  const winnings = getBalanceNumber(claimAmount)
  const isAWin = winnings > 0

  return (
    <StyledCard isDisabled={!isAWin} isActive={isAWin}>
      {/* <CardBody>{isAWin ? <PrizesWonContent /> : <NoPrizesContent />}</CardBody> */}
    </StyledCard>
  )
}

export default YourPrizesCard
