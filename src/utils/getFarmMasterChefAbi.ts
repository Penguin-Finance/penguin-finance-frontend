import masterchefABI from 'config/abi/masterchef.json'
import gondolaMasterchefABI from 'config/abi/gondolaMasterChef.json'
import lydiaMasterchefABI from 'config/abi/lydiaMasterChef.json'
import pangolinManagerABI from 'config/abi/pangolinManager.json'
import pangolinStakingABI from 'config/abi/pangolinStaking.json'

const getFarmMasterChefAbi = (farmType: string) => {
  switch (farmType) {
    case 'Penguin':
      return masterchefABI
    case 'Lydia':
      return lydiaMasterchefABI
    case 'Gondola':
      return gondolaMasterchefABI
    case 'Pangolin':
      return pangolinStakingABI
    case 'Pangolin-Manager':
      return pangolinManagerABI
    default:
      return masterchefABI
  }
}

export default getFarmMasterChefAbi
