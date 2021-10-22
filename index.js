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

function viewProfilUser({email, first_name, last_name, avatar}) {
  return `
    <div class="userProfile">
      <div class="avatar">
        <img src="${avatar}" alt="avatar de l'utilisateur ${first_name} ${last_name}" />
      </div>
      <div class="info">
        <p>${first_name} ${last_name}</p>
        <p>${email}</p>
      </div>
    </div>
  `
}

// https://reqres.in
const usersContainer = document.querySelector('#usersContainer')
let users = {}
fetch('https://reqres.in/api/users?page=1')
  .then(response => {
    if(response.ok){
      // response.json().then(data => console.table(data.data))
      response.json().then(data => {
        usersContainer.innerHTML = ''
        data.data.forEach(user => {
          usersContainer.innerHTML += viewProfilUser(user)
        })
      })
    } else {
      console.log('ERREUR !!!')
    }
  })
