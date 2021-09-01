/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import {
  fetchTotalPefiRaised,
  fetchTotalAvaxRaised,
  fetchLatestDonor,
  fetchFinalDate,
  fetchMyDonor,
  fetchMinDonationAvax,
  fetchMinDonationPefi,
} from './fetchDonationsData'
import { DonationsState } from '../types'

const initialState: DonationsState = {
  totalPefiRaised: 0,
  totalAvaxRaised: 0,
  latestDonor: {
    avaxDonations: 0,
    pefiDonations: 0,
    latestDonorName: '',
    address: '',
  },
  myDonor: {
    avaxDonations: 0,
    pefiDonations: 0,
    nickname: '',
    color: '',
    isRegistered: false,
    style: '0',
  },
  finalDate: null,
  minDonationAvax: 0,
  minDonationPefi: 0,
}

export const DonationsSlice = createSlice({
  name: 'Donations',
  initialState,
  reducers: {
    setInitialData: (state) => {
      state.totalPefiRaised = 0
      state.totalAvaxRaised = 0
      state.latestDonor = {
        avaxDonations: 0,
        pefiDonations: 0,
        latestDonorName: '',
        address: '',
      }
      state.myDonor = {
        avaxDonations: 0,
        pefiDonations: 0,
        nickname: '',
        color: '',
        isRegistered: false,
        style: '0',
      }
    },
    setTotalPefiRaised: (state, action) => {
      state.totalPefiRaised = action.payload
    },
    setTotalAvaxRaised: (state, action) => {
      state.totalAvaxRaised = action.payload
    },
    setLatestDonor: (state, action) => {
      state.latestDonor = action.payload
    },
    setMyDonor: (state, action) => {
      state.myDonor = { ...state.myDonor, ...action.payload }
    },
    setFinalDate: (state, action) => {
      state.finalDate = action.payload
    },
    setMinDonationAvax: (state, action) => {
      state.minDonationAvax = action.payload
    },
    setMinDonationPefi: (state, action) => {
      state.minDonationPefi = action.payload
    },
  },
})

// Actions
export const {
  setInitialData,
  setTotalPefiRaised,
  setTotalAvaxRaised,
  setLatestDonor,
  setMyDonor,
  setFinalDate,
  setMinDonationAvax,
  setMinDonationPefi,
} = DonationsSlice.actions

// Thunks

export const setInit = () => async (dispatch) => {
  dispatch(setInitialData())
}

export const fetchDonations = (account) => async (dispatch) => {
  if (!account) return

  const totalPefiRaised = await fetchTotalPefiRaised()
  dispatch(setTotalPefiRaised(totalPefiRaised))

  const totalAvaxRaised = await fetchTotalAvaxRaised()
  dispatch(setTotalAvaxRaised(totalAvaxRaised))

  const latestDonor = await fetchLatestDonor()
  dispatch(setLatestDonor(latestDonor))

  const finalDate = await fetchFinalDate()
  dispatch(setFinalDate(finalDate))

  const myDonor = await fetchMyDonor(account)
  dispatch(setMyDonor(myDonor))

  const minDonationAvax = await fetchMinDonationAvax()
  dispatch(setMinDonationAvax(minDonationAvax))

  const minDonationPefi = await fetchMinDonationPefi()
  dispatch(setMinDonationPefi(minDonationPefi))
}

export default DonationsSlice.reducer
