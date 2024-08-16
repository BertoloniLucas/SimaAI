export const user_list_add = (user) => {
    return `
    <li class = "user_item"> 
        <div class = "info">
            <h3> Usuario : ${user.name} ${user.surname}</h3> <br>
            <h6> Telephone : ${user.telephone}</h6> <br>
            <h6> Email : ${user.email}</h6>
        </div>
    </li>
    `
}

