var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
    id  : Number ,
    mingcheng : String,
    rent  : Number,
    status  : String,
    class:String,
    jiliang:String
});
studentSchema.statics.addcar = function(json,callback){
    carche.checkSid(json.id,function(torf){
        if(torf){
            var s = new carche(json);
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
    this.find({"mingcheng" : sid} , function(err,results){
        callback(results.length == 0);
    });
}
var carche = mongoose.model("zhulin",studentSchema);
module.exports = carche;