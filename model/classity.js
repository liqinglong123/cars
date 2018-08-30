var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    id  : Number ,
    leibie : String,
});
studentSchema.statics.addclass = function(json,callback){
    classity.checkSid(json.id,function(torf){
        if(torf){
            var s = new classity(json);
            s.save(function(err){
                if(err){
                    callback(-2);
                    return;
                }
                callback(1);
            });

        }else{
            callback(-1);
        }
    });
}
studentSchema.statics.checkSid = function(sid,callback){
    this.find({"leibie" : sid} , function(err,results){
        callback(results.length == 0);
    });
}
studentSchema.statics.delete = function(arr,callback){
    var _arr = [];
    arr.forEach(function(item){
        _arr.push({"_id" : item});
    });
    this.remove({$or : _arr},function(err,r){
        callback(err,r.n);
    });
};

var classity = mongoose.model("classity",studentSchema);
module.exports = classity;