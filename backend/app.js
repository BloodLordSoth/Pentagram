import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  AppError,
  UnauthorizedError,
  UsernameError,
  NotFoundError,
  ForbiddenError,
  InvalidPasswordError,
  NoUserFoundError,
} from "./errors.js";
import { hashPass, checkHash } from "./auth.js";
import { createUser, getUser, createFile, getFile, updateFile } from "./db.js";
import jwt from "jsonwebtoken";
import { callGPT, editGPT } from "../shared/ai.js";
import crypto from "crypto";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./frontend"));

app.post("/register", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) throw new UnauthorizedError();

    const hash = await hashPass(password);

    const user = await createUser(email, username, hash);

    res.status(201).send({ username: user.username });
  } catch (e) {
    next(e);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) throw new UnauthorizedError();

    const userRecord = await getUser(username);

    if (!userRecord) throw new NoUserFoundError();

    const hash = await checkHash(password, userRecord.password);

    if (!hash) throw new InvalidPasswordError();

    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
      expiresIn: "50m",
    });
    res.status(200).send({ accessToken: accessToken, username: username });
  } catch (e) {
    next(e);
  }
});

app.get("/users/:filename", async (req, res, next) => {
  try {
    const file = req.params.filename;

    if (!file) throw new UnauthorizedError();

    const dirFile = await getFile(file);
    res.status(200).send(dirFile.file);
  } catch (e) {
    next(e);
  }
});

app.get("/users/:username", async (req, res, next) => {
  try {
    const username = req.params.username;

    if (!username) throw new UnauthorizedError();

    const query = await getUser(username);
    res.status(200).send(query);
  } catch (e) {
    next(e);
  }
});

app.get("/tokenValidate", authenticate, (req, res, next) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

app.get("/download/:file", authenticate, async (req, res, next) => {
  try {
    const fname = req.params.file;

    if (!fname) throw new UnauthorizedError();

    const file = await getFile(fname);

    if (!file) throw new NotFoundError();

    res.set("Content-Disposition", 'attachment; filename="index.html"');
    res.status(200).send({ file: file.file });
  } catch (e) {
    next(e);
  }
});

app.post("/prompt", authenticate, async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    const username = req.user.name;

    if (!prompt || !username) throw new UnauthorizedError();

    const userData = await getUser(username);

    if (!userData) throw new NotFoundError();

    const fname = crypto.randomBytes(4).toString("hex");
    const file = await callGPT(prompt);
    const fileprompt = await createFile(userData.id, `${fname}.html`, file);
    res.status(201).send({ file: fileprompt });
  } catch (e) {
    next(e);
  }
});

app.post('/reprompt/:filename', authenticate, async (req, res, next) => {
    try {
        const prompt = req.body.prompt;
        const username = req.user.name;
        const filename = req.params.filename

        if (!prompt || !username) throw new UnauthorizedError();

        const userData = await getUser(username)

        if (!userData) throw new NoUserFoundError();

        const file = await getFile(filename)

        //throw new nofilefound error if !file

        const newPrompt = await editGPT(prompt, file.file)

        const updatedPrompt = await updateFile(newPrompt, file.file_name)
        res.status(200).send({ file: updatedPrompt })
    }
    catch (e) {
        next(e)
    }
})

async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) throw new UnauthorizedError();

  const token = authHeader.split(" ")[1];

  if (!token) throw new ForbiddenError();

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) throw new ForbiddenError();
    req.user = user;
    next();
  });
}

app.use((err, req, res, next) => {
  if (err.message.includes("UNIQUE constraint failed")) {
    throw new UsernameError();
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.log(err);
  res.status(500).send(`Error: There was an issue connecting with the server`);
});

export default app;
