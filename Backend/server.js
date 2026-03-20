import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
initSocket(server);

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});