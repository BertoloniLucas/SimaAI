import { client } from "./config/dbconfig.js";
import express from "express";


const app = express()
app.use(express.json())
const port = 3002


app.listen(port, ()=>{
    console.log(`Sima listening on port ${port}`)
})

app.get("/users", async (_, res) =>{
    await client.connect()
    const [rows] = await client.query("SELECT * FROM public.patients")
    res.send(rows)
    await client.end()
})

