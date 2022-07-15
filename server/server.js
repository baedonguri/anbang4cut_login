const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Mongoose = require("mongoose");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");


// const localUserRouter = require("./routers/localUserRouter");
const kakaoRouter = require("./routers/kakaoLogin");
const { application } = require("express");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // 토큰을 쿠키에 저장하기 위해 사용
Mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

/* ===================회원가입======================== */
app.post("/api/user/register", function (req, res) {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  // 정보 저장, 에러 시 json 형식으로 전달
  user.save((err, userInfo) => {
    // console.log(err);
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

/* ===============로그인 및 토큰 생성==================== */
app.post("/api/user/login", function (req, res) {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        msg: "일치하는 회원 정보가 존재하지 않습니다.",
      });
    }
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    if (req.body.loginType === "Local") {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({
            loginSuccess: false,
            msg: "비밀번호가 일치하지 않습니다.",
          });
      });
    }

    // 비밀번호까지 맞다면 토큰을 생성
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);

      // 정상적일 경우 토큰을 쿠키나 로컬스토리지 등에 저장
      // 쿠키에 저장
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});

/* ===================auth 인증======================== */
app.get("/api/user/auth", auth, function (req, res) {
  // 클라이언트에게 유저 정보 전달
  res.status(200).json({
    _id: req.user.id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    // role: req.user.role,
  });
});

/* ===================로그아웃======================== */
app.get("/api/user/logout", auth, function (req, res) {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
// app.use("/api/user", localUserRouter);

/* =================================================
 *               social Login
 * =================================================*/
app.post('/api/user/kakaoLogin', function(req,res){
  const text = req.body.name;
  console.log(text);
});

app.use("/oauth", kakaoRouter);

app.listen(8080, () => console.log("Listing on 8080...."));
