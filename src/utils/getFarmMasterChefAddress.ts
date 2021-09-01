
import { getMasterChefAddress, getGondolaMasterChefAddress, getLydiaMasterChefAddress, getPangolinAddress } from 'utils/addressHelpers'

const getFarmMasterChefAddress = (farmType: string) => {
  switch(farmType) {
    case 'Penguin':
      return getMasterChefAddress();
    case 'Lydia':
      return getLydiaMasterChefAddress();
    case 'Gondola':
      return getGondolaMasterChefAddress();
    case 'Pangolin':
      return getPangolinAddress();
    default:
      return getMasterChefAddress();
  }
}

export default getFarmMasterChefAddress