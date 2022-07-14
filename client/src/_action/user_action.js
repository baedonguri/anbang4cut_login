import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
} from "./types";

export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/user/login", dataToSubmit)
    .then((response) => response.data);
  // 서버에 데이터를 보낸 후, 서버에서 온 데이터 저장
  // ({loginSuccess: true, userId: user._id})

  // redux의 action -> 이를 dispatch를 통해 reducer로 보냄
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/user/register", dataToSubmit)
    .then((response) => response.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios.get("/api/user/auth").then((response) => response.data);
  return {
    type: AUTH_USER,
    payload: request,
  };
}
