// Modulos necesarios
import { client } from "./config/dbconfig.js";
import express from "express";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";


// Middlewears necesarios
const app = express()
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()
const port = 3002

const prQuery = async () => {
    prisma.$connect()
    const users = await prisma.users.findMany()
    console.log(users)
    await prisma.$disconnect()
}

prQuery()

const prQuery2 = async () => {
    await prisma.$connect()
    const userAdds = await prisma.users.create({
        data: {
            name: "Luquitas",
            surname: "Berto",
        },
    })
    console.log("Se ha creado el user : ", userAdds)
    await prisma.$disconnect()
}

//prQuery2()


const connection = async () =>{
    await client.connect()
}

//connection() // prender conexión

app.listen(port, ()=>{
    console.log(`Sima listening on port ${port}`)
})

//---------------GET Requests---------------//
app.get("/", async (_, res) =>{
    try{
        const {rows} = await client.query("SELECT * FROM public.patients")
        res.send(rows)
    }
    catch(error){
        res.status(500).send("Server Error" + error)
    }
})

app.get("/users", async (_, res) =>{
    try{
        const{rows} = await client.query("SELECT * FROM public.users")
        res.send(rows)
    }
    catch(error){
        res.status(500).send("Server Error : " + error)
    }
})


//------------------End GET Requests---------------//


//---------------DELETE Requests---------------//
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

//---------------End DELETE Requests---------------//


//---------------PUT Requests---------------//
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

//---------------End PUT Requests---------------//

//---------------POST Requests---------------//
app.post("/add2", async (req, res) =>{
    try{
        const {user_name, user_surname} = req.body
        const {rows} = await client.query("INSERT INTO public.users (name, surname) VALUES ($1, $2)", [user_name, user_surname])
        res.status(200).send("Agregado!")
    }
    catch(error){
        res.status(500).send("Server Error")
    }
})

app.post("/login", async (req, res)=> {
    try{
        const {user_name, user_surname} = req.body
        const {rows} = await client.query("SELECT * FROM public.users WHERE name = $1 AND surname = $1", [user_name, user_surname])
        if (rows.length > 0) {
            res.send("User verified! Welcome")
        }
        else {
            res.status(404).send("User not found, try again")
        }
    }
    catch(error){
        res.status(500)
    }
})

app.post("/registerDoc", async (req, res) => {
    try{
        const {docName, docSurname, docTel, docEmail} = req.body
        const {rows} = await client.query("INSERT INTO public.doctors (name, surname, telephone, email) VALUES ($1, $2, $3, $4)", [docName, docSurname, docTel, docEmail])
        if (res.status == 200){
            res.send("Agregado correctamente!")
        }
        else{
            res.status(404).json({message: "Error al crear doctor, intente nuevamente!"})
        }
    }
    catch(error){
        res.status(500).send("Server Error: ", error)
    }
})

//---------------End POST Requests---------------//
