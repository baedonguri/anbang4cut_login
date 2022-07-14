import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_action/user_action";
import { withRouter } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // 적은 내용이 이메일이 서버로 보내지고, 이메일을 찾고 비밀번호를 비교한 후 토큰을 생성해서 쿠키에 저장하여 클라이언트에게 전해줌
    let body = {
      email: Email,
      password: Password,
    };
    /*
        Dispatch 
        : Action Creater로 return 해준 Action을 파라미터로 받아 
          store의 reducer에게 넘겨주는 역할을 해주는 열차
        */
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        props.history.push("/lobby");
      } else {
        alert("로그인에 실패했습니다.");
      }
    });
  };
  console.log("success");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        onSubmit={onSubmitHandler}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label>아이디</label>
        <input type="email" value={Email} placeholder="이메일 형태로 입력하세요" onChange={onEmailHandler}></input>
        <label>비밀번호</label>
        <input
          type="password"
          value={Password}
          onChange={onPasswordHandler}
        ></input>
        <br />
        <button>로그인</button>
        {/* <button>회원가입</button>
        <button style={{background:'yellow'}}>카카오로 시작하기</button>
        <button style={{background:'green'}}>네이버로 시작하기</button> */}
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
