
const getLiquidityUrlPathParts = ({ quoteTokenAddresses, quoteTokenSymbol, tokenAddresses }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const firstPart = quoteTokenSymbol === 'AVAX' ? 'AVAX' : quoteTokenAddresses[chainId]
  const secondPart = tokenAddresses[chainId]
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
