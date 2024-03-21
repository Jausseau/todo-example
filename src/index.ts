import { json } from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import { todoRouter } from './routes/todo'

dotenv.config()
const app = express()
app.use(json())
app.use(todoRouter)

const port = process.env.PORT ?? 3000
const mongoUri = process.env.MONGODB_URI

mongoose.connection.on('connected', () => {
  console.log('Connected to database')
})

void (async () => {
  if (mongoUri) await mongoose.connect(`${mongoUri}/todo-example`)
})()

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
