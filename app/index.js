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

await prisma.$connect() // Conexión Inicial

app.listen(port, () => {
    console.log(`Sima listening on port`, port)
})



//--------------GET Routes-------------------//


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


//------------End GET Routes----------------//

//------------POST Routes-------------------//

app.post("/register", async (req, res) => {
    const {userName, userSurname} = req.body
    const addUser = await prisma.users.create({
        data: {
            name: userName,
            surname: userSurname
        }
    })
    
    res.status(201).send("Creado OK!")
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