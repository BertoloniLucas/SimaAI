// Modulos necesarios
//import Connection from "mysql/lib/Connection.js"; ?? 
import { client } from "./config/dbconfig.js";
import express, { response } from "express";
import cors from 'cors'


// Middlewears necesarios
const app = express()
app.use(cors())
app.use(express.json())
const port = 3002


const connection = async () =>{
    await client.connect()
}

connection() // prender conexión

app.listen(port, ()=>{
    console.log(`Sima listening on port ${port}`)
})

app.get("/", async (_, res) =>{
    try{
        const {rows} = await client.query("SELECT * FROM public.patients")
        res.send(rows)
    }
    catch(error){
        res.status(500).send("Server Error" + error)
    }
})

app.post("/add", async (req, res) =>{
    try{
        const {name, surname, telephone, email} = req.body
        const {rows} = await client.query("INSERT INTO public.patients (name, surname, telephone, email) VALUES ($1, $2, $3, $4)", [name, surname, telephone, email])
        res.status(201).send("Agregado correctamente!")
    }
    catch(error){
        res.status(500).send("Server Error: " + error)
    }
})

app.delete("/deletions/:id", async (req, res)=>{
    try{
        const {id} = req.params
        const {rows} = await client.query("DELETE FROM public.patients WHERE id = $1", [id])
        res.status(201).send("Eliminado exitosamente!")
    }
    catch(error){
        res.status(500).send("Server Error: ", error)
    }
})

app.put("/updates/:id", async (req, res)=>{
    try{
        const {id} = req.params
        const {name, surname, telephone, email} = req.body
        const {rows} = await client.query("UPDATE public.patients SET name = $1, surname = $2, telephone = $3, email = $4", [name, surname, telephone, email])
        res.status(200).send("Modificado correctamente!")
    }
    catch(error){
        res.status(500).send("Server Error: " + error)
    }
})

