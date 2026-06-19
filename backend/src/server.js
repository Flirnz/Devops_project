// ==========================================
// 1. IMPORTS (Library / Modul)
// ==========================================

import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";



// ==========================================
// 2. CONFIGURATIONS (Konfigurasi Global)
// ==========================================
dotenv.config(); // Harus di atas sebelum ada kode lain yang membaca process.env
const PORT = process.env.PORT || 5001;


// ==========================================
// 3. DATABASE CONNECTION (Koneksi DB)
// ==========================================
connectDB()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Server started on: http://localhost:${PORT}`)
        });
    })
.catch((error) =>{
    console.error("Server gagal dinyalakan karena koneksi databse gagal: ", error);
});









