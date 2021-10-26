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

document.getElementById('addUser').addEventListener('click', e => {
  if (document.getElementById('addUser').classList.contains('active')) {
    document.getElementById('formContainer').style = 'display: none'
    document.getElementById('usersContainer').style = ''
    document.getElementById('addUser').innerHTML = '<i class="fas fa-user-plus"></i>'
  } else {
    document.getElementById('formContainer').style = 'display: block'
    document.getElementById('usersContainer').style = 'display: none'
    document.getElementById('addUser').innerHTML = '<i class="fas fa-times"></i>'
  }
  document.getElementById('addUser').classList.toggle('active')
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

const form = document.getElementById("addForm");
form.addEventListener('submit', (e) => {
  e.preventDefault()



  let submitForm = {}
  Array.from(new FormData(form), (entry) => {
    submitForm[entry[0]] = entry[1]
  })

  /* J'envoie les données à l'API et je récupére la réponse */
  fetch(`https://reqres.in/api/users`, {
    method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    headers: { 'Content-Type': 'multipart/form-data' },
    body: JSON.stringify(submitForm)
  })
  .then(response => {
    if(response.ok){
      console.log('STATUS CODE ' + response.status)
      response.json().then(data => console.log(data))
    } else {
      console.log('STATUS CODE ' + response.status)
    }
  })
  /* Je vide et je ferme le formulaire */
  form.first_name.value = ''
  form.last_name.value = ''
  form.email.value = ''
  document.getElementById('formContainer').style = 'display: none'
  document.getElementById('usersContainer').style = ''
  document.getElementById('addUser').innerHTML = '<i class="fas fa-user-plus"></i>'
  document.getElementById('addUser').classList.toggle('active')
})

function updateUser() {
  console.log(`https://reqres.in/api/users/${userId}`)
  fetch(`https://reqres.in/api/users/${userId}`, {
    method: 'PUT'
  })
  .then(response => {
    if(response.ok){
      console.log('DELETE STATUS CODE ' + response.status)
      document.getElementById(`id-${userId}`).style.display = 'none'
    } else {
      console.log('DELETE STATUS CODE ' + response.status)
    }
  })
}

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

  /* Je rccupére les données du formulaire */
  const avatar = document.getElementById("avatar")
  const imgPreview = document.getElementById("img-preview")
  avatar.addEventListener("change", function () {
    const files = avatar.files[0]
    if (files) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files)
      fileReader.addEventListener("load", function () {
        imgPreview.style.display = "block"
        imgPreview.innerHTML = '<img src="' + this.result + '" />'
      })
    }
  })
