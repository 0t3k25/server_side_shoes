const passport = require("passport");

const GoogleStrategy = require("passport-google").Strategy;
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(passport.initialize());
passport.use(
    new GoogleStrategy(
        {
            returnURL: "http://www.example.com/auth/google/return",
            realm: "http://www.example.com/",
        },
        function (idetifier, profile, done) {
            URLSearchParams.findOrCreate({ openId: identifier }, function (err, user) {
                done(err, user);
            });
        }
    )
);

// 認証のためにユーザーを Google へリダイレクトし、認証が完了すると、
// ユーザーを下記のURLにリダイレクトします。
//     /auth/google/return
app.get("/auth/google", passport.authenticate("google"));

// Google は認証が完了すると、下記のURLにユーザーをリダイレクトさせます。
// 一連のプロセスは、ログインが成功したことを検証することで認証の完了とし、
// さもなければ認証失敗とみなされます。
app.get(
    "/auth/google/return",
    passport.authenticate("google", { successRedirect: "/", failureRedirect: "/login" })
);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
