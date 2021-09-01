import { usePricePefiUsdt } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from './useTickets'

const useLotteryTotalPrizesUsd = () => {
  const totalRewards = useTotalRewards()
  const totalCake = getBalanceNumber(totalRewards)
  const pefiPriceBusd = usePricePefiUsdt()

  return totalCake * pefiPriceBusd.toNumber()
}

export default useLotteryTotalPrizesUsd
