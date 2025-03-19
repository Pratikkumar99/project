const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS (optional)
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Screenshot endpoint
app.get("/screenshot", async (req, res) => {
  try {
    // Launch Puppeteer (use --no-sandbox if running in restricted environments)
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Navigate to the frontend
    await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle2" });

    // Pause execution for 1 second to ensure all elements load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capture the screenshot in PNG format
    const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' });
    await browser.close();

    // Send the PNG file as a response
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": screenshotBuffer.length
    });
    res.end(screenshotBuffer);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).send("Error capturing screenshot");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
