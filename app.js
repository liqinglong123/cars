var express=require("express");
var app=express();
var main=require("./control/main.js");
var mongoose = require('mongoose');
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
mongoose.connect('mongodb://localhost/shuoshuo');
app.set('view engine', 'ejs');
app.use('/public',express.static('public'));
app.get("/",main.showIndex);
app.get("/checkuserexist",main.checkuserexist);
app.post("/doreg",main.doreg);
app.get("/reg",main.regs);
app.post("/checklogin",main.checklogin);
app.get("/shou",main.dengshow);
//客户查询
app.get("/kecha",main.showkecha);
app.post("/doadd",main.showadd);
app.get("/yonghu",main.showall);
app.post("/update/:sid",main.showupdate);
app.delete("/shan/:sid",main.showshan);
//租赁
 app.get("/lease",main.showlease);
 app.get("/qiucar",main.showcar);
 app.post("/zuchu/:mingcheng",main.showzuchu);
 //归还登记
app.get("/revert",main.showgui);
app.get("/qiurevert",main.showrevert);
app.post("/guihuan",main.showhuan);
//类别管理
app.get("/classify",main.showclass);
app.post("/doaddclass",main.showdoaddclass);
app.get("/classyonghu",main.showclassyonghu);
app.post("/shanclass",main.showshanclass);
//汽车归档
app.get("/carche",main.showcarche);
app.post("/addcar",main.showaddcar);
app.get("/yonghucar",main.showyonghucar);
app.post("/carupdate/:sid",main.carupdate);
app.get("/carshan/:sid",main.showcarshan);
//统计分析
app.get("/info",main.showinfo);
app.get("/infozuling",main.infozuling);
app.get("/infogui",main.infogui);
app.get("/tuichu",main.showtui)
app.listen(3005);
console.log("3000运行了") ;