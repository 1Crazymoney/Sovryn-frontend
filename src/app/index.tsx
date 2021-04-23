/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';
import { currentNetwork } from '../utils/classifiers';
import { useAppTheme } from './hooks/app/useAppTheme';
import { useMaintenance } from './hooks/useMaintenance';

import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { StatsPage } from './containers/StatsPage/Loadable';
import { WalletProvider } from './containers/WalletProvider';
import { SwapPage } from './containers/SwapPage/Loadable';
import { LiquidityPage } from './containers/LiquidityPage/Loadable';
import { NetworkRibbon } from './components/NetworkRibbon/NetworkRibbon';
import { EmailPage } from './containers/EmailPage';
import LendBorrowSovryn from './containers/LendBorrowSovryn';
import { MaintenancePage } from './containers/MaintenancePage';
import { SandboxPage } from './containers/SandboxPage/Loadable';
import { WalletPage } from './containers/WalletPage';
import { BuySovPage } from './pages/BuySovPage';
import { MarginTradePage } from './pages/MarginTradePage/Loadable';

const title =
  currentNetwork !== 'mainnet' ? `Sovryn ${currentNetwork}` : 'Sovryn';

export function App() {
  useAppTheme();
  const { checkMaintenance } = useMaintenance();
  const siteLocked = checkMaintenance('full');
  return (
    <BrowserRouter>
      <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
        <meta name="description" content="Sovryn Lending" />
      </Helmet>
      {siteLocked?.maintenance_active ? (
        <MaintenancePage message={siteLocked?.message} />
      ) : (
        <WalletProvider>
          <NetworkRibbon />
          <Switch>
            <Route exact path="/" component={BuySovPage} />
            <Route exact path="/trade" component={MarginTradePage} />
            <Route exact path="/swap" component={SwapPage} />
            <Route exact path="/lend" component={LendBorrowSovryn} />
            <Route exact path="/stats" component={StatsPage} />
            <Route exact path="/liquidity" component={LiquidityPage} />
            <Route exact path="/sandbox" component={SandboxPage} />
            <Route exact path="/wallet" component={WalletPage} />
            <Route
              exact
              path="/optin-success"
              render={props => <EmailPage {...props} type="OPTIN" />}
            />
            <Route
              exact
              path="/unsubscribe"
              render={props => <EmailPage {...props} type="UNSUBSCRIBE" />}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </WalletProvider>
      )}
      <GlobalStyle />
    </BrowserRouter>
  );
}
