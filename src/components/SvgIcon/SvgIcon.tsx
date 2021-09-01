import React from 'react'
import { ReactSVG } from 'react-svg'

interface IconProps {
  src: string
  width: string
  height: string
}

const Icon = ({ src, width = '20px', height = '20px' }: IconProps) => {
  return (
    <ReactSVG
      src={src}
      beforeInjection={(svg: any) => {
        svg.setAttribute('style', `height: ${height}`)
        svg.setAttribute('style', `width: ${width}`)
      }}
    />
  )
}

export default Icon
