import compounderFarms from 'config/constants/compounderFarms'

const getStrategyAddress = (lpSymbol: string, farmType: string) => {
  const farm = compounderFarms.find((farmItem) => farmItem.lpSymbol === lpSymbol && farmItem.type === farmType)
  return farm.strategyAddress
}

export default getStrategyAddress
