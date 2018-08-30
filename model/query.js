var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    id  : Number ,
    kehu : String,
    phone  : Number,
    address  : String,
    card  : Number,
    jiazhao  : Number,
});
studentSchema.statics.addStudent = function(json,callback){
    Student.checkSid(json.id,function(torf){
        if(torf){
            //没有被占用，就保存
            var s = new Student(json);
            s.save(function(err){
                if(err){
                    callback(-2);  //服务器错误
                    return;
                }
                //发回1这个状态
                callback(1);
            });

        }else{
            //学号被占用了，返回-1
            callback(-1);
        }
    });
}

//验证学号是否存在
studentSchema.statics.checkSid = function(sid,callback){
    this.find({"id" : sid} , function(err,results){
        callback(results.length == 0);
    });
}

//类
var Student = mongoose.model("kehuquery",studentSchema);

//暴露
module.exports = Student;