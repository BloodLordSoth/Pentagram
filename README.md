# Pentagram

![badge](https://github.com/BloodLordSoth/Pentagram/actions/workflows/ci.yml/badge.svg)

## Quick Start
**[https://pentagram-pbe6.onrender.com/](https://pentagram-pbe6.onrender.com/)**

## Images
![screenshot1](./images/ss1.png)

## Description

```
Generate, preview, and download AI-Powered front-end Templates

Instantly generate responsive layouts and components with intelligent defaults, via web-browser. Download your creations to share. Create via web or with a Windows CLI.
```

## Stack/Dependencies
```
- Frontend HTML/CSS/Javascript
- Backend Node.js/express
- dependencies express cors dotenv @libsql/client openai fs bcrypt jsonwebtoken
- devDependencies nodemon jest supertest prettier 

- Included: within the root is pentagram.js the CLI REPL tool.
```

## Contributing/Cloning

### Clone the repo

```bash
git clone https://github.com/BloodLordSoth/pentagram
```

### Build the compiled binary

```bash
npm install
```

### Run the test suite

```bash
npm run pentagram (CLI)
npm run dev (dev server)

- You will need a openAI API key for the CLI REPL.
- Store in .env API_KEY=yourAPIkeyhere
```

### CLI commands
```
1. Prompt - Prompts the ai to generate a file. Example: (prompt generate me a html login page).
2. Edit - Hand the file to the ai to edit. Example: (edit filename.html give the login page a dark theme).
4. Read - Read a file. Example: (read hello.js).
3. Dir - Lists the contents of your file directory.
5. Clear - Clears the terminal window.
6. Quit - Closes the terminal window.
```

<br>

---
### BloodLordSoth
[GitHub](http://github.com/BloodLordSoth) | [YouTube](http://youtube.com/@BloodLordSoth)
