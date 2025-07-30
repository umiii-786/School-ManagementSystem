const mongoose=require('mongoose')
async function Connect_To_DB(db_url){
    return mongoose.connect(db_url)
}
module.exports={
    Connect_To_DB
}