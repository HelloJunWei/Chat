import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initializeApp } from './utils/firebase'
import { rateLimit } from 'express-rate-limit'

import routes from './routes'


const app = express()
const port = process.env.PORT || 4000

app.use(cors({
  origin: ['https://chat-room-3131.herokuapp.com']
}))

app.use(rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100 
}))
app.set('trust proxy', 1)

app.use(bodyParser.json())

app.use('/api', routes)
app.get('/', (req, res) => {
  res.json('hello world')
})

app.listen(port, () => {
  initializeApp()
  console.log(`server is listening on ${port} !!!`)
})
