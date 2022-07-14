const express = require("express");
const router = express.Router();
const winston = require("winston");
const logger = winston.createLogger();
const qs = require("qs");
const fetch = require("node-fetch");
const { User } = require("../models/User");
const axios = require("axios");

class Kakao {
  constructor(code) {
    this.url = "https://kauth.kakao.com/oauth/token";
    this.clientID = "1c16cb196a174ddce815876521f0b5d4";
    this.clientSecret = "8VaxXb9sOLtW7V5ETHavn4mNcTvouca8";
    this.redirectUri = "http://localhost:8080/oauth/kakao";
    this.code = code;
    // userInfo
    this.userInfoUrl = "https://kapi.kakao.com/v2/user/me";
  }
}
const getAccessToken = async (options) => {
  try {
    return await fetch(options.url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: qs.stringify({
        grant_type: "authorization_code", //특정 스트링
        client_id: options.clientID,
        client_secret: options.clientSecret,
        redirectUri: options.redirectUri,
        code: options.code,
      }),
    }).then((res) => res.json());
  } catch (e) {
    logger.info("error", e);
  }
};

const getUserInfo = async (url, access_token) => {
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json());
  } catch (e) {
    logger.info("error", e);
  }
};

const getOption = (coperation, code) => {
  switch (coperation) {
    case "kakao":
      return new Kakao(code);
    case "naver":
      // return new Naver(code);
      break;
  }
};
// 이메일
// id : 2340171614

router.get(`/:coperation`, async (req, res) => {
  const coperation = req.params.coperation;
  const code = req.param("code");
  const options = getOption(coperation, code);
  const token = await getAccessToken(options);
  const userInfo = await getUserInfo(options.userInfoUrl, token.access_token);

  //   console.log(token)
  const body = {
    name: userInfo.properties.nickname,
    email: userInfo.kakao_account.email,
    imageUrl: userInfo.properties.profile_image,
    loginType: "kakao",
  };
  
  const user = new User(body);

  user.save((err, userInfo) => {
    //   res.send('<a href="localhost:3000/login">이동</a>');
    // if (err) return res.json({ success: false, err });
  });
//   axios.get()
    res.send(userInfo);
  //   res.render('/login');
});

module.exports = router;
