import React, { Suspense, lazy } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'penguinfinance-uikit2'
import BigNumber from 'bignumber.js'
// import { useWeb3React } from '@web3-react/core'
import { useFetchProfile, useFetchPublicData } from 'state/hooks'
import GlobalStyle from 'style/Global'
import Menu from 'components/Menu'
import ToastListener from 'components/ToastListener'
import PageLoader from 'components/PageLoader'
import CurrentBlockWrapper from 'components/CurrentBlockWrapper'
import Pools from 'views/Pools'
import GlobalCheckBullHiccupClaimStatus from 'views/Collectibles/components/GlobalCheckBullHiccupClaimStatus'
import history from './routerHistory'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Arena = lazy(() => import('./views/Arena'))
const Launchpad = lazy(() => import('./views/Launchpad'))
const Emperor = lazy(() => import('./views/Emperor'))
const CovidEmperor = lazy(() => import('./views/CovidEmperor'))
const Club = lazy(() => import('./views/Club'))
const NotFound = lazy(() => import('./views/NotFound'))

// const Nests = lazy(() => import('./views/Nests'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
const Collectibles = lazy(() => import('./views/Collectibles'))
const CompounderIgloos = lazy(() => import('./views/CompounderIgloos'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const Profile = lazy(() => import('./views/Profile'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  useFetchPublicData()
  useFetchProfile()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/compounder">
              <CompounderIgloos />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/igloos">
              <Farms />
            </Route>
            <Route path="/nests">
              <Pools />
            </Route>
            <Route path="/arena">
              <Arena />
            </Route>
            <Route path="/launchpad">
              <Launchpad />
            </Route>
            <Route path="/club">
              <Club />
            </Route>
            {/* <Route path="/emperor"> */}
            <Route path="/emperor">
              <Emperor />
            </Route>
            {/* temporary covid penguin emperor page */}
            {/* <Route path="/emperor">
              <CovidEmperor />
            </Route> */}
            {/* Redirect */}
            {/* <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route> */}
            <Route path="/collectibles">
              <Collectibles />
            </Route>
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <ToastListener />
      <GlobalCheckBullHiccupClaimStatus />
      <CurrentBlockWrapper />
    </Router>
  )
}

export default React.memo(App)
