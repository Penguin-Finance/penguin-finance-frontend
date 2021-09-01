import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import compounderFarmsReducer from './compounderFarms'
import lpsReducer from './lps'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import profileReducer from './profile'
import teamsReducer from './teams'
import emperorReducer from './emperor'
import achievementsReducer from './achievements'
import globalReducer from './global'
import donationsReducer from './donations'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    lps: lpsReducer,
    farms: farmsReducer,
    compounderFarms: compounderFarmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    emperor: emperorReducer,
    profile: profileReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
    global: globalReducer,
    donations: donationsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
