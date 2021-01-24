require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");
const PORT = process.env.PORT || 3000;
const cors = require("cors");

//試し
console.log("接続成功");

//データベースよりcarousel_imageを取得
app.get("/hello", cors(), (req, res) => {
    //console.log(client.rows);
    res.send("hello world");
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
