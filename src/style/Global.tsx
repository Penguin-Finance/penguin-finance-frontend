import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PenguinTheme } from 'penguinfinance-uikit2/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PenguinTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }
  #root {
    position: relative;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    background: ${({ theme }) => theme.isDark && '#171027'};
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
