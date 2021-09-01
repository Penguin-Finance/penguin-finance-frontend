/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import {
  fetchEmperorData,
  fetchCurrentEmperorAddress,
  fetchCurrentEmperorBid,
  fetchMaxBidIncrease,
  fetchMinBidIncrease,
  fetchOpeningBid,
  fetchFinalDate,
  fetchPoisonDuration,
  fetchTopEmperors,
  fetchCurrentEmperorJackpot,
  fetchCanBePoisoned,
  fetchLastTimePoisoned,
  fetchLastPoisonedBy,
  fetchTimeLeftForPoison,
} from './fetchEmperorData'
import { EmperorState } from '../types'

const initialState: EmperorState = {
  myEmperor: {},
  currentEmperor: {},
  topEmperors: [],
  maxBidIncrease: 0,
  minBidIncrease: 0,
  openingBib: 0,
  finalDate: 0,
  poisonDuration: 0,
}

export const EmperorSlice = createSlice({
  name: 'Emperor',
  initialState,
  reducers: {
    setInitialData: (state) => {
      state.currentEmperor = {}
    },
    setMyEmperor: (state, action) => {
      state.myEmperor = {
        ...state.myEmperor,
        ...action.payload,
      }
    },
    setCurrentEmperor: (state, action) => {
      state.currentEmperor = {
        ...state.currentEmperor,
        ...action.payload,
      }
    },
    setTopEmperors: (state, action) => {
      state.topEmperors = [...action.payload]
    },
    setMaxBidIncrease: (state, action) => {
      state.maxBidIncrease = action.payload
    },
    setMinBidIncrease: (state, action) => {
      state.minBidIncrease = action.payload
    },
    setOpeningBib: (state, action) => {
      state.openingBib = action.payload
    },
    setFinalDate: (state, action) => {
      state.finalDate = action.payload
    },
    setPoisonDuration: (state, action) => {
      state.poisonDuration = action.payload
    },
  },
})

// Actions
export const {
  setInitialData,
  setMyEmperor,
  setCurrentEmperor,
  setTopEmperors,
  setMaxBidIncrease,
  setMinBidIncrease,
  setOpeningBib,
  setFinalDate,
  setPoisonDuration,
} = EmperorSlice.actions

// Thunks

export const setInit = () => async (dispatch) => {
  dispatch(setInitialData())
}

export const fetchEmperor = (account) => async (dispatch) => {
  if (!account) return

  // fetch general Info
  const maxBidIncrease = await fetchMaxBidIncrease()
  dispatch(setMaxBidIncrease(maxBidIncrease))

  const minBidIncrease = await fetchMinBidIncrease()
  dispatch(setMinBidIncrease(minBidIncrease))

  const openingBid = await fetchOpeningBid()
  dispatch(setOpeningBib(openingBid))

  const finalDate = await fetchFinalDate()
  dispatch(setFinalDate(finalDate))

  const poisonDuration = await fetchPoisonDuration()
  dispatch(setPoisonDuration(poisonDuration))

  // fetch current emperor
  const currentEmperorAddress = await fetchCurrentEmperorAddress()
  dispatch(setCurrentEmperor({ address: currentEmperorAddress }))

  const currentEmperorBid = await fetchCurrentEmperorBid()
  dispatch(setCurrentEmperor({ bidAmount: currentEmperorBid }))

  const currentEmperorJackpot = await fetchCurrentEmperorJackpot()
  dispatch(setCurrentEmperor({ jackpot: currentEmperorJackpot }))

  if (currentEmperorAddress && currentEmperorAddress.length > 0) {
    const currentEmperor = await fetchEmperorData(currentEmperorAddress)
    dispatch(setCurrentEmperor(currentEmperor))
  }

  // fetch my emperor
  const myEmperor = await fetchEmperorData(account)
  const canBePoisoned = await fetchCanBePoisoned(account)
  const lastTimePoisoned = await fetchLastTimePoisoned(account)
  const lastPoisonedBy = await fetchLastPoisonedBy(account)
  const timeLeftForPoison = await fetchTimeLeftForPoison(account)

  dispatch(
    setMyEmperor({
      ...myEmperor,
      address: account,
      canBePoisoned,
      lastTimePoisoned,
      lastPoisonedBy,
      timeLeftForPoison,
    }),
  )

  // fetch top 5 emperor
  if (currentEmperorAddress && currentEmperorAddress.length > 0) {
    const topEmperors = await fetchTopEmperors()
    dispatch(setTopEmperors(topEmperors))
  }
}

export default EmperorSlice.reducer
