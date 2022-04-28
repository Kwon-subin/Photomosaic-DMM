import React from "react";
import "./App.css";
import "./font/font.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Main from "./page/main/Main";
import Menu from "./page/menu/Menu";
import Store from "./page/store/Store";
import Mypage from "./page/mypage/Mypage";
import Not_found from "./components/not_found/Not_found";
import Render from "./page/render/Render";
import Login from "./components/login/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="wrap">
          <Switch>
            <Route exact path="/" render={() => <Render />} />
            <Route path="/main" component={Main} />
            <Route path="/menu/:area_name/:menu_name" component={Menu} />
            <Route path="/store/:store_id" component={Store} />
            <Route path="/mypage" component={Mypage} />
            <Route path="/login" component={Login} />
            <Route path="*" component={Not_found} />
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
