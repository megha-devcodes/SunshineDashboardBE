const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const swaggerDocs = require("./config/swagger");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.set("trust proxy", true);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public/pdfs")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/supervisors", require("./routes/supervisorRoutes"));
app.use("/api/yojana", require("./routes/yojanaRoutes"));
app.use("/api/yojana-list", require("./routes/yojanaListRoutes"));
app.use("/api/yojana-pdf", require("./routes/yojanaPDFRoutes"));
app.use("/api/wallet-transactions", require("./routes/walletRoutes"));
app.use("/api/commissions", require("./routes/commissionRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));
app.use("/api/application", require("./routes/applicationRoutes"));

// Swagger
const PORT = process.env.PORT || 5000;
swaggerDocs(app, PORT);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
