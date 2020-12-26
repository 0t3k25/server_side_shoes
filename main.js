require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");
const PORT = process.env.PORT || 3000;
const cors = require("cors");

//データ情報
const pool = new Pool({
    database: process.env.Database_Name,
    user: process.env.User_Name,
    password: process.env.Pass,
    host: process.env.Host,
    port: process.env.Port,
    ssl: {
        require: true,
        rejectUnauthorized: false,
    },
});

//試し
console.log("接続成功");

//データベースよりcarousel_imageを取得
app.get("/topImage", cors(), (req, res) => {
    pool.query("SELECT * FROM top_img", (err, client) => {
        if (err) {
            console.log("失敗だよーーーーーーーーーーーーーん");
            console.log(err);
        } else {
            //console.log(client.rows);
            res.send(client.rows);
        }
    });
});

//DBより靴の種類を全て取得
app.get("/kind_of_shoes", cors(), (req, res) => {
    pool.query("SELECT * FROM shoes ORDER BY id", (err, client) => {
        if (err) {
            console.log("失敗だよよ1");
            console.log(err);
        } else {
            //console.log(client);
            res.send(client.rows);
        }
    });
});

//DBより靴の種類をメンズ系のみ取得
app.get("/kind_of_shoes/men", cors(), (req, res) => {
    pool.query(
        "SELECT * FROM shoes WHERE sex ='unisex' OR sex = 'man' ORDER BY id",
        (err, client) => {
            if (err) {
                console.log("失敗だよよ2");
                console.log(err);
            } else {
                //console.log(client);
                res.send(client.rows);
            }
        }
    );
});

//DBより靴の種類をレディースのみ取得
app.get("/kind_of_shoes/women", cors(), (req, res) => {
    pool.query(
        "SELECT * FROM shoes WHERE sex ='unisex' OR sex = 'woman' ORDER BY id",
        (err, client) => {
            if (err) {
                console.log("失敗だよよ3");
                console.log(err);
            } else {
                //console.log(client);
                res.send(client.rows);
            }
        }
    );
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
