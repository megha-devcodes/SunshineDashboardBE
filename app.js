const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/supervisors", require("./routes/supervisorRoutes"));
app.use("/api/yojana", require("./routes/yojanaRoutes"));
app.use("/api/yojana-list", require("./routes/yojanaListRoutes"));
app.use("/api/wallet-transactions", require("./routes/walletRoutes"));
app.use("/api/commissions", require("./routes/commissionRoutes")); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
