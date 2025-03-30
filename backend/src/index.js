import connect_DB from "./db/index.db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
connect_DB().then(()=>{
    app.listen(8000,()=>{
        console.log(`🧿 Server is running at port : ${process.env.PORT}`)
    }) 
})
.catch((error)=>{ 
    console.log("Mongo DB connection failed || index.js ",console.error())
}) 