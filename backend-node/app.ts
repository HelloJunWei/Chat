import express from 'express';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json('The server is working!')
})

app.get('/about', (req, res) => {
  console.log(req.query.user_id)
  res.json(req.query.user_id)
})

app.listen(port, () => {
  console.log(`server is listening on ${port} !!!`)
})
