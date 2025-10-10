// Minimal server to accept captures. In a real project you'll run AI pipelines here.
// Run: npm init -y && npm i express body-parser


const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({limit: '20mb'}));


const DB_FOLDER = path.join(__dirname, 'captures');
if(!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER);


app.post('/api/capture', (req,res) => {
try{
const data = req.body;
const id = Date.now() + '-' + Math.random().toString(36).slice(2,8);
const filename = path.join(DB_FOLDER, id + '.json');
fs.writeFileSync(filename, JSON.stringify(data, null, 2));
console.log('Saved capture', filename);
// TODO: kick off async AI processing (summarize, embed, tag)
res.json({ok:true, id});
}catch(err){
console.error(err);
res.status(500).json({ok:false});
}
});


const PORT = 4000;
app.listen(PORT, ()=> console.log('Capture server listening on', PORT));