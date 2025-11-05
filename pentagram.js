import fs from "fs";
import repl from "repl";
import { callGPT, editGPT } from "./shared/ai.js";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import crypto from "crypto";
import { insertFile } from "./shared/db.js";

const val = JSON.parse(fs.readFileSync("file.json"));
console.log(val);
console.log("Welcome to Pentagram! Generate code via commands");
console.log("Type help for a list of commands");
const stmt = repl.start({ prompt: "Command > ", eval: runner });
const __file = fileURLToPath(import.meta.url);
const __dir = path.dirname(__file);

async function runner(input) {
  const clean = input.trim().split(" ");
  const reval = clean[0];

  switch (reval) {
    case "quit":
      console.log("Quitting program...");
      setTimeout(() => {
        stmt.close();
      }, 1000);
      break;
    case "prompt":
      const refined = clean.slice(1).join(" ");
      const queueAI = await callGPT(refined);
      const fname = crypto.randomBytes(4).toString("hex");
      const breakage = queueAI.split(" ");
      const val = breakage[0];
      const concept = breakage.slice(1).join(" ");
      if (val === "javascript:") {
        const jspath = path.join(__dir, "./assets", `${fname}.js`);
        fs.writeFileSync(jspath, concept);
        //insertFile(fname, '.js', concept)
        console.log("File has been created");
        break;
      } else if (val === "html:") {
        const htmlpath = path.join(__dir, "./assets", `${fname}.html`);
        fs.writeFileSync(htmlpath, concept);
        //insertFile(fname, '.html', concept)
        console.log("File has been created");
        break;
      }
    case "edit":
      try {
        const refined2 = clean.slice(2).join(" ");
        const fpath = path.join(__dir, "./assets", clean[1]);
        const editFile = fs.readFileSync(fpath, "utf-8");
        const editedFile = await editGPT(refined2, editFile);
        fs.writeFileSync(fpath, editedFile);
        console.log("Fixes have been applied");
      } catch (e) {
        console.error(e);
      }
      break;
    case "run":
      const ref3 = clean.slice(1).join(" ");
      runCommand(ref3);
      break;
    case "read":
      try {
        const reqFile = path.join(__dir, "./assets", clean[1]);
        const rdme = fs.readFileSync(reqFile, "utf-8");
        console.log(rdme);
      } catch {
        console.error(`Sorry, cannot find your file`);
      }
      break;
    case "dir":
      exec("dir assets", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return;
        }

        if (stderr) {
          console.log(`Error: ${stderr}`);
          return;
        }
        console.log(stdout);
      });
      break;
    case "clear":
      process.stdout.write("\x1Bc");
      break;
    case "help":
      console.log(
        "1. Prompt - Prompts the ai to generate a file. Example: (prompt generate me a html login page).",
      );
      console.log(
        "2. Edit - Hand the file to the ai to edit. Example: (edit filename.html give the login page a dark theme).",
      );
      console.log("4. Read - Read a file. Example: (read hello.js).");
      console.log("3. Dir - Lists the contents of your file directory.");
      console.log("5. Clear - Clears the terminal window.");
      console.log("6. Quit - Closes the terminal window.");
      break;
    default:
      console.log("unknown command");
  }
  stmt.displayPrompt();
}

function runCommand(input) {
  const fpath = path.join(__dir, "./assets", input);
  exec(`node ${fpath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }

    if (stderr) {
      console.error(stderr);
      return;
    }

    console.log(stdout);
  });
}
