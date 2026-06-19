import cors from "cors";
import express from "express";
import path from "path";
import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js"
// ==========================================
// 4. INITIALIZATION (Inisialisasi App)
// ==========================================
const app = express();
const __dirname = path.resolve();

// ==========================================
// 5. GLOBAL MIDDLEWARES (Middleware untuk semua Rute)
// ==========================================
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"]
    })
);
}

app.use(express.json()); // Diletakkan di atas agar SEMUA rute di bawah bisa membaca JSON
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*splat", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
} else {
    // Jika masih di mode development, biarkan rute tes ini aktif
    app.get("/", (req, res) => {
        res.send("API Server is running...");
    });
}

export default app