import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LobbyPage from "./components/views/LobbyPage/LobbyPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from "./hoc/auth";
import Kakao from "./components/Kakao";
import KakaoAuth from "./components/KakaoAuth"
import Profile from "./Profile";
function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* SpecificComponent, option, adminRoute = null */}
          <Route exact path="/" component={Auth(LandingPage, false, null)}/>
          <Route exact path="/login" component={Auth(LoginPage, false, null)} />
          <Route exact path="/register" component={Auth(RegisterPage, false, null)}/>
          <Route exact path="/lobby" component={Auth(LobbyPage, true, null)}/>
          <Route path="/oauth/kakao/callback">
            <KakaoAuth/>
          </Route>
          <Route path="/profile">
            <Profile/>
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
