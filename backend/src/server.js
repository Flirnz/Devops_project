// 1. IMPORTS
// ==========================================

import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";



// 2. CONFIGURATIONS
// ==========================================
dotenv.config(); // Must be at the top before any other code reads process.env
const PORT = process.env.PORT || 5001;


// 3. DATABASE CONNECTION
// ==========================================
connectDB()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server started on: http://localhost:${PORT}`)
        });
    })
.catch((error) =>{
    console.error("Server failed to start because database connection failed: ", error);
});









