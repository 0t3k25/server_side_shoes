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

//DBよりメンズにオススメの靴を取得
app.get("/kind_of_shoes/men", cors(), (req, res) => {
    pool.query(
        "SELECT * FROM kinds WHERE gender ='unisex' OR gender='man' ORDER BY id",
        (err, client) => {
            if (err) {
                console.log("失敗だよよ1");
                console.log(err);
            } else {
                //console.log(client);
                res.send(client.rows);
            }
        }
    );
});

//DBよりレディースにオススメの靴を取得
app.get("/kind_of_shoes/women", cors(), (req, res) => {
    pool.query(
        "SELECT * FROM kinds WHERE gender ='unisex' OR gender = 'woman' ORDER BY id",
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

//DBよりオススメのアパレルを取得
app.get("/kind_of_shoes/other", cors(), (req, res) => {
    pool.query("SELECT * FROM kinds ORDER BY id", (err, client) => {
        if (err) {
            console.log("失敗だよよ3");
            console.log(err);
        } else {
            //console.log(client);
            res.send(client.rows);
        }
    });
});
//メンズ製品一覧取得
app.get("/category/men", cors(), (req, res) => {
    pool.query("SELECT * FROM sepa_category ORDER BY num", (err, client) => {
        if (err) {
            console.log("失敗だよよ3");
            console.log(err);
        } else {
            //console.log(client);
            res.send(client.rows);
        }
    });
});
//レディース製品一覧取得
app.get("/category/women", cors(), (req, res) => {
    pool.query("SELECT * FROM sepa_category ORDER BY num", (err, client) => {
        if (err) {
            console.log("失敗だよよ3");
            console.log(err);
        } else {
            //console.log(client);
            res.send(client.rows);
        }
    });
});
//アパレル製品一覧
app.get("/category/apparel", cors(), (req, res) => {
    pool.query("SELECT * FROM sepa_category ORDER BY num", (err, client) => {
        if (err) {
            console.log("失敗だよよ3");
            console.log(err);
        } else {
            //console.log(client);
            res.send(client.rows);
        }
    });
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
