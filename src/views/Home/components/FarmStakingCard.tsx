import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, Text } from 'penguinfinance-uikit2'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import PefiHarvestBalance from './PefiHarvestBalance'
import PefiWalletBalance from './PefiWalletBalance'

const StyledFarmStakingCard = styled(Card)`
  min-height: 376px;
  background: ${({ theme }) => theme.isDark && '#30264F'};
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled(Text).attrs({ color: 'primary' })`
  font-size: 14px;
  color: ${({ theme }) => theme.isDark && '#D4444C'};
`

const Actions = styled.div`
  margin-top: 24px;
`

const Title = styled(Heading)`
  color: ${({ theme }) => !theme.isDark && '#D4444C'};
`

const PGUnlockButton = styled(UnlockButton)`
  background: ${({ theme }) => !theme.isDark && '#383466'};
`;

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Title size="xl" mb="24px">
          {TranslateString(542, 'Farms & Staking')}
        </Title>
        <CardImage src="/images/penguin-logo.png" alt="penguin logo" width={64} height={64} />
        <Block>
          <Label>{TranslateString(544, 'PEFI to Harvest')}:</Label>
          <PefiHarvestBalance />
        </Block>
        <Block>
          <Label>{TranslateString(546, 'PEFI in Wallet')}:</Label>
          <PefiWalletBalance />
        </Block>
        <Actions>
          {account ? (
            <Button
              id="harvest-all"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              scale="md"
            >
              {pendingTx
                ? TranslateString(548, 'Collecting PEFI')
                : TranslateString(532, `Harvest all (${balancesWithValue.length})`)}
            </Button>
          ) : (
            <PGUnlockButton fullWidth />
          )}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
