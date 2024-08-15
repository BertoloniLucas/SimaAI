import { client } from "./config/dbconfig.js";
import express from "express";


const app = express()
app.use(express.json())
const port = 3002


app.listen(port, ()=>{
    console.log(`Sima listening on port ${port}`)
})

app.get("/", async (_, res) =>{
    await client.connect()
    const {rows} = await client.query("SELECT * FROM public.patients")
    await client.end()
    res.send(rows)
})

app.post("/add", async (req, res) =>{
    await client.connect()
    const {name, surname, telephone, email} = req.body
    const {rows} = await client.query("INSERT INTO public.patients (name, surname, telephone, email) VALUES ($1, $2, $3, $4)", [name, surname, telephone, email])
    await client.end()
    res.send(rows)
})
