import mongoose from "mongoose"
import dns from "node:dns"

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB terhubung");
    } catch (error) {
        console.log(`Gagal terhubung ke database: ${error.message}`);
        process.exit(1);
    }
}
