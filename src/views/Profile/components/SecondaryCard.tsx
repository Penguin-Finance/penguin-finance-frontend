import styled from 'styled-components'
import { Text } from 'penguinfinance-uikit2'

const SecondaryCard = styled(Text)`
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 16px;
`

SecondaryCard.defaultProps = {
  p: '24px',
}

export default SecondaryCard
