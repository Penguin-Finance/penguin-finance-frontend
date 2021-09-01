import React from 'react'
import { ModalProvider } from 'penguinfinance-uikit2'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import { SettingContextProvider } from 'contexts/SettingContext'
import store from 'state'
import { getLibrary } from 'utils/web3React'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ToastsProvider>
          <ThemeContextProvider>
            <SettingContextProvider>
              <LanguageContextProvider>
                <BlockContextProvider>
                  <RefreshContextProvider>
                    <ModalProvider>{children}</ModalProvider>
                  </RefreshContextProvider>
                </BlockContextProvider>
              </LanguageContextProvider>
            </SettingContextProvider>
          </ThemeContextProvider>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
