import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import penguinABI from 'config/abi/penguin.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/erc20'
import { getPefiAddress } from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(web3, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && web3) {
      fetchBalance()
    }
  }, [account, web3, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const penguinContract = getContract(penguinABI, getPefiAddress())
      const supply = await penguinContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(web3, tokenAddress, '0x000000000000000000000000000000000000dEaD')
      setBalance(new BigNumber(res))
    }

    if (web3) {
      fetchBalance()
    }
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export default useTokenBalance
