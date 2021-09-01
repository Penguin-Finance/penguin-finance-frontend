import { useEffect, useState } from 'react'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'
import useWeb3 from 'hooks/useWeb3'
import {
  getAddress,
  getMasterChefAddress,
  getPefiAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getBunnyFactoryAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getPointCenterIfoAddress,
  getBunnySpecialAddress,
  getEmperorAddress,
  getWithoutBordersAddress as getCharityEmperorAddress,
  getCharityPenguinDBAddress,
  getEmperorPenguinDBAddress,
  getXPefiAddress,
} from 'utils/addressHelpers'
import getFarmMasterChefAddress from 'utils/getFarmMasterChefAddress'
import getFarmMasterChefAbi from 'utils/getFarmMasterChefAbi'
import getStrategyAddress from 'utils/getStrategyAddress'
import getStrategyAbi from 'utils/getStrategyAbi'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'
import ifo from 'config/abi/ifo.json'
import erc20 from 'config/abi/erc20.json'
import bunnyFactory from 'config/abi/bunnyFactory.json'
import pancakeRabbits from 'config/abi/pancakeRabbits.json'
import lottery from 'config/abi/lottery.json'
import lotteryTicket from 'config/abi/lotteryNft.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import profile from 'config/abi/pancakeProfile.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import bunnySpecial from 'config/abi/bunnySpecial.json'
import emperor from 'config/abi/emperor.json'
import donations from 'config/abi/donations.json'
import charityPenguinDB from 'config/abi/charityPenguin.json'
import emperorPenguinDB from 'config/abi/emperorPenguinDB.json'
import xPefi from 'config/abi/xPefi.json'

const useContract = (abi: AbiItem, address: string, contractOptions?: ContractOptions) => {
  const web3 = useWeb3()
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address, contractOptions))

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions))
  }, [abi, address, contractOptions, web3])

  return contract
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const ifoAbi = (ifo as unknown) as AbiItem
  return useContract(ifoAbi, address)
}

export const useERC20 = (address: string) => {
  const erc20Abi = (erc20 as unknown) as AbiItem
  return useContract(erc20Abi, address)
}

export const usePenguin = () => {
  return useERC20(getPefiAddress())
}

export const useBunnyFactory = () => {
  const bunnyFactoryAbi = (bunnyFactory as unknown) as AbiItem
  return useContract(bunnyFactoryAbi, getBunnyFactoryAddress())
}

export const usePancakeRabbits = () => {
  const pancakeRabbitsAbi = (pancakeRabbits as unknown) as AbiItem
  return useContract(pancakeRabbitsAbi, getPancakeRabbitsAddress())
}

export const useProfile = () => {
  const profileABIAbi = (profile as unknown) as AbiItem
  return useContract(profileABIAbi, getPancakeProfileAddress())
}

export const useLottery = () => {
  const abi = (lottery as unknown) as AbiItem
  return useContract(abi, getLotteryAddress())
}

export const useLotteryTicket = () => {
  const abi = (lotteryTicket as unknown) as AbiItem
  return useContract(abi, getLotteryTicketAddress())
}

export const useMasterchef = (type?: string) => {
  let abi = (masterChef as unknown) as AbiItem
  let masterChefAddress = getMasterChefAddress()
  if (type) {
    abi = (getFarmMasterChefAbi(type) as unknown) as AbiItem
    masterChefAddress = getFarmMasterChefAddress(type)
  }
  return useContract(abi, masterChefAddress)
}

export const useStrategyContract = (lpSymbol: string, type: string) => {
  const abi = (getStrategyAbi(lpSymbol, type) as unknown) as AbiItem
  const strategyAddress = getStrategyAddress(lpSymbol, type)
  return useContract(abi, strategyAddress)
}

export const useSousChef = (id) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const rawAbi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  const abi = (rawAbi as unknown) as AbiItem
  return useContract(abi, getAddress(config.contractAddress))
}

export const usePointCenterIfoContract = () => {
  const abi = (pointCenterIfo as unknown) as AbiItem
  return useContract(abi, getPointCenterIfoAddress())
}

export const useBunnySpecialContract = () => {
  const abi = (bunnySpecial as unknown) as AbiItem
  return useContract(abi, getBunnySpecialAddress())
}

// emperor
export const useEmperor = () => {
  const abi = (emperor as unknown) as AbiItem
  return useContract(abi, getEmperorAddress())
}

export const useEmperorPenguinDB = () => {
  const abi = (emperorPenguinDB as unknown) as AbiItem
  return useContract(abi, getEmperorPenguinDBAddress())
}

// covid emperor
export const useCharityEmperor = () => {
  const abi = (donations as unknown) as AbiItem
  return useContract(abi, getCharityEmperorAddress())
}

export const useCharityPenguinDB = () => {
  const abi = (charityPenguinDB as unknown) as AbiItem
  return useContract(abi, getCharityPenguinDBAddress())
}

export const useXPefi = () => {
  const abi = (xPefi as unknown) as AbiItem
  return useContract(abi, getXPefiAddress())
}

export default useContract
