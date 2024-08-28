// Modulos necesarios
import { client } from "./config/dbconfig.js"; // Checkear a ver si es necesario 
import express from "express";
import cors from 'cors';
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { check } from "prisma";


// Middlewears necesarios
const app = express()
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()
const port = 3002
const secret = process.env.JWT_SECRET

//------------------------------//

await prisma.$connect() // Conexión Inicial

//--------------GET Routes-------------------//

app.listen(port, () =>{
    console.log("Port running on port", port)
})


app.get("/users", async (_, res) => {
    const usersAtDb = await prisma.users.findMany()
    res.send(usersAtDb)
})

app.get("/id/:id", async (req, res) => {
    const {id} = req.params
    const users = await prisma.users.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    
    users ? res.send(users) : res.status(404).send("Not Found")
})

app.get("/name/:name", async (req, res) => {
    const {name} = req.params
    const users = await prisma.users.findMany({
        where: {
            name: name
        }
    })
    
    users.length > 0 ? res.send(users) : res.status(404).send("Not Found")
})


//------------End GET Routes----------------//

//------------POST Routes-------------------//

app.post("/register", async (req, res) => {
    const {userName, userSurname} = req.body
    const userSurnameHashed = await bcrypt.hash(userSurname, 10)
    const addUser = await prisma.users.create({
        data: {
            name: userName,
            surname: userSurnameHashed
        }
    })
    
    res.status(201).send("Creado OK!")
})

app.post("/login", async (req, res) => {
    const {id} = req.body
    const userExists = await prisma.users.findUnique({
        where: {
            id: parseInt(id),
        }
    })

    userExists ? res.send(userExists) : res.status(404).send("Not found")
})

//-----------End POST Routes----------------//

//------------PUT Routes--------------------//

app.put("/editUser/:id", async (req, res) => {
    const {id} = req.params
    const {userName, userSurname} = req.body
    const editUser = await prisma.users.update({
        where: {id: parseInt(id)}, 
        data: {
            name: userName,
            surname: userSurname
        }
    })

    editUser? res.status(201).send("Actualizado con exito!") : res.send(404).send("No se ha encontrado al usuario")
})


//---------End PUT Routes---------------------//

//-----------DELETE Routes--------------------//


app.delete("/deleteUser/:id", async (req, res) => {
    const {id} = req.params
    const deleteUser = await prisma.users.delete({
        where: {id: parseInt(id)}
    })

    deleteUser? res.status(200).send("Eliminado exitosamente") : res.send(404).send("Not found")
})


//----------End DELETE Routes-----------------//

//------------ Routes with JWT---------//

app.post("/loginToken", async (req, res) => {
    const {name, surname} = req.body 
    const checkUser = await prisma.users.findFirst({
        where: {
            AND: [{
                name: name, 
                surname: surname
            }
            ]
        }
    })
    checkUser? 
    res.sendStatus(201).send(checkUser.id) : res.status(404).send("User not found")
})