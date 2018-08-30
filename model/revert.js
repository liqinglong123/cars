var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    mingcheng  : String ,
    yifu : Number,
    yingfu  : Number,
    zhaoling  : Number,
    people:String,
    riqi:String,
    amdin:String
});
studentSchema.statics.addStudentsl = function(json,callback){
    Student.checkSid(json.mingcheng,function(torf){
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
    this.find({"mingcheng" : sid} , function(err,results){
        callback(results.length == 0);
    });
}
var Student = mongoose.model("revert",studentSchema);
module.exports = Student;