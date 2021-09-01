import { useCallback, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useLottery, useLotteryTicket } from 'hooks/useContract'
import useRefresh from './useRefresh'
import {
  getTotalRewards,
  getTotalClaim,
  getMatchingRewardLength,
  getWinningNumbers,
  getTickets,
} from '../utils/lotteryUtils'

const useTickets = (lotteryNumber = null) => {
  const [tickets, setTickets] = useState([])
  const { account } = useWeb3React()
  const ticketsContract = useLotteryTicket()
  const lotteryContract = useLottery()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTickets(lotteryContract, ticketsContract, account, lotteryNumber)
      setTickets(res)
    }

    if (account && lotteryContract && ticketsContract) {
      fetchBalance()
    }
  }, [account, lotteryContract, ticketsContract, fastRefresh, lotteryNumber])

  return tickets
}

export const useTotalRewards = () => {
  const [rewards, setRewards] = useState(new BigNumber(0))
  const lotteryContract = useLottery()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTotalRewards(lotteryContract)
      setRewards(new BigNumber(res))
    }

    if (lotteryContract) {
      fetchBalance()
    }
  }, [lotteryContract, fastRefresh])

  return rewards
}

export const useTotalClaim = () => {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0))
  const [claimLoading, setClaimLoading] = useState(false)
  const { account } = useWeb3React()
  const ticketsContract = useLotteryTicket()
  const lotteryContract = useLottery()

  const fetchBalance = useCallback(async () => {
    setClaimLoading(true)
    const claim = await getTotalClaim(lotteryContract, ticketsContract, account)
    setClaimAmount(claim)
    setClaimLoading(false)
  }, [account, lotteryContract, ticketsContract])

  useEffect(() => {
    if (account && lotteryContract && ticketsContract) {
      fetchBalance()
    }
  }, [account, fetchBalance, lotteryContract, ticketsContract])

  return { claimLoading, claimAmount }
}

export const useWinningNumbers = () => {
  const [winngNumbers, setWinningNumbers] = useState([0, 0, 0, 0])
  const lotteryContract = useLottery()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const rewards = await getWinningNumbers(lotteryContract)
      setWinningNumbers(rewards)
    }

    if (lotteryContract) {
      fetchBalance()
    }
  }, [fastRefresh, lotteryContract, setWinningNumbers])

  return winngNumbers
}

export const useMatchingRewardLength = (numbers) => {
  const [matchingNumbers, setMatchingNumbers] = useState(0)
  const lotteryContract = useLottery()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const matchedNumbaers = await getMatchingRewardLength(lotteryContract, numbers)
      setMatchingNumbers(matchedNumbaers)
    }

    if (lotteryContract) {
      fetchBalance()
    }
  }, [lotteryContract, numbers, fastRefresh])

  return matchingNumbers
}

export default useTickets
