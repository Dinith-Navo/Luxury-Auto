const axios = require("axios");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

// Define your endpoints and filenames
const endpoints = [
  { url: "http://localhost:4000/vehicles", filename: "vehicles.csv" },
  { url: "http://localhost:4000/users", filename: "users.csv" },
  { url: "http://localhost:4000/vehiclebookings", filename: "vehiclebookings.csv" },
  { url: "http://localhost:4000/sales", filename: "sales.csv" },
];

// Export function
const exportCSVFiles = async () => {
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url);
      const jsonData = response.data;

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(jsonData);

      const filePath = path.join(__dirname, `../../../frontend/src/Components/Admin/Database/${endpoint.filename}`);
      fs.writeFileSync(filePath, csv, "utf8");

      console.log(`✅ Exported ${endpoint.filename} to ${filePath}`);
    } catch (error) {
      console.error(`❌ Error exporting ${endpoint.filename}:`, error.message);
    }
  }
};

exportCSVFiles();
