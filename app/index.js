import { client } from "./dbconfig.js";

client.connect()
const res = await client.query("SELECT * FROM patients")
client.end()
console.log(res.rows[0])