import { createClient } from "redis";

let client;

const redisConnect = async () => {
  if (!client) {
    client = createClient({
      username: "default",
      password: process.env.REDISPASSWORD,
      socket: {
        host: process.env.REDISHOST,
        port: process.env.REDISPORT,
      },
    });

    client.on("error", (err) => console.error("Redis Client Error:", err));

    try {
      await client.connect();
      console.log("Successfully connected to Redis Cloud");
    } catch (error) {
      console.error(" Failed to connect to Redis:", error);
    }
  }

  return client;
};

// Gracefully close the Redis connection on exit
// process.on("SIGINT", async () => {
//   if (client) {
//     await client.quit();
//     console.log("Redis connection closed");
//     process.exit(0);
//   }
// });

export default redisConnect;
