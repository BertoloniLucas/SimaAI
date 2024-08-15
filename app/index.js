import { client } from "./config/dbconfig.js";
import express from "express";


const app = express()
app.use(express.json())
const port = 3002


app.listen(port, ()=>{
    console.log(`Sima listening on port ${port}`)
})

app.get("https://proyecto2024-nine.vercel.app", (_, res) =>{
    res.send("Hola grupo! Primera ruta!")
})

