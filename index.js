// https://thecatapi.com => easter egg
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


// Functions
// Create/Update formulaire
function formTpl() {
  return `
    <form id="addForm" method="POST">
      <div class="col">
        <div id="img-preview"><img src="avatar_default.jpg" /></div>
        <input type="file" accept="image/*" name="avatar" id="avatar" required>
        <label for="avatar">Choisissez votre Avatar</label>
      </div>
      <div class="col">
        <input type="text" name="first_name" id="first_name" placeholder="Prénom" required>
        <input type="text" name="last_name" id="last_name" placeholder="Nom" required>
        <input type="email" name="email" id="email" placeholder="E-Mail" required>
        <input type="submit" onClick="sendForm()" value="Enregistrer">
      </div>
    </form>
  `
}

function avatarPreview () {
  const avatar = document.getElementById("avatar")
  const imgPreview = document.getElementById("img-preview")
  const img = document.querySelector("#img-preview img")
  avatar.addEventListener("change", function () {
    const files = avatar.files[0]
    if (files) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files)
      fileReader.addEventListener("load", function () {
        imgPreview.style.display = "block"
        img.src = this.result
      })
    }
  })
}

// Create
function sendForm() {
  const form = document.getElementById("addForm");
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    let submitForm = {}
    Array.from(new FormData(form), (entry) => {
      if (entry[0] === 'avatar') {
        submitForm[entry[0]] = entry[1].name
      } else {
        submitForm[entry[0]] = entry[1]
      }
    })

    /* J'envoie les données à l'API et je récupére la réponse */
    fetch(`https://reqres.in/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // headers: { 'Content-Type': 'multipart/form-data' },
      body: JSON.stringify(submitForm)
    })
    .then(response => {
      document.getElementById('responseContainer')
              .innerHTML = `<pre>Status: ${response.status}</pre>`
      if(response.ok){
        response.json().then(data => {
          console.log(data)
          document.getElementById('responseContainer')
                  .innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`
        })
      }
    })

    /* Je vide et je ferme le formulaire */
    form.first_name.value = ''
    form.last_name.value = ''
    form.email.value = ''
    const msg = '<p>Demande engistrer, vous pouvez aller voir la « Response ».</p>'
    container.insertAdjacentHTML('afterbegin', msg)
  })
}

// Read
function listProfilsUsersInUsersContainer (data) {
  container.innerHTML = ''
  data.data.forEach(({email, first_name, last_name, avatar, id}) => {
    container.innerHTML += `
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

function readAllUsers () {
  fetch('https://reqres.in/api/users?per_page=12')
    .then(response => {
      document.getElementById('responseContainer')
              .innerHTML = `<pre>Status: ${response.status}</pre>`
      if(response.ok){
        response.json().then(data => {
          listProfilsUsersInUsersContainer(data)
          document.getElementById('responseContainer')
                  .innerHTML += `<pre>${JSON.stringify(data.data, null, 2)}</pre>`
        })
      }
    })
}

// Update
function updateUser () {
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

// Delete
function deleteUser (userId) {
  console.log(`https://reqres.in/api/users/${userId}`)
  fetch(`https://reqres.in/api/users/${userId}`, { method: 'DELETE' })
  .then(response => {
    let del = ''
    if(response.ok){
      document.getElementById(`id-${userId}`).style.display = 'none'
      del = `, User #${userId} exterminate !`
    }
    document.getElementById('responseContainer')
            .insertAdjacentHTML('afterbegin', `<pre>Status: ${response.status}${del}</pre>`)
  })
}


// Event
// Bouton view response (en sous-titre)
const btnViewResponse = document.getElementById('btnViewResponse')
btnViewResponse.addEventListener('click', () => {
  if (btnViewResponse.classList.contains('active')) {
    responseContainer.style = 'display: none'
    container.style = 'display: flex'
    btnViewResponse.innerHTML = 'Voir la response'
  } else {
    responseContainer.style = 'display: block'
    container.style = 'display: none'
    btnViewResponse.innerHTML = 'Fermer la response'
  }
  btnViewResponse.classList.toggle('active')
})

// Bouton add user (en haut à droite)
const addUser = document.getElementById('addUser')
addUser.addEventListener('click', () => {
  if (addUser.classList.contains('active')) {
    readAllUsers()
    addUser.innerHTML = '<i class="fas fa-user-plus"></i>'
  } else {
    container.style = 'display: flex'
    container.innerHTML = formTpl()
    avatarPreview()
    responseContainer.innerHTML = '<pre>Enregistrer un « User » pour avoir une « Response ».</pre>'
    addUser.innerHTML = '<i class="fas fa-times"></i>'
  }
  addUser.classList.toggle('active')
})


// Init
const root = document.getElementById('root')
root.innerHTML = `
  <div id="responseContainer"></div>
  <div id="container"></div>
`
const container = document.getElementById('container')
const responseContainer = document.getElementById('responseContainer')
readAllUsers()
