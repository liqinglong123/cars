var mongoose = require('mongoose');

//加密模块
var crypto = require('crypto');


//定义用户的schema
var userSchema = mongoose.Schema({
    //用户名
    yonghuming: String,
    //密码
    mima : String,
    //头像
    touxiang : String
});

//定义用户的model
var user = mongoose.model('user', userSchema);
exports.findUserByName = function(yonghuming , callback){
    user.findOne({"yonghuming" : yonghuming} , function(err,doc){
        callback(err,doc);
    });
};
exports.adduser = function(yonghuming,mima,callback){
    //先给密码加密
    var jiamidemima = crypto.createHmac('sha256', mima).digest('hex');
    //向数据库保存
    user.create({"yonghuming" : yonghuming , "mima" : jiamidemima},function(err,doc){
        callback(err,doc)
    });
}