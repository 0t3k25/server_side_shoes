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
//データベース内のデータを全てとったのちデータを削除
class ope_db {
    constructor(table) {
        this.table = table;
    }
    delete_img_data = async (req, res) => {
        pool.query(`SELECT * FROM ${this.table}`, (err, client) => {
            if (err) {
                console.log("失敗だよーーーーーーーーーーーーーん");
                console.log(err);
            } else {
                console.log(client.rows);
                const data = client.rows;
                return data;
            }
        });
    };
}

//サイト内のtop_imgやcardに関する画像をDBに登録する操作
class db_reg_del_img {
    constructor(table, img) {
        this.table = table;
        this.img = img;
    }
    //画像をDBに登録
    register_img = async () => {
        var query = await {
            text: `INSERT INTO public.${this.table} (thumb) VALUES($1)`,
            values: [this.img],
        };
        await pool.connect((err, client) => {
            if (err) {
                console.log("接続失敗");
                console.log(err);
            } else {
                console.log("接続成功");
                client.query(query).catch((e) => {
                    console.log(e.stack);
                });
            }
        });
    };
    //画像をDBから削除
    delete_img = async () => {
        var query = {
            text: `DELETE FROM ${this.table} WHERE thumb = $1`,
        };

        pool.connect((err, client) => {
            if (err) {
                console.log(err);
            } else {
                console.log("データベース接続成功");
                client.query(query, [this.img]).catch((e) => {
                    console.log("接続失敗");
                    console.log(e.stack);
                });
            }
        });
    };
}
//データ削除および登録
async function get_delete_db() {
    const img_and_id = new db_reg_del_img(
        "top_img",
        "https://storage.googleapis.com/my-kutu-data/top_img/topimg.jpg"
    );
    //関数を変更することにより削除または登録
    const img = await img_and_id.register_img();
    /*for (let i = 0; i < img.length; i++) {
        const delete_ope = new db_reg_del_img("top_img", img[i].thumb);
        const del = await delete_ope.delete_img();
    }*/
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
