import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { Card, CardBody, Heading, Skeleton } from 'penguinfinance-uikit2'
import { useTotalSupply } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { Pool } from 'state/types'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
  background: #d4444c;
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

const PercentagePefiStakedNests: React.FC<HarvestProps> = ({ pool }) => {
  const totalSupply = useTotalSupply()

  const { totalStaked } = pool

  const TranslateString = useI18n()
  if (totalStaked) {
    const percentageStaked = (getBalanceNumber(totalStaked) / getBalanceNumber(totalSupply)) * 100
    return (
      <StyledTotalValueLockedCard>
        <CardBody>
          <Title size="md">{TranslateString(762, 'A total of')}</Title>
          <CardMidContent color="primary">
            {parseInt(percentageStaked.toString()) ? (
              `${parseInt(percentageStaked.toString())}% ${TranslateString(736, 'of PEFI')}`
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

export default PercentagePefiStakedNests
