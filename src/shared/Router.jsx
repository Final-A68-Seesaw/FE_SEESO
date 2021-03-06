import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import store, { history } from "../redux/configStore";
import { Suspense } from "react";

//pages
//Signup,Login
const AuthRedirectHandler = lazy(() =>
  import(
    /*webpackChunkName: "AuthRedirectHandler"*/ "../auth/AuthRedirectHandler"
  )
);
const Login = lazy(() =>
  import(/*webpackChunkName: "Login"*/ "../pages/Login")
);
const SignupCharacter = lazy(() =>
  import(/*webpackChunkName: "SignupCharacter"*/ "../pages/SignupCharacter")
);
const SignupMBTI = lazy(() =>
  import(/*webpackChunkName: "SignupMBTI"*/ "../pages/SignupMBTI")
);
const Signup = lazy(() =>
  import(/*webpackChunkName: "Signup"*/ "../pages/Signup")
);

//main
const SearchResult = lazy(() =>
  import(/*webpackChunkName: "SearchResult"*/ "../pages/SearchResult")
);
const About = lazy(() =>
  import(/*webpackChunkName: "About"*/ "../pages/About")
);
const Main = lazy(() => import(/*webpackChunkName: "Main"*/ "../pages/Main"));
const StartPage = lazy(() =>
  import(/*webpackChunkName: "StartPage"*/ "../pages/StartPage")
);

//dictionary

const DictAdd = lazy(() =>
  import(/*webpackChunkName: "DictAdd"*/ "../pages/DictAdd")
);
const DictDetail = lazy(() =>
  import(/*webpackChunkName: "DictDetail"*/ "../pages/DictDetail")
);
const DictList = lazy(() =>
  import(/*webpackChunkName: "DictList"*/ "../pages/DictList")
);
const DictDetailEdit = lazy(() =>
  import(/*webpackChunkName: "DictDetailEdit"*/ "../pages/DictDetailEdit")
);
//trouble
const TroubleDetailEdit = lazy(() =>
  import(/*webpackChunkName: "TroubleDetailEdit"*/ "../pages/TroubleDetailEdit")
);
const TroubleAdd = lazy(() =>
  import(/*webpackChunkName: "TroubleAdd"*/ "../pages/TroubleAdd")
);
const TroubleDetail = lazy(() =>
  import(/*webpackChunkName: "TroubleDetail"*/ "../pages/TroubleDetail")
);
const TroubleList = lazy(() =>
  import(/*webpackChunkName: "TroubleList"*/ "../pages/TroubleList")
);

//Mypage
const MyPageEdit = lazy(() =>
  import(/*webpackChunkName: "MyPageEdit"*/ "../pages/MyPageEdit")
);
const MyPageWriting = lazy(() =>
  import(/*webpackChunkName: "MyPageWriting"*/ "../pages/MyPageWriting")
);
const MyPageMyWord = lazy(() =>
  import(/*webpackChunkName: "MyPageMyWord"*/ "../pages/MyPageMyWord")
);
const MyPageScrap = lazy(() =>
  import(/*webpackChunkName: "MyPageScrap"*/ "../pages/MyPageScrap")
);

//Game
const GameMain = lazy(() =>
  import(/*webpackChunkName: "GameMain"*/ "../pages/GameMain")
);
const CrossWord = lazy(() =>
  import(/*webpackChunkName: "CrossWord"*/ "../pages/CrossWord")
);

const Router = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/" exact component={StartPage} />
          <Route path="/about" exact component={About} />

          <Route path="/signup" exact component={Signup} />
          <Route path="/signup/making" exact component={SignupMBTI} />
          <Route
            path="/signup/making/character"
            exact
            component={SignupCharacter}
          />
          <Route path="/login" exact component={Login} />

          <Route
            path="/user/kakao/callback"
            exact
            component={AuthRedirectHandler}
          />

          <Route path="/main" exact component={Main} />
          <Route path="/searchresult/:keyword" exact component={SearchResult} />

          <Route path="/dictionary" exact component={DictList} />
          <Route path="/dictionary/add" exact component={DictAdd} />
          <Route
            path="/dictionary/detail/:cardTitleId"
            exact
            component={DictDetail}
          />
          <Route
            path="/dictionary/detail/:cardTitleId/edit"
            exact
            component={DictDetailEdit}
          />

          <Route path="/trouble" exact component={TroubleList} />
          <Route path="/trouble/detail/:id" exact component={TroubleDetail} />
          <Route path="/trouble/add" exact component={TroubleAdd} />
          <Route
            path="/trouble/detail/:id/edit"
            exact
            component={TroubleDetailEdit}
          />

          <Route path="/mypage/scrap" exact component={MyPageScrap} />
          <Route path="/mypage/myword" exact component={MyPageMyWord} />
          <Route path="/mypage/writing" exact component={MyPageWriting} />
          <Route path="/mypage/edit" exact component={MyPageEdit} />

          <Route path="/gamemain" exact component={GameMain} />
          <Route path="/game" exact component={CrossWord} />
        </Suspense>
      </ConnectedRouter>
    </Provider>
  );
};

export default Router;
