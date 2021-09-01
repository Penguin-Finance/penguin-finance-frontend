import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from 'penguinfinance-uikit2'

const CoreTag = () => (
  <Tag variant="primary" outline startIcon={<VerifiedIcon />}>
    Core
  </Tag>
)

const CommunityTag = () => (
  <Tag variant="textSubtle" outline startIcon={<CommunityIcon />}>
    Community
  </Tag>
)

const BinanceTag = () => (
  <Tag variant="binance" outline startIcon={<BinanceIcon />}>
    Binance
  </Tag>
)

export { CoreTag, CommunityTag, BinanceTag }
