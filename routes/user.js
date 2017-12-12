const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    var func = req.body["func"];
    if ( func == "login" ){
        login(req, res);
    } else if ( func == "cancel" ) {
        cancel(req, res);
    }
});

module.exports = router;
