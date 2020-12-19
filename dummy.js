require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
const format = require("pg-format");
const PORT = process.env.PORT || 3001;

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

const arr = [];
for (let i = 0; i < 20; i++) {
    arr.push(["mizuki"]);
}
console.log(arr);

//データベースからデータを取得
app.get("/database", cors(), (req, res) => {
    pool.query("SELECT * FROM brands", (err, client) => {
        if (err) {
            console.log(err);
        } else {
            console.log(client.rows);
            res.send(client.rows);
        }
    });
});

//バルクインサート
app.post("/dummy", (req, res) => {
    const query = format("INSERT INTO kind_of_shoes (category) VALUES %L ", arr);
    console.log(arr);
    console.log(query);
    pool.query(query);
});

//データ追加
app.post("/create1", (req, res) => {
    var query = {
        text: 'INSERT INTO public."brands"(name) VALUES($1)',
        values: ["CONVERSE"],
    };
    pool.connect((err, client) => {
        if (err) {
            console.log(err);
        } else {
            client
                .query(query)
                .then(() => {
                    res.send("Data Created");
                })
                .catch((e) => {
                    console.log(e.stack);
                });
        }
    });
});

app.get("/database", cors(), (req, res) => {
    pool.query("SELECT * FROM brands", (err, client) => {
        if (err) {
            console.log(err);
        } else {
            console.log(client.rows);
            res.send(client.rows);
        }
    });
});

//データ追加
app.post("/create4", (req, res) => {
    var query = {
        text:
            'INSERT INTO public."kutu_data"(brand_name,kutu_name,img_url,brand_id,men,women,category_name) VALUES($1,$2,$3,$4,$5,$6,$7)',
        values: ["Under Armour", "aa", "aa", "3", , , "スニーカー"],
    };
    pool.connect((err, client) => {
        if (err) {
            console.log(err);
        } else {
            client
                .query(query)
                .then(() => {
                    res.send("Data Created");
                })
                .catch((e) => {
                    console.log(e.stack);
                });
        }
    });
});

app.post("/creat_carousel", (req, res) => {
    var query = {
        text: 'INSERT INTO public."carousel-img"(img) VALUES($1)',
        values: ["https://storage.googleapis.com/my-kutu-data/Carousel-img/slide2.jpg"],
    };
    pool.connect((err, client) => {
        if (err) {
            console.log(err);
        } else {
            client
                .query(query)
                .then(() => {
                    res.send("Data Created");
                })
                .catch((e) => {
                    console.log(e.stack);
                });
        }
    });
});

//バルクインサート途中
/*app.post('/bulk_insert' ,(req,res) => {
const various_shoes_type = 'INSERT INTO public."kind_of_shoes"(category) VALUES($1)',
})*/

//バルクインサート
app.post("/shoes_image", (req, res) => {
    const query = format("INSERT INTO kind_of_shoes (category) VALUES %L ", arr);
    console.log(arr);
    console.log(query);
    pool.query(query);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
