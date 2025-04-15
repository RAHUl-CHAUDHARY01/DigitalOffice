import app from "./app.js";
import mongoConnectDb from "./DB/mongodbconnect.js";
import { verifyMysqlConnection } from "./DB/mysqldbconnect.js";
import 'dotenv/config'

verifyMysqlConnection()
  .then(()=>{

    mongoConnectDb()
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
    console.log("Error Connecting...",err);
  })
