import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchEmperor, fetchDonations } from 'state/actions'
import {
  // normal emperor
  registerEmperor,
  stealCrown,
  stealCrownAndPoison,
  changeEmperorStyle,
  changeEmperorColor,
  // charity emperor
  registerCharityEmperor,
  changeCharityEmperorStyle,
  changeCharityEmperorColor,
  donateAvax,
  donatePefi,
  // approve
  approveXPefi,
  approvePefi,
} from 'utils/callHelpers'
import { getEmperorAddress, getWithoutBordersAddress } from 'utils/addressHelpers'
import {
  // emperor
  useEmperor,
  useEmperorPenguinDB,
  // covid emperor
  useCharityEmperor,
  useCharityPenguinDB,
  useXPefi,
  usePenguin,
} from './useContract'

const useEmperorActions = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const emperorContract = useEmperor()
  const emperorPenguinDBContract = useEmperorPenguinDB()

  const handleRegister = useCallback(
    async (nickName: string, color: string, style: string) => {
      const txHash = await registerEmperor(emperorPenguinDBContract, { nickName, color, style }, account)
      dispatch(fetchEmperor(account))
      console.info(txHash)
    },
    [account, dispatch, emperorPenguinDBContract],
  )

  const handleChangeColor = useCallback(
    async (color: string) => {
      const txHash = await changeEmperorColor(emperorPenguinDBContract, color, account)
      dispatch(fetchEmperor(account))
      console.info(txHash)
    },
    [account, dispatch, emperorPenguinDBContract],
  )

  const handleChangeStyle = useCallback(
    async (style: string) => {
      const txHash = await changeEmperorStyle(emperorPenguinDBContract, style, account)
      dispatch(fetchEmperor(account))
      console.info(txHash)
    },
    [account, dispatch, emperorPenguinDBContract],
  )

  const handleStealCrown = useCallback(
    async (amount: string) => {
      const txHash = await stealCrown(emperorContract, amount, account)
      dispatch(fetchEmperor(account))
      console.info(txHash)
    },
    [account, dispatch, emperorContract],
  )

  const handleStealCrownAndPoison = useCallback(
    async (amount: string) => {
      const txHash = await stealCrownAndPoison(emperorContract, amount, account)
      dispatch(fetchEmperor(account))
      console.info(txHash)
    },
    [account, dispatch, emperorContract],
  )

  return {
    onRegister: handleRegister,
    onSteal: handleStealCrown,
    onStealAndPoison: handleStealCrownAndPoison,
    onChangeStyle: handleChangeStyle,
    onChangeColor: handleChangeColor,
  }
}

// charity emperor actions
const useCharityEmperorActions = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const charityEmperorContract = useCharityEmperor()
  const charityPenguinDBContract = useCharityPenguinDB()

  const handleRegister = useCallback(
    async (nickName: string, color: string, style: string) => {
      const txHash = await registerCharityEmperor(charityPenguinDBContract, { nickName, color, style }, account)
      dispatch(fetchDonations(account))
      console.info(txHash)
    },
    [account, dispatch, charityPenguinDBContract],
  )

  const handleChangeColor = useCallback(
    async (color: string) => {
      const txHash = await changeCharityEmperorColor(charityPenguinDBContract, color, account)
      dispatch(fetchDonations(account))
      console.info(txHash)
    },
    [account, dispatch, charityPenguinDBContract],
  )

  const handleChangeStyle = useCallback(
    async (style: string) => {
      const txHash = await changeCharityEmperorStyle(charityPenguinDBContract, style, account)
      dispatch(fetchDonations(account))
      console.info(txHash)
    },
    [account, dispatch, charityPenguinDBContract],
  )

  const handleDonateAvax = useCallback(
    async (amount: string) => {
      const txHash = await donateAvax(charityEmperorContract, amount, account)
      dispatch(fetchDonations(account))
      console.info(txHash)
    },
    [account, dispatch, charityEmperorContract],
  )

  const handleDonatePefi = useCallback(
    async (amount: string) => {
      const txHash = await donatePefi(charityEmperorContract, amount, account)
      dispatch(fetchDonations(account))
      console.info(txHash)
    },
    [account, dispatch, charityEmperorContract],
  )

  return {
    onRegister: handleRegister,
    onChangeStyle: handleChangeStyle,
    onChangeColor: handleChangeColor,
    onDonateAvax: handleDonateAvax,
    onDonatePefi: handleDonatePefi,
  }
}

const useXPefiApprove = () => {
  const { account } = useWeb3React()
  const xPefiContract = useXPefi()

  const handleXPefiApprove = useCallback(async () => {
    const txHash = await approveXPefi(xPefiContract, account, getEmperorAddress())
    console.info(txHash)
  }, [account, xPefiContract])

  return { onApproveXPefi: handleXPefiApprove }
}

const usePefiApprove = () => {
  const { account } = useWeb3React()
  const pefiContract = usePenguin()

  const handlePefiApprove = useCallback(async () => {
    const txHash = await approvePefi(pefiContract, account, getWithoutBordersAddress())
    console.info(txHash)
  }, [account, pefiContract])

  return { onApprovePefi: handlePefiApprove }
}

export { useEmperorActions, useCharityEmperorActions, useXPefiApprove, usePefiApprove }
