require("dotenv").config();
const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const cors = require("cors");
const axios = require("axios");
//環境変数
const env_path = process.env.NODE_PATH;
//ストレージに関して
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
    projectId: process.env.Project_Id,
    keyFilename: env_path,
});
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
const PORT = process.env.PORT || 3000;

//ABCmart内のデータ獲得
class ABCmart_scraping {
    constructor(url, first_num, last_num) {
        this.first_num = first_num;
        this.last_num = last_num;
        this.url = url;
    }
    //スクレイピングする場所特定して取得する関数
    //last.numでfor分の回数指定
    get_pro_info_arr = async () => {
        const browser = await puppeteer.launch({ headless: false });
        //連想配列を入れる配列
        const information_arr = [];
        try {
            const page = await browser.newPage();
            await page.goto(this.url, {
                waitUntil: "networkidle2",
            });
            //靴の種類をスクレイピング
            const shoes_type_path = await page.$("h1,category_name_");
            const shoes_type = await (await shoes_type_path.getProperty("textContent")).jsonValue();
            console.log(shoes_type);
            information_arr.push(shoes_type);
            for (let i = this.first_num; i < this.last_num; i++) {
                //個々のurl、値段、ブランド、性別、商品名を入れる連想配列
                let associate_arr = {};
                //スクレイピングしたい要素の一番上の階層
                const item_information_top_path = await page.$$("div.StyleT_Item_");
                //urlまでのパス
                const url_path = await item_information_top_path[i].$x(".//img");
                //url取得、配列へ流す
                const url = await url_path[0].evaluate((el) => el.getAttribute("data-src"));
                //const long_url = await url_path[0].evaluate((el) => el.getAttribute("data-src"));
                //const url = long_url.split("?");
                associate_arr.url = url;
                //値段までのパス
                /*const price_path = await item_information_top_path[i].$x(
                    '//dl/dd[@class="goods-content_price-red"]'
                );
                //値段取得、配列へ流す
                const price = await (await price_path[0].getProperty("textContent")).jsonValue();
                associate_arr.price = price;*/
                //ブランドまでのパス
                const brand_name_path = await item_information_top_path[i].$x(
                    './/p[@class="name1_"]'
                );
                //ブランド名取得、配列へ流す
                const brand_name = await (
                    await brand_name_path[0].getProperty("textContent")
                ).jsonValue();
                associate_arr.brand_name = brand_name;
                //商品名までのパス
                const product_name_path = await item_information_top_path[i].$x(
                    './/p[@class="name2_"]'
                );
                //商品名取得、配列へ流す
                const product_name = await (
                    await product_name_path[0].getProperty("textContent")
                ).jsonValue();
                associate_arr.product_name = product_name;
                //性別までのパス
                const gender_path = await item_information_top_path[i].$x(
                    './/div[@class="goods-content-inner"]/div'
                );
                //性別取得、配列へ流す
                const gender = await (await gender_path[0].getProperty("textContent")).jsonValue();
                associate_arr.gender = gender;
                //連想配列を配列に挿入
                information_arr.push(associate_arr);
                //出力結果
                //console.log(gender);
                //console.log(url);
                //console.log(price);
                //console.log(brand_name);
                //console.log(product_name);
                //console.log(associate_arr);
            }
            //console.log(information_arr);
        } catch (e) {
            console.log(e);
        }
        await browser.close();
        //console.log(information_arr);
        return information_arr;
    };
}

//urlをbuffer
class read_url {
    constructor(url) {
        this.url = url;
    }
    create_binary = async () => {
        let image_url = this.url;
        //console.log(image_url);
        request(image_url, function (err, response, buffer) {
            console.log(buffer);
            return buffer;
            //binary_data
            //console.log(buffer);
            let encoded_data = buffer.toString("base64");
            //console.log(encoded_data);
            response = new Buffer.from(encoded_data, "base64");
            //console.log(response);
            return response;
        });
    };
}

class cloud_ope {
    constructor(file_name, url) {
        this.file_name = file_name;
        this.url = url;
    }
    //ファイルに書き込み
    get_buffer = async () => {
        const file = await this.file_name;
        console.log(file);
        //console.log(image_url);
        const res = await axios.get(this.url, { responseType: "arraybuffer" });
        return res.data;
    };
    upload_file = async () => {
        const bucketName = "my-kutu-data";
        const url = await this.get_buffer();
        const file = storage.bucket(bucketName).file(`product/${this.file_name}.png`);
        file.save(url, function (err) {
            console.log(err);
        });
    };
    //クラウドストレージにファイルをアップロードするための関数
    /*upload_file = async () => {
        const bucketName = "my-kutu-data";
        const options = await {
            destination: `product/${this.file_name}`,
            gzip: true,
            metadata: {
                cacheControl: "public, max-age=31536000",
            },
        };
        const uploadFile = async () => {
            await storage.bucket(bucketName).upload(path.resolve(`${this.file_name}.png`), options);
            await console.log(`${this.file_name}.png uploaded to ${bucketName}/product`);
        };
        uploadFile();
    };*/
    //クラウドに存在する画像のURL取得
    get_url = async () => {
        const bucketName = "my-kutu-data";
        console.log("url取得成功");
        console.log(`https://storage.googleapis.com/${bucketName}/product/${this.file_name}.png`);
        return `https://storage.googleapis.com/${bucketName}/product/${this.file_name}.png`;
    };
    ordering = async () => {
        await this.save_file();
        this.upload_file();
    };
}

//DB登録クラスで定義
class db_ope {
    constructor(product_name, brand_name, product_url, gender, product_type) {
        this.product_name = product_name;
        this.brand_name = brand_name;
        this.product_url = product_url;
        this.gender = gender;
        this.product_type = product_type;
    }
    //データベースに登録
    register_DB = async () => {
        var query = await {
            text: `INSERT INTO public. "shoes_data_test" (product_name,brand_name,product_url,gender,product_type) VALUES($1,$2,$3,$4,$5)`,
            values: [
                this.product_name,
                this.brand_name,
                this.product_url,
                this.gender,
                this.product_type,
            ],
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
}

//全ての操作
async function run_arr() {
    try {
        const sneaker = new ABCmart_scraping(
            "https://www.abc-mart.net/shop/c/c71_srank/#goodslist",
            0,
            5
        );
        const sneaker_arr = await sneaker.get_pro_info_arr();
        //sneaker_arr[0]には靴の種類が入っており、[1]から商品情報が入っている
        //console.log(sneaker_arr[1]);
        for (let i = 1; i < 6; i++) {
            const pic_upload = new cloud_ope(sneaker_arr[i].product_name, sneaker_arr[i].url);
            //console.log(sneaker_arr[0].product_name);
            pic_upload.upload_file();
            const cloud_url = await pic_upload.get_url();
            //console.log(cloud_url);
            /*const db = new db_ope(
                sneaker_arr[i].product_name,
                sneaker_arr[i].brand_name,
                cloud_url,
                sneaker_arr[i].gender,
                sneaker_arr[0]
            );
            db.register_DB();*/
        }
    } catch (e) {
        console.log(e);
    }
}
run_arr();

//消去操作
function delete_DB(value) {
    var query = {
        text: "DELETE FROM shoes_data_test WHERE product_name = $1",
    };
    pool.connect((err, client) => {
        if (err) {
            console.log(err);
        } else {
            console.log("データベース接続成功");
            client.query(query, [value]).catch((e) => {
                console.log("接続失敗");
                console.log(e.stack);
            });
        }
    });
}
//delete_DB("スタンスミス");

//最終目的
//パペティアを用いjson形式でデータをとりファイルに書き込む
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
