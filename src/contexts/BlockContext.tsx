import React, { useState, useEffect, useRef } from 'react'
import { getWeb3 } from 'utils/web3'

const BlockContext = React.createContext({ block: 0, blockGenerationTime: 3 })

const BlockContextProvider = ({ children }) => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)
  const [blockGenerationTime, setBlockGenerationTime] = useState(3)
  const web3 = getWeb3()

  const calculateBlockGenerationTime = async () => {
    const currentBlockNumber = await web3.eth.getBlockNumber()
    if (currentBlockNumber !== 0) {
      const currentBlock: any = await web3.eth.getBlock(currentBlockNumber)
      const prevBlock: any = await web3.eth.getBlock(currentBlockNumber - 15000)
      const differenceTimeStamp: number = currentBlock.timestamp - prevBlock.timestamp
      setBlockGenerationTime(differenceTimeStamp / 15000)
    }
  }

  useEffect(() => {
    calculateBlockGenerationTime()
    const interval = setInterval(async () => {
      const currentBlockNumber = await web3.eth.getBlockNumber()
      calculateBlockGenerationTime()
      if (currentBlockNumber !== previousBlock.current) {
        previousBlock.current = currentBlockNumber
        setBlock(currentBlockNumber)
      }
    }, 3000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <BlockContext.Provider value={{ block, blockGenerationTime }}>{children}</BlockContext.Provider>
}

export { BlockContext, BlockContextProvider }
