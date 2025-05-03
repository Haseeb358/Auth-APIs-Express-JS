import mongoose from "mongoose";

function dbConnector() {
  mongoose
    .connect(process.env.DBURL)
    .then(() => {
      console.log("DB Connection is SuccessFull");
    })
    .catch((error) => {
      console.log("Error in Connection with db: ", error);
    });
}
export default dbConnector;
