import { useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useHistory } from "react-router-dom";

/* Redirect 주소로 전달받은 code값을 추출 */
const KakaoAuth = () => {
  const REST_API_KEY = "1c16cb196a174ddce815876521f0b5d4";
  const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback";
  const CLIENT_SECRET = "8VaxXb9sOLtW7V5ETHavn4mNcTvouca8";

  // calllback으로 받은 인가코드
  const code = new URL(window.location.href).searchParams.get("code");
  // console.log(code);
  const history = useHistory();

  const getToken = async () => {
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
      client_secret: CLIENT_SECRET,
    });
    // console.log(payload);
    try {
      // access token 가져오기
      const res = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        payload
      );
      // console.log(window.Kakao);
      // Kakao Javascript SDK 초기화
      window.Kakao.init(REST_API_KEY);
      // access token 설정
      window.Kakao.Auth.setAccessToken(res.data.access_token);
      localStorage.setItem("token", res.data.access_token);
      // console.log(res.data.access_token)
      history.replace("/profile");
      // console.log('들어오나?')
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return null;
};

export default KakaoAuth;
