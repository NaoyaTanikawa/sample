const express = require('express');
const router = express.Router();
var sdb = require('../db');

var fileList = [
    {
        id: "00001",
        name: "file1.txt",
        type: "text",
        category: "pattern1",
        dataUrl: "http://localhost:3001/data/file1.text"
    },{
        id: "00002",
        name: "file2.csv",
        type: "csv",
        category: "pattern2",
        dataUrl: "http://localhost:3001/data/file2.text"
    }
]

router.get('/', (req,res) => {
    var query = req.query.reqName;
    var cObj;
    var dObj;
    if ( !query ) {
        res.render('search', {});
    }
    sdb.connect()
        .then( obj => {  // success to connect
            var sSoql = 'SELECT sfid FROM salesforce.attachment';
            var cSoql = '';//' WHERE Parent.Type IN (\'Account\')';
            var connectA = ' AND ';
            if ( query ) {
                selectIds = query.replace('/api/g',' ').split(' ');
                cSoql += ((cSoql == '') ? 'WHERE ' : connectA) + 'id IN selectIds';
            }
            cObj = obj;
            return cObj.any(sSoql + cSoql);
        })
        .then( data => {  // success to select
            dObj = data;
            if ( data ) {
                if ( data.length == 1 ) {

                } else {
                    res.json(data);
                }
            } else {
                console.log('/api/search data not exist.');
            }
        })
        .catch( error => {    // db query error
            console.log(error);
            res.render('error', {});
        })
    if ( cObj ) {   // release the connection
        cObj.done();
    }
    console.log('/api/search db access closed.');
})
router.get('/filelist', (req,res) => {
    res.json(fileList);
})
router.get('/:fileid', (req,res) => {
    var file;
    for ( i = 0; i < fileList.length; i++ ) {
        if( fileList[i].id == req.params.fileid ) {
            var file = fileList[i];
        }
    }
    res.json(file);
})

module.exports = router;
