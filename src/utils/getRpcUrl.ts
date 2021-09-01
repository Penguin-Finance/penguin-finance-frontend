import random from 'lodash/random'

// Array of available nodes to connect to
// const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
export const nodes = [
  'https://api.avax.network/ext/bc/C/rpc',
  'https://api.avax.network/ext/bc/C/rpc',
  'https://api.avax.network/ext/bc/C/rpc',
]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export default getNodeUrl
