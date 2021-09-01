import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import erc20 from 'config/abi/erc20.json'
import { getWeb3NoAccount } from 'utils/web3'

const web3NoAccount = getWeb3NoAccount()
export const getContract = (web3: Web3, address: string) => {
  const _web3 = web3 ?? web3NoAccount

  const contract = new _web3.eth.Contract((erc20 as unknown) as AbiItem, address)
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods.allowance(account, masterChefContract.options.address).call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getTokenBalance = async (web3: Web3, tokenAddress: string, userAddress: string): Promise<string> => {
  const contract = getContract(web3, tokenAddress)
  try {
    const balance: string = await contract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}
