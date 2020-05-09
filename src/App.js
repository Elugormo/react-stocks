import React from 'react';
import logo from './logo.svg';
import './App.styles';
import { TopNavAppContainer, AppContainer } from './App.styles';
import TopNav from './components/topNav/TopNav';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Details from './components/details/Details';
import Profile from './components/profile/Profile';
import Portfolio from './components/portfolio/Portfolio';
import Search from './components/search/Search';
import Home from './components/home/Home';
import FinanceContextProvider from './Context';
function App() {
  return (
   <>
   <BrowserRouter>
      <FinanceContextProvider>
        <TopNavAppContainer>
          <TopNav />
        </TopNavAppContainer>

      <AppContainer>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/profile" component={Profile} />
          <Route path="/:name" component={Details} />
        </Switch>
      </AppContainer>

      </FinanceContextProvider>
      </BrowserRouter>
   </>
  );
}

export default App;
