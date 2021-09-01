import React, { ImgHTMLAttributes } from 'react'
import styled from 'styled-components'
import { BunnyPlaceholderIcon } from 'penguinfinance-uikit2'

interface AchievementAvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  badge?: string
}

const NoBadgePlaceholder = styled(BunnyPlaceholderIcon)`
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const StyledAchievementAvatar = styled.img`
  border-radius: 50%;
  height: 48px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const AchievementAvatar: React.FC<AchievementAvatarProps> = ({ badge, ...props }) => {
  if (!badge) {
    return <NoBadgePlaceholder />
  }

  return <StyledAchievementAvatar src={`/images/achievements/${badge}`} alt="achievement badge" {...props} />
}

export default AchievementAvatar
