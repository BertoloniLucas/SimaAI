const btnAdd = document.getElementById('btnSend')
const input_name = document.getElementById("name")
const input_surname = document.getElementById("surname")
const btnSelect = document.getElementById("btnSelect")
const user_list = document.getElementById("user_list")
const btn_login = document.getElementById("btnLogin")
const btnResgisDoc = document.getElementById("registerDoc")
const docName = document.getElementById("docName")
const docSurname = document.getElementById("docSurname")
const docTel = document.getElementById("docTel")
const docEmail = document.getElementById("docEmail")


// -----------------Functions----------------------//
const user_list_add = (user) => {
    return `
    <li class = "user_item"> 
        <div class = "info">
            <h2> Usuario : ${user.name} ${user.surname}</h3>
            <h5> Telephone : ${user.telephone}</h6>
            <h5> Email : ${user.email}</h6>
        </div>
    </li>
    `
}

// -----------------End Functions----------------------//



btnSelect.addEventListener("click", async () =>{
    fetch("http://localhost:3002/users")
    .then(res => res.json())
    .then(data =>{
        user_list.innerHTML = ""
        data.forEach((user) =>{
            const li = user_list_add(user)
            user_list.innerHTML += li
        })
    })
})

btnAdd.addEventListener("click", async (event)=>{
    event.preventDefault()
    const user_values = {
        user_name: input_name.value,
        user_surname: input_surname.value 
    }

    await fetch("http://localhost:3002/add2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_values)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch((error) =>{
        console.log(error)
    })
})

btn_login.addEventListener("click", async () =>{
    const user_credentials = {
        user_name: input_name.value,
        user_surname: input_surname.value
    }

    await fetch("http://localhost:3002/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_credentials)
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
    })
})

btnResgisDoc.addEventListener("click", async (event) => {
    event.preventDefault()
    const dataDoc = {
        docName: docName.value,
        docSurname: docSurname.value,
        docTel: docTel.value,
        docEmail: docEmail.value
    }

    fetch("http://localhost:3002/registerDoc", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataDoc)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err.json())
    })
})