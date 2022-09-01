const express = require('express')
const path = require('path')


const resourcePath = path.join(__dirname, '../dist/')

console.log(`[Resource path]: ${resourcePath}`)

const app = express()
app.use("/",express.static(resourcePath))

app.get('/',(request,response)=>{
  response.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = 1234

app.listen(port, ()=> {
  console.log(`Server is running on Port ${port}` );
})
