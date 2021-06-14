import React from "react";
import "../../style/Home.scss";
import Header from "../Header"
import UserHome from "./UserHome";
import PublicHome from "./PublicHome";
import LoginBox from "./LoginBox";
import SignupBox from "./SignupBox";
import ForgotPassword from "./ForgotPassword"
import { useLocation, Redirect } from "react-router-dom";
import { useAuthe } from "../../hooks/authe";
import ResetPassword from "./ResetPassword";

function Home() {
  let { pathname } = useLocation();
  let { login } = useAuthe();

 

  if (login && /(login)|(signup)|(forgot)|(reset)/iu.test(pathname)) 

       return <Redirect to="/" />;
  
  else

    return (
  
      <div className="page home-page">
        <Header />

        <main>
          {pathname === "/" && login && <UserHome />}

          {pathname === "/" && !login && <PublicHome />}

          {pathname === "/login" && <LoginBox />}

          {pathname === "/signup" && <SignupBox />}

          {pathname === "/forgot" && <ForgotPassword />}

          {/reset/iu.test(pathname) && <ResetPassword />}
        </main>
      </div>
    );
}

export default Home;
