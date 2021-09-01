import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { Card, CardBody, Heading, Skeleton } from 'penguinfinance-uikit2'
import useI18n from 'hooks/useI18n'
import { Pool } from 'state/types'

const StyledTotalValueLockedCard = styled(Card)`
  min-height: 150px;
  align-items: center;
  display: flex;
  flex: 1;
  background: #363266;
  background: ${({ theme }) => theme.isDark && '#30264F'};
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
  color: #ffffff;
`

const Title = styled(Heading)`
  color: #ffffff;
`

interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}

const TotalPefiStakedNests: React.FC<HarvestProps> = ({ pool }) => {
  const { totalStaked } = pool

  const TranslateString = useI18n()
  if (totalStaked) {
    return (
      <StyledTotalValueLockedCard>
        <CardBody>
          <Title size="md">{TranslateString(762, 'A total of')}</Title>
          <CardMidContent color="primary">
            {parseInt(getBalanceNumber(totalStaked).toString()) ? (
              `${parseInt(getBalanceNumber(totalStaked).toString())} ${TranslateString(736, 'PEFI')}`
            ) : (
              <Skeleton animation="pulse" variant="rect" height="44px" />
            )}
          </CardMidContent>
          <Title size="md">{TranslateString(764, 'Staked in Penguin Nests')}</Title>
        </CardBody>
      </StyledTotalValueLockedCard>
    )
  }
  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Title size="md">{TranslateString(762, 'Stake your PEFI now!')}</Title>
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalPefiStakedNests
