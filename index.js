require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Load credentials from .env or prompt user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const getConfig = async () => {
  let TOKEN = process.env.TOKEN;
  let DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;

  if (!TOKEN) TOKEN = await askQuestion("Enter your Vercel API Token: ");
  if (!DEPLOYMENT_ID)
    DEPLOYMENT_ID = await askQuestion("Enter your Deployment ID: ");

  rl.close();

  return { TOKEN, DEPLOYMENT_ID };
};

(async () => {
  const { TOKEN, DEPLOYMENT_ID } = await getConfig();

  const BASE_DIR = path.join(__dirname, "deployment");

  const loom = axios.create({
    baseURL: "https://api.vercel.com",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const createFilesRecursively = async (items, basePath) => {
    for (const item of items) {
      const itemPath = path.join(basePath, item.name);

      if (item.type === "directory") {
        try {
          await fs.promises.mkdir(itemPath, { recursive: true });
          console.log(`📁 Created directory: ${itemPath}`);
        } catch (err) {
          console.error(`❌ Error creating directory ${itemPath}:`, err.message);
        }
        if (item.children) await createFilesRecursively(item.children, itemPath);
      } else {
        try {
          const res = await loom.get(
            `/v7/deployments/${DEPLOYMENT_ID}/files/${item.uid}`
          );

          let fileContent = res.data?.data ?? res.data;

          // Handle Base64-encoded content
          if (typeof fileContent === "string") {
            try {
              const decoded = Buffer.from(fileContent, "base64");
              if (decoded.toString("base64") === fileContent) {
                console.warn(`ℹ️ Base64-encoded data detected in ${item.name}, decoding...`);
                fileContent = decoded;
              }
            } catch {
              console.warn(`⚠️ Failed Base64 decode check for ${item.name}`);
            }
          }

          // Convert objects to JSON if needed
          if (typeof fileContent === "object" && !Buffer.isBuffer(fileContent)) {
            console.warn(`⚠️ Converting object to JSON for ${item.name}`);
            fileContent = JSON.stringify(fileContent, null, 2);
          }

          await fs.promises.writeFile(
            itemPath,
            fileContent,
            Buffer.isBuffer(fileContent) ? undefined : "utf8"
          );

          console.log(`✅ Created ${item.type}: ${itemPath}`);
        } catch (err) {
          console.error(`❌ Error fetching ${item.type} ${item.name}:`, err.message);
        }
      }
    }
  };

  const getDeploymentFiles = async () => {
    try {
      const res = await loom.get(`/v6/deployments/${DEPLOYMENT_ID}/files`);
      if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });
      await createFilesRecursively(res.data, BASE_DIR);
      console.log("✅ All files, lambdas, and directories created inside ./deployment");
    } catch (error) {
      console.error("❌ Error fetching or creating files:", error);
    }
  };

  await getDeploymentFiles();
})();
