var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    shichang  : Number ,
    rent : Number,
    count  : Number,
    select  : String,
    play  : Number,
    mingcheng:String,
    riqi:String,
    amdin:String
});
studentSchema.statics.addStudents = function(json,callback){
    Student.checkSid(json.select,function(torf){
        if(torf){
            //没有被占用，就保存
            var s = new Student(json);
            s.save(function(err){
                if(err){
                    callback(-2);  //服务器错误
                    return;
                }
                callback(1);
            });
        }else{
            callback(-1);
        }
    });
}

//验证学号是否存在
studentSchema.statics.checkSid = function(sid,callback){
    this.find({"select" : sid} , function(err,results){
        callback(results.length == 0);
    });
}
//类
var Student = mongoose.model("zuchu",studentSchema);
//暴露
module.exports = Student;