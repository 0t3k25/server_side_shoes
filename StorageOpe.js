require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");
const format = require("pg-format");
const fs = require("fs");
const path = require("path");
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
//目的のディレクトリ
const dir = "../../port_ref/ABC-MARTオンラインストア-靴通販やスニーカー・シューズ情報_files";
//対象ディレクトリから子一覧取得
const fileNames = fs.readdirSync(dir);
//拡張子で抽出
const targetFile = fileNames.filter(RegExp.prototype.test, /.*\.svg$/);
//環境変数
const env_path = process.env.NODE_PATH;
//ストレージに関して
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
    projectId: process.env.Project_Id,
    keyFilename: env_path,
});
//開放ポート
const PORT = process.env.PORT || 3002;

//エンコード
function encode(pre_img) {
    let binary_data = fs.readFileSync(pre_img);
    let encoded_data = binary_data.toString("base64");
    //console.log(encoded_data);
    return encoded_data;
}

/*for (let i = 0;i < targetFile.length;i++){
    encode(`${dir}/${targetFile[i]}`);
}*/

//デモデータとして下の関数のみで使用
let product_associate_arr = [
    { name: "スニーカー", sex: "unisex" },
    { name: "ランニング", sex: "unisex" },
    { name: "カジュアル", sex: "unisex" },
    { name: "パンプス", sex: "woman" },
    { name: "ブーツ", sex: "man" },
    { name: "レディースブーツ", sex: "woman" },
    { name: "サンダル", sex: "unisex" },
    { name: "ケア用品", sex: "NULL" },
];

//製品情報と製品画像のURL
function make_pro_Arr(pro_name, pro_img_url) {
    let pro_Info_Img = {};
    pro_Info_Img.production_name = `${pro_name}`;
    pro_Info_Img.production_image = `${pro_img_url}`;
    console.log(pro_Info_Img);
    return pro_Info_Img;
}

//製品情報および製品イメージ(base64変換の)JSONデータ
/*for (let i = 0;i<3;i++) {
    make_Associative_Arr(`${product_info[i]}`,`${dir}/${targetFile[i]}` )
}*/
//デコード
function decodeBase64Image(dataString) {
    response = new Buffer.from(dataString, "base64");
    //console.log(response);
    return response;
}

//エンコードおよびデコードの確認用
/*let abc = encode(`${dir}/${targetFile[0]}`);
console.log(abc);
let xyz = decodeBase64Image(abc);
console.log(xyz);*/

//base64データをファイルにする関数
//データをファイルに書きこみ
function draw_file(product_name, data) {
    // 書き込み
    fs.writeFileSync(`${product_name}.png`, data, (err) => {
        if (err) {
            throw err;
        } else {
            console.log("ファイル書き込み成功");
        }
    });
}

//クラウドストレージにファイルをアップロードするための関数
function upload_file(filename) {
    const bucketName = "my-kutu-data";
    const options = {
        destination: `kind_of_kutu/${filename}`,
        gzip: true,
        metadata: {
            cacheControl: "public, max-age=31536000",
        },
    };
    function uploadFile() {
        storage.bucket(bucketName).upload(path.resolve(filename), options);
        console.log(`${filename} uploaded to ${bucketName}/kind_of_kutu.`);
    }
    uploadFile();
}

//画像のURL取得
function get_url(file_name) {
    const bucketName = "my-kutu-data";
    const dir_name = "category";
    console.log("url取得成功");
    return `https://storage.googleapis.com/${bucketName}/${dir_name}/${file_name}`;
}

function delete_DB(name) {
    const bucketName = "kinds";
    var query = {
        text: `DELETE FROM ${bucketName} WHERE product_name = $1`,
    };
    pool.connect((err, client) => {
        if (err) {
            console.log(err);
        } else {
            console.log("データベース接続成功");
            client.query(query, [name]).catch((e) => {
                console.log("接続失敗");
                console.log(e.stack);
            });
        }
    });
}
/*
idによるデータベースの削除
for (let i = 0; i < 8; i++) {
    delete_DB(i);
}*/

//クラウドストレージのURLを受け取りDBに商品情報などと関連させて流す
function register_DB(product_num, product_name, product_img_url, gender, product_info) {
    var query = {
        text:
            'INSERT INTO public."kinds" (id,product_name,product_img_url,gender,product_info) VALUES($1,$2,$3,$4,$5)',
        values: [product_num, product_name, product_img_url, gender, product_info],
    };
    pool.connect((err, client) => {
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
}
//categoryのtableに登録
function register_category_DB(product_num, product_name, product_img_url) {
    var query = {
        text:
            'INSERT INTO public."sepa_category" (id,category_name,category_img_url) VALUES($1,$2,$3)',
        values: [product_num, product_name, product_img_url],
    };
    pool.connect((err, client) => {
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
}

//DBのcategoryに登録
for (let i = 6; i < 9; i++) {
    const file_name = ["メンズシューズ", "レディースシューズ", "アパレル"];
    const file = ["メンズシューズ.jpg", "レディースシューズ.jpg", "アパレル.jpeg"];
    register_category_DB(i, file_name[i], get_url(file[i]));
}

//register_DB(2, "ブーツ", get_url("ブーツ.jpg"), "men", "アウトドアに最適");

//全ての処理(エンコードからDB登録)をまとめた関数
function main(product_num, product_name, target_file, sex) {
    //エンコード
    let encoded_data = encode(target_file);
    //デコード
    let decode = decodeBase64Image(encoded_data);
    //同じフォルダ内にファイル作成
    draw_file(product_name, decode);
    //クラウドストレージにファイルアップロード
    upload_file(`${product_name}.svg`);
    //クラウドストレージ内のkind_of_kutuファイルの画像URL取得
    let pro_img_url = get_url(product_name);
    //製品の情報と製品イメージを配列にする
    let AssociateArr = make_pro_Arr(product_name, pro_img_url);
    //Googleクラウドストレージのファイルを受け取りDBに商品情報と関連させて流す
    register_DB(product_num, product_name, pro_img_url, sex);
}

/*for (let i = 0; i < product_associate_arr.length; i++) {
    main(
        Number([i]),
        product_associate_arr[i].name,
        `${dir}/${targetFile[i]}`,
        product_associate_arr[i].sex
    );
}*/
/*for (let i = 0; i < product_associate_arr.length; i++) {
    delete_DB(product_associate_arr[i].name);
}*/

//delete_DB("kids");
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
