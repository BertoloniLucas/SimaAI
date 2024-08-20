// Modulos necesarios
import { client } from "./config/dbconfig.js"; // Checkear a ver si es necesario 
import express from "express";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";


// Middlewears necesarios
const app = express()
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()
const port = 3002

//------------------------------//

await prisma.$connect()

app.listen(port, () => {
    console.log(`Sima listening on port`, port)
})


app.get("/", async (_, res) => {
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
