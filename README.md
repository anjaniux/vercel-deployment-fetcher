# Vercel Deployment Fetcher

![GitHub stars](https://img.shields.io/github/stars/your-username/vercel-deployment-fetcher?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/your-username/vercel-deployment-fetcher?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/your-username/vercel-deployment-fetcher?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/your-username/vercel-deployment-fetcher?style=for-the-badge)

## 🚀 About

**Vercel Deployment Fetcher** allows you to retrieve and restore all files from a Vercel deployment, even if you've lost them locally. Whether you're recovering lost work or need to inspect your deployed files, this script makes it easy.

### 🔥 Features
- Fetches all files, directories, and serverless functions from a Vercel deployment.
- Automatically decodes base64-encoded content.
- Saves everything in a structured format.
- Works for **any Vercel user**—just provide your **Vercel Token** and **Deployment ID**.

## 📦 Installation

```sh
# Clone the repository
git clone https://github.com/anjaniux/vercel-deployment-fetcher.git
cd vercel-deployment-fetcher

# Install dependencies
npm install
```

## ⚡ Usage

### 1️⃣ Configure your credentials
Create a `.env` file in the project root and add your **Vercel API Token** and **Deployment ID**:

````ini
VERCEL_TOKEN=your_vercel_token
DEPLOYMENT_ID=your_deployment_id
````

### 2️⃣ Run the script

```sh
node index.js
```

Once executed, all files will be restored inside the `deployment/` directory.

## 🔧 Troubleshooting

### Getting `403 Forbidden`?
Ensure your **Vercel Token** has the necessary permissions. Generate a new token from [Vercel's dashboard](https://vercel.com/account/tokens).

### Deployment not found?
Check that the **Deployment ID** is correct. You can find it in the **Vercel dashboard** under your deployment's details.

## 🤝 Contributing
Contributions are welcome! Feel free to fork this repo, submit issues, or open PRs.

## 📜 License
This project is licensed under the MIT License.