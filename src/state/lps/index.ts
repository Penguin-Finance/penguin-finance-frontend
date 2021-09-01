/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import lpsConfig from 'config/constants/lps'
import fetchLps from './fetchLps'
import fetchLpUserTokenBalances from './fetchLpsUser'
import { LpsState, Lp } from '../types'

const initialState: LpsState = { data: [...lpsConfig] }

export const lpsSlice = createSlice({
  name: 'Lps',
  initialState,
  reducers: {
    setLpsPublicData: (state, action) => {
      const liveLpsData: Lp[] = action.payload
      state.data = state.data.map((lp) => {
        const liveLpData = liveLpsData.find((f) => f.lpSymbol === lp.lpSymbol)
        return { ...lp, ...liveLpData }
      })
    },
    setLpUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const { setLpsPublicData, setLpUserData } = lpsSlice.actions

// Thunks
export const fetchLpsPublicDataAsync = () => async (dispatch) => {
  const lps = await fetchLps()
  dispatch(setLpsPublicData(lps))
}
export const fetchLpUserDataAsync = (account) => async (dispatch) => {
  const userLpTokenBalances = await fetchLpUserTokenBalances(account)

  const arrayOfUserDataObjects = userLpTokenBalances.map((lpTokenBalance, index) => {
    return {
      index,
      tokenBalance: userLpTokenBalances[index],
    }
  })

  dispatch(setLpUserData({ arrayOfUserDataObjects }))
}

export default lpsSlice.reducer
