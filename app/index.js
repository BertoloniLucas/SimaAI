import { config } from "./dbconfig.js";
import express from "express";
import cors from "cors";
import pkg from "pg";

const { Client } = pkg 

let user = "Lucas"
let passw = "123"

const client = await new Client(config)
await client.connect()
let result = await client.query("SELECT * FROM users")
console.log(result)
await client.end()