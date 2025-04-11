import app from "./app.js";
import connectDB from "./DB/dbconnect.js";
import { verifyMysqlConnection } from "./DB/mysqldbconnect.js";
import 'dotenv/config'

verifyMysqlConnection()
  .then(()=>{

    connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
          console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        })
      })
      .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
      })

  })
  .catch((err)=>{
    console.log("MySql connection failed did not reached to mongodb",err);
  })
