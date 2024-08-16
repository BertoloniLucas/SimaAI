const btn = document.getElementById('btnSend')
const input_name = document.getElementById("name")
const input_surname = document.getElementById("surname")
const btnSelect = document.getElementById('btnSelect')


async function select_users () {
    await fetch("http://localhost:3002/")
    .then(res => res.json())
    .then(data =>{
        data.forEach((user) =>{
            console.log(user)
        })
    })
}

btn.addEventListener("click", (event)=>{
    event.preventDefault()
    alert(`Hola ${input_name.value} ${input_surname.value}!`)
})

btnSelect.addEventListener("click", async () =>{
    await fetch("http://localhost:3002/")
    .then(res => res.json())
    .then(data =>{
        data.forEach((user) =>{
            console.log(user)
        })
    })
})
