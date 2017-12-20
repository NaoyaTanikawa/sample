const express = require('express');
const router = express.Router();
var sdb = require('../db');

//ログイン
router.post('/portal', (req, res) => {
    var func = req.body["func"];
    if ( func == "login" ){
        login(req, res);
    } else if ( func == "cancel" ) {
        cancel(req, res);
    }
});
/*
//ユーザの作成
router.post('/api/users',(req,res) => {
    //
});
//すべてのユーザの取得
router.get('/api/users',(req,res) => {
    //
});
//user_idに一致するユーザ情報の取得
router.get('/api/users/:user_id',(req,res) => {
    //
});
//user_idに一致するユーザ情報の更新
router.put('/api/users/:user_id',(req,res) => {
    //
});
//user_idに一致するユーザ情報の削除
router.delete('/api/users/:user_id',(req,res) => {
    //
});
*/
module.exports = router;
