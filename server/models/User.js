const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken')
const {JsonWebTokenError} = require('jsonwebtoken');

const userSchema = Mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true, // 스페이스와 같은 공백을 없애주는 역할
        unique : 1  // 똑같은 이메일을 쓰지 못하도록
    },
    password : {
        type : String,
        minlength : 5
    },
    imageUrl : {
        type : String
    },
    loginType : {
        type : String
    },
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }
});


userSchema.pre('save', function(next) {
    let user = this;
    // 비밀번호와 관련된 작업이 수행될 경우 salt를 이용한 암호화 수행
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else { // 그외에는 그냥 내보냄 ㅋ
        next();
    }
})

// 로그인 파트 - 비밀번호 비교 작업
userSchema.methods.comparePassword = function(plainPassword, result) {
    // 입력된 비밀번호와 데이터베이스에 있는 암호화된 비밀번호가 같은지 확인하는 작업
    // 평뮨을 암호화해서 비교하는 방식 적용
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return result(err)
        result(null, isMatch); // 일치할 경우
    })
}

// 로그인 파트 - token 생성
userSchema.methods.generateToken = function(result) {
    let user = this;
    // jsonwebtoken을 이용한 토큰 생성
    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token

    user.save(function(err, user) {
        if(err) return result(err);
        result(null, user);
    })
}

userSchema.statics.findByToken = function(token, result) {
    let user = this;

    jwt.verify(token, 'secretToken', function(err, decode){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decode, "token":token}, function(err, user) {
            if (err) return result(err);
            result(null, user);
        })
    });
}


const User = Mongoose.model('User', userSchema);
module.exports = {User}
