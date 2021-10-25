// https://thecatapi.com
document.getElementById('cat').addEventListener('click', e => {
  fetch('https://api.thecatapi.com/v1/images/search')
    .then(response => {
      if(response.ok){
        response.json().then(data => document.body.style.backgroundImage = `url(${data[0].url})`)
      } else {
        console.log('ERREUR !!!')
        document.getElementById('erreur').innerHTML = "Erreur: :("
      }
    })
})

function listProfilsUsersInUsersContainer(data) {
  const usersContainer = document.querySelector('#usersContainer')
  usersContainer.innerHTML = ''
  data.data.forEach(({email, first_name, last_name, avatar, id}) => {
    usersContainer.innerHTML += `
      <div class="userProfile" id="id-${id}">
        <div class="id">${id}</div>
        <div class="avatar">
          <img src="${avatar}" alt="avatar de l'utilisateur ${first_name} ${last_name}" />
        </div>
        <div class="info">
          <p>${first_name} ${last_name}</p>
          <p>${email}</p>
        </div>
        <div class="menu">
          <span title="Modifier"><i class="fas fa-user-edit"></i></span>
          <span title="Supprimer" onClick="deleteUser(${id})"><i class="fas fa-user-minus"></i></span>
        </div>
      </div>
    `
  })
}

function deleteUser(userId) {
  console.log(`https://reqres.in/api/users/${userId}`)
  fetch(`https://reqres.in/api/users/${userId}`, { method: 'DELETE' })
  .then(response => {
    if(response.ok){
      console.log('DELETE STATUS CODE ' + response.status)
      document.getElementById(`id-${userId}`).style.display = 'none'
    } else {
      console.log('DELETE STATUS CODE ' + response.status)
    }
  })
}

// function createUser() {
//   console.log(`https://reqres.in/api/users/${userId}`)
//   fetch(`https://reqres.in/api/users/${userId}`, {
//     method: 'POST'
//   })
//   .then(response => {
//     if(response.ok){
//       console.log('DELETE STATUS CODE ' + response.status)
//       document.getElementById(`id-${userId}`).style.display = 'none'
//     } else {
//       console.log('DELETE STATUS CODE ' + response.status)
//     }
//   })
// }

// function updateUser() {
//   console.log(`https://reqres.in/api/users/${userId}`)
//   fetch(`https://reqres.in/api/users/${userId}`, {
//     method: 'PUT'
//   })
//   .then(response => {
//     if(response.ok){
//       console.log('DELETE STATUS CODE ' + response.status)
//       document.getElementById(`id-${userId}`).style.display = 'none'
//     } else {
//       console.log('DELETE STATUS CODE ' + response.status)
//     }
//   })
// }

function readAllUsers() {
  let users = {}
  fetch('https://reqres.in/api/users?page=1')
    .then(response => {
      if(response.ok){
        response.json().then(data => listProfilsUsersInUsersContainer(data))
      } else {
        console.log('ERREUR !!!')
      }
    })
}

readAllUsers()
