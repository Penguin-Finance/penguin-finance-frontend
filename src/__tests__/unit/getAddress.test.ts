import { getAddress } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    128: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    256: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    43114: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
  }

  it(`get address for mainnet (chainId 43114)`, () => {
    process.env.REACT_APP_CHAIN_ID = '43114'
    const expected = address[43114]
    expect(getAddress(address)).toEqual(expected)
  })
})
