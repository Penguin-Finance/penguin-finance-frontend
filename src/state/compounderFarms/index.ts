/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'config/constants/compounderFarms'
import { fetchMasterChefGlobalData, fetchCompounderFarms } from './fetchCompounderFarms'
import {
  fetchCompounderFarmUserEarnings,
  fetchCompounderFarmUserAllowances,
  fetchCompounderFarmUserTokenBalances,
  fetchCompounderFarmUserStakedBalances,
  fetchCompounderPendingXPefiBalances,
} from './fetchCompounderFarmUser'
import { CompounderFarmsState, Farm } from '../types'

const initialState: CompounderFarmsState = { pefiPerBlock: 0, gondolaPerSec: 0, lydPerSec: 0, data: [...farmsConfig] }

export const farmsSlice = createSlice({
  name: 'CompounderFarms',
  initialState,
  reducers: {
    setPefiPerBlock: (state, action) => {
      state.pefiPerBlock = action.payload
    },
    setGondolaPerSec: (state, action) => {
      state.gondolaPerSec = action.payload
    },
    setLydPerSec: (state, action) => {
      state.lydPerSec = action.payload
    },
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid && f.type === farm.type)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const {
  setPefiPerBlock,
  setGondolaPerSec,
  setLydPerSec,
  setFarmsPublicData,
  setFarmUserData,
} = farmsSlice.actions

// Thunks
export const fetchMasterChefRewards = () => async (dispatch) => {
  const { pefiPerBlock, gondolaPerSec, lydPerSec } = await fetchMasterChefGlobalData()
  dispatch(setPefiPerBlock(pefiPerBlock))
  dispatch(setGondolaPerSec(gondolaPerSec))
  dispatch(setLydPerSec(lydPerSec))
}
export const fetchCompounderFarmsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchCompounderFarms()
  dispatch(setFarmsPublicData(farms))
}
export const fetchCompounderFarmUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchCompounderFarmUserAllowances(account)
  const userFarmTokenBalances = await fetchCompounderFarmUserTokenBalances(account)
  const {
    depositedLpBalances: userStakedBalances,
    receiptLpBalances: userStakedReceiptBalances,
  } = await fetchCompounderFarmUserStakedBalances(account)
  const userFarmEarnings = await fetchCompounderFarmUserEarnings(account)
  const userPendingXPefiBalances = await fetchCompounderPendingXPefiBalances(account)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      stakedReceiptBalance: userStakedReceiptBalances[index],
      earnings: userFarmEarnings[index],
      pendingXPefi: userPendingXPefiBalances[index],
    }
  })

  dispatch(setFarmUserData({ arrayOfUserDataObjects }))
}

export default farmsSlice.reducer
