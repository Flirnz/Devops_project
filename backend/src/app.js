import cors from "cors";
import express from "express";
// SonarQube recommendation: Use 'node:' prefix for built-in modules to avoid ambiguity
import path from "node:path";
import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js"
// ==========================================
// ==========================================
// 4. INITIALIZATION
// ==========================================
// ==========================================
const app = express();
// SonarQube recommendation: Disable X-Powered-By header to prevent technology/version disclosure
app.disable('x-powered-by');
const __dirname = path.resolve();

// ==========================================
// ==========================================
// 5. GLOBAL MIDDLEWARES
// ==========================================
// ==========================================
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"]
    })
);
}

app.use(express.json()); // Placed above to allow all downstream routes to read JSON body
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*splat", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
} else {
    // If in development mode, keep this test route active
    app.get("/", (req, res) => {
        res.send("API Server is running...");
    });
}

export default app