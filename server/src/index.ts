import express from "express";
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.get('/api', (req, res) => {

})

const PORT: number = process.env.PORT || 3030
const server = app.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`);
})
server.on("error", error  => console.error(`Error in server: ${error}`))