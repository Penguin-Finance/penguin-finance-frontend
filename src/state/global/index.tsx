/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { GlobalState } from 'state/types'

const initialState: GlobalState = {
  wrongNetworkGuideModalOpened: false,
}

export const globalSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    showWrongNetworkGuidModal: () => ({
      ...initialState,
      wrongNetworkGuideModalOpened: true,
    }),
    hideWrongNetworkGuidModal: () => ({
      ...initialState,
      wrongNetworkGuideModalOpened: false,
    }),
  },
})

// Actions
export const { showWrongNetworkGuidModal, hideWrongNetworkGuidModal } = globalSlice.actions

export default globalSlice.reducer
