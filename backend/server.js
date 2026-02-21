import express from 'express'

import { chat } from './LLM2.js';
const app = express()
app.use(express.json());
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/chat', async(req, res) => {
  const {message} = req.body
//   console.log(message)
if(!message){
    res.status(404).json({
        message:"error"
    })
}
  const result = await chat(message)
  res.json({message:result})
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
