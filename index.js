// https://thecatapi.com
const img = document.querySelector('#illustrator img')
// fetch('https://api.thecatapi.com/v1/images/search')
//   .then(response => {
//     if(response.ok){
//       response.json().then(data => img.src = data[0].url)
//     } else {
//       console.log('ERREUR !!!')
//       document.getElementById('erreur').innerHTML = "Erreur: :("
//     }
//   })

function listProfilsUsersInUsersContainer(data) {
  const usersContainer = document.querySelector('#usersContainer')

  usersContainer.innerHTML = ''
  data.data.forEach(({email, first_name, last_name, avatar, id}) => {
    usersContainer.innerHTML += `
      <div class="userProfile">
        <div class="avatar">
          <img src="${avatar}" alt="avatar de l'utilisateur ${first_name} ${last_name}" />
        </div>
        <div class="info">
          <p>${first_name} ${last_name}</p>
          <p>${email}</p>
        </div>
        <div class="id">${id}</div>
      </div>
    `
  })
}

// https://reqres.in
let users = {}
fetch('https://reqres.in/api/users?page=1')
  .then(response => {
    if(response.ok){
      response.json().then(data => listProfilsUsersInUsersContainer(data))
    } else {
      console.log('ERREUR !!!')
    }
  })
