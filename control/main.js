var file=require("../model/file.js");
var query=require("../model/query.js");
var qiucar=require("../model/zulin.js");
var zuchu=require("../model/zuchu.js");
var revert=require("../model/revert.js");
var classity=require("../model/classity.js");
var path = require("path");
var url=require("url");
var formidable=require("formidable");
var crypto = require('crypto');
exports.showIndex=function (req,res) {
    res.render("denglu.ejs")
};
exports.regs=function(req,res){
    res.render("zhuce.ejs")
}
exports.checkuserexist = function(req,res,next){
    var queryobj = url.parse(req.url,true).query;
    if(!queryobj.yonghuming){
        res.send("请提供yonghuming参数！");
        return;
    }
    file.findUserByName(queryobj.yonghuming,function(err,doc){
        if(doc){
            res.json({"result" : -1});
        }else{
            res.json({"result" : 0});
        }
    });
};
exports.doreg = function(req,res,next){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        file.findUserByName(yonghuming,function(err,doc){
            if(doc){
                //-1就是用户名存在
                res.json({"result" : -1});
                return;
            }
            file.adduser(yonghuming,mima,function(err,doc){
                if(err){
                    //-2就是服务器错误
                    res.json({"result" : -2});
                    return;
                }
                //注册成功！！
                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                res.json({"result" : 1})
            });
        });
    });
}
exports.checklogin = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        file.findUserByName(yonghuming,function(err,doc){
            if(!doc){
                //-1用户名不存在！！！
                res.json({"result":-1});
                return;
            }
            //密码和密码进行加密比对
            if(crypto.createHmac('sha256', mima).digest('hex') === doc.mima){
                //写session
                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                res.json({"result":1});
                //跳转
                return;
            }else{
                res.json({"result":-2});
                return;
            }
        });
    });
}
exports.dengshow=function (req,res) {
    if(!(req.session.yonghuming )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("index.ejs",{"login": req.session.login,"yonghuming": req.session.yonghuming})
}
exports.showkecha=function (req,res) {
    if(!(req.session.yonghuming )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("query.ejs")
}
//添加
exports.showadd = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        query.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
};
exports.showall=function (req,res) {
    query.find({},function (err,results) {
        res.json({
            "results" : results
        });
    })
}
//改
exports.showupdate=function (req,res) {
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        query.find({"id" : sid},function(err,results){
            console.log(fields.kehu);
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.id = fields.id;
            thestudent.kehu = fields.kehu;
            thestudent.phone = fields.phone;
            thestudent.address = fields.address;
            thestudent.card = fields.card;
            thestudent.jiazhao = fields.jiazhao;
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
exports.showshan=function (req,res) {
        var sid = req.params.sid;
        query.find({"id" : sid},function(err,results){
            if(err || results.length == 0){
                res.json({"result" : -1});
                return;
            }
            results[0].remove(function(err){
                if(err){
                    res.json({"result" : -1});
                    return;
                }
                res.json({"result" : 1});
            });
        });
};
exports.showlease=function (req,res) {
    if(!(req.session.yonghuming )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    query.find({},function (err,results) {
            res.render("zuling.ejs", {
                "results": results,
            });
    })
}
exports.showcar=function (req,res) {
    var myDate = new Date();
    myDate.toLocaleString();
    qiucar.find({},function (err,data) {
        classity.find({},function (err,rdata) {
            res.json({
                "result":data,
                "login": req.session.yonghuming,
                "riqi":myDate,
                "class":rdata
            })
        })

    })
};
exports.showzuchu=function (req,res) {
    var mingcheng=req.params.mingcheng;
    var form = new formidable.IncomingForm();
    qiucar.find({"mingcheng" : mingcheng},function(err,resultes){
        var thestudents = resultes[0];
        thestudents.status ="未出租";
        thestudents.save(function(err){
            if(err){
                res.send("woring")
            }else{
                form.parse(req, function(err, fields, files) {
                    zuchu.addStudents(fields,function(result){
                        res.json({"result" : result});

                    });
                });
            }
        });
    })
};
exports.showgui=function (req,res) {
    if(!(req.session.login )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("revert")
};
exports.showrevert=function (req,res) {
    var myDate = new Date();
    myDate.toLocaleString();
    zuchu.find({},function (err,datas) {
        res.json({
            "result":datas,
            "login": req.session.yonghuming,
            "riqi":myDate
        })
    })
}
exports.showhuan=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(fields)
        //数据库持久
        revert.addStudentsl(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//类别管理
exports.showclass=function (req,res) {
    if(!(req.session.yonghuming )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("classity.ejs")
}
//类别添加
exports.showdoaddclass=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        classity.addclass(fields,function(result){
            res.json({"result" : result});
        });
    });
};
//类别渲染
exports.showclassyonghu=function (req,res) {
    classity.find({},function (err,results) {
        res.json({
            "results" : results
        });
    })
}
//类别删除
exports.showshanclass=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var needToDelete = JSON.parse(fields.needToDelete);
        classity.delete(needToDelete,function(err,n){
            if(err){
                res.send("-1");
            }else{
                res.send(n.toString());
            }
        });
    });
}
//汽车档案
exports.showcarche=function (req,res) {
    if(!(req.session.yonghuming )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("carche.ejs")
}
// 汽车档案增加
exports.showaddcar=function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        qiucar.addcar(fields,function(result){
            res.json({"result" : result});
        });
    });
};
//汽车档案渲染
exports.showyonghucar=function (req,res) {
    qiucar.find({},function (err,results) {
        res.json({
            "results" : results
        });
    })
};
//汽车档案更改
exports.carupdate=function (req,res) {
    var sid = req.params.sid;
    if(!sid){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        qiucar.find({"id" : sid},function(err,results){
            console.log(results);
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }
            var thestudent = results[0];
            //更改属性
            thestudent.id = fields.id;
            thestudent.mingcheng = fields.mingcheng;
            thestudent.class = fields.class;
            thestudent.rent = fields.rent;
            thestudent.jiliang = fields.jiliang;
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
};
//汽车档案删除
exports.showcarshan=function (req,res) {
    var sid = req.params.sid;
    qiucar.find({"id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }
            res.json({"result" : 1});
        });
    });
}
//统计金额
exports.showinfo=function (req,res) {
    if(!(req.session.yonghuming )){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("info.ejs")
}
exports.infozuling=function (req,res) {
    zuchu.find({},function (err,results) {
        res.json({
            "results" : results
        });
    })
}
exports.infogui=function (req,res) {
    revert.find({},function (err,results) {
        res.json({
            "results" : results
        });
    })
}
exports.showtui=function (req,res) {
    req.session.yonghuming="";
   res.render("denglu")
}
