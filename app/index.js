import { Client } from "pg";

const client = new Client({
    user: "",
    host: "", 
    database: "",
    password: "", 
    port: 5430
})

client.connect()

