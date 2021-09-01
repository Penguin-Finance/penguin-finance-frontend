import { useContext } from 'react'
import { BlockContext } from 'contexts/BlockContext'

const useBlockGenerationTime = () => {
  const { blockGenerationTime } = useContext(BlockContext)
  return blockGenerationTime
}

export default useBlockGenerationTime
