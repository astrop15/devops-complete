const express = require("express");

const app = express();
const port = process.env.APP_PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from devops-app");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});