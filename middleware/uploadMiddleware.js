const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "./uploads/others";
    const appType = req.body.applicationType;

    switch (file.fieldname) {
      case "photo":
        folder =
          appType === "supervisor"
            ? "./uploads/supervisor/photos"
            : "./uploads/yojana/photos";
        break;
      case "signature":
        folder =
          appType === "supervisor"
            ? "./uploads/supervisor/signatures"
            : "./uploads/yojana/signatures";
        break;
      case "identityDocument":
        folder = "./uploads/yojana/identityDocuments";
        break;
      case "attachedDocument":
        folder = "./uploads/supervisor/attachedDocuments";
        break;
      default:
        folder = "./uploads/others";
    }

    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = upload;
