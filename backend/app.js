import express from 'express'
import cors from 'cors'
import { AppError, UnauthorizedError } from './errors.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('./frontend'))

app.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body

        if (!username || !password) throw new UnauthorizedError();
        res.sendStatus(200)
    }
    catch (e) {
        next(e)
    }
})

app.use((err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).send(`Error: ${err.message}`)
    }

    console.log(err)
    res.status(500).send(`Error: There was an issue connecting with the server`)
})

export default app;