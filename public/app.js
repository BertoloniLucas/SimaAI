const nombre = document.getElementById('name')
const surname = document.getElementById('surname')
const button = document.getElementById('btn1')

button.addEventListener("click", ()=>{
    fetch("https://proyecto2024-opr7j2xpe-lucas-bertolonis-projects.vercel.app/users")
    .then(res => res.json())
    .then(data => alert(data))
})