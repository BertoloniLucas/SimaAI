import { user_list_add } from "./script.js"

const btn = document.getElementById('btnSend')
const input_name = document.getElementById("name")
const input_surname = document.getElementById("surname")
const btnSelect = document.getElementById("btnSelect")
const user_list = document.getElementById("user_list")


btn.addEventListener("click", (event)=>{
    event.preventDefault()
    alert(`Hola ${input_name.value} ${input_surname.value}!`)
})


btnSelect.addEventListener("click", async () =>{
    fetch("http://localhost:3002/")
    .then(res => res.json())
    .then(data =>{
        data.forEach((user) =>{
            user_list_add()
        })
    })
})