import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import Kakao from "../../Kakao";
// import KakaoLogin from "../../KakaoLogin"

function LandingPage(props) {

  let history = useHistory();
  const basicRegister = () => {
    history.push("/register");
  };
  const basicLogin = () => {
    history.push('/login');
  }

  return (
    <div>
      <h2>시작 페이지</h2>
    <Kakao/>
      <p>
        <button onClick={basicLogin}>일반 회원 로그인</button>
      </p>
      <p>
        <button onClick={basicRegister}>일반 회원 가입</button>
      </p>
    </div>
  );
}
export default withRouter(LandingPage);
