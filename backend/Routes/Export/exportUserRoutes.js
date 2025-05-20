const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


router.post("/export-csv", (req, res) => {
  const users = req.body.users; // Get users from frontend

  if (!users || users.length === 0) {
    return res.status(400).json({ message: "No user data provided" });
  }

  // Convert data to CSV format
  const csvContent = [
    ["User ID", "Username", "Name", "Email", "Phone", "Type", "Gender", "Birthday"],
    ...users.map(user => [
      user.userId,
      user.userName,
      user.name,
      user.email,
      user.phone,
      user.type,
      user.gender,
      new Date(user.birthday).toLocaleDateString(),
    ]),
  ]
    .map(e => e.join(","))
    .join("\n");

  // Define file path
  const filePath = path.join(__dirname, "../../../frontend/src/Components/Admin/Database/user-details.csv");

  // Ensure directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Write CSV file
  fs.writeFile(filePath, csvContent, "utf8", (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Error saving CSV file" });
    }
    res.status(200).json({ message: "Server Refreshed successfully", filePath });
  });
});

module.exports = router;
