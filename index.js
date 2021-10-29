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
function formTpl(user = '') {
  let useMethod = 'POST'
  let id = ``
  let avatarImg = 'avatar_default.jpg'
  let avatar = ``
  let first_name = ``
  let last_name = ``
  let email = ``

  if (user != '') {
    useMethod = 'PUT'
    id = `<input type="hidden" id="userId" name="userId" value="${user.id}">`
    avatarImg = user.avatar
    avatar = `value="${user.avatar}"`
    first_name = `value="${user.first_name}"`
    last_name = `value="${user.last_name}"`
    email = `value="${user.email}"`
  }

  return `
    <form id="addForm" method="POST">
      <p class="col-12" id="msg"></p>
      <div class="col-6">
        <div id="img-preview"><img src="${avatarImg}" /></div>
        <label for="avatar">Choisissez votre Avatar</label>
        <input type="file" accept="image/*" name="avatar" id="avatar" ${avatar}">
      </div>
      <div class="col-6">
        ${id}
        <input type="text" name="first_name" id="first_name" placeholder="Prénom" ${first_name} required>
        <input type="text" name="last_name" id="last_name" placeholder="Nom" ${last_name} required>
        <input type="email" name="email" id="email" placeholder="E-Mail" ${email} required>
      </div>
      <div class="col-12">
        <input type="submit" onClick="sendForm('${useMethod}')" value="Enregistrer">
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
function sendForm(useMethod) {
  const form = document.getElementById("addForm")
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

    // console.log(submitForm)

    /* J'envoie les données à l'API et je récupére la réponse */
    let url = `https://reqres.in/api/users/`
    url += useMethod === 'PUT' ? submitForm['userId'] : null
    // console.log(url)
    fetch(url, {
      method: useMethod,
      headers: { 'Content-Type': 'application/json' },
      // headers: { 'Content-Type': 'multipart/form-data' },
      body: JSON.stringify(submitForm)
    })
    .then(response => {
      document.getElementById('responseContainer')
              .innerHTML = `<pre>Status: ${response.status}</pre>`
      if(response.ok){
        console.log(response)
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
    document.getElementById('msg').innerText = 'Demande enregistrer, vous pouvez aller voir la « Response ».'
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
          <p>
            <span class="firstName">${first_name}</span>
            <span class="lastName">${last_name}</span>
          </p>
          <p class="email">${email}</p>
        </div>
        <div class="menu">
          <span title="Modifier" onClick="updateUser(${id})"><i class="fas fa-user-edit"></i></span>
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
function updateUser (userId) {
  const user = {
    "id": userId,
    "email": document.querySelector(`#id-${userId} .email`).innerText,
    "first_name": document.querySelector(`#id-${userId} .firstName`).innerText,
    "last_name": document.querySelector(`#id-${userId} .lastName`).innerText,
    "avatar": document.querySelector(`#id-${userId} .avatar img`).src
  }

  container.style = 'display: flex'
  container.innerHTML = formTpl(user)
  avatarPreview()
  responseContainer.innerHTML = '<pre>Enregistrer un « User » pour avoir une « Response ».</pre>'
  addUser.innerHTML = '<i class="fas fa-times"></i>'
  addUser.classList.toggle('active')
}

// Delete
function deleteUser (userId) {
  // console.log(`https://reqres.in/api/users/${userId}`)
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

// login
function loginForm () {
  return `
    <div id="login">
      <form id="loginForm" method="POST">
        <div id="infoLogin"></div>
        <input type="email" name="email" id="email" placeholder="email" required />
        <input type="password" name="password" id="password" placeholder="password" required />
        <input type="submit" value="Se connecter" />
      </form>
    </div>
  `
}

// Se connecter
function sendLoginForm () {
  const loginForm = document.getElementById("loginForm")
  loginForm.addEventListener('submit', e => {
    e.preventDefault()

    // console.log(loginForm)

    let submitLoginForm = {}
    Array.from(new FormData(loginForm), entry => submitLoginForm[entry[0]] = entry[1])
    // Array.from(new FormData(loginForm), entry => console.log(entry))

    // console.log(submitLoginForm)

    /* J'envoie les données à l'API et je récupére la réponse */
    fetch(`https://reqres.in/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitLoginForm)
    })
    .then(response => {
      document.getElementById('responseContainer')
              .innerHTML = `<pre>Status: ${response.status}</pre>`
      const infoStatus = response.status === 200 ? 'Email Valide' : 'Email inconnu'
      document.getElementById('infoLogin')
              .innerHTML += `<p>${infoStatus}</p>`
      if(response.ok){
        // console.log(response)
        response.json().then(data => {
          // console.log(data)
          localStorage.setItem('token', data.token)
          document.getElementById('responseContainer')
                  .innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`
        })
      }
    })
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

// Bouton login
const btnLogin = document.getElementById('btnLogin')
btnLogin.addEventListener('click', () => {
  if (btnLogin.classList.contains('active')) {
    btnLogin.innerHTML = `<p>Connexion</p>`
    readAllUsers()
    addUser.innerHTML = '<i class="fas fa-user-plus"></i>'
  } else {
    container.style = 'display: flex'
    container.innerHTML = loginForm()
    sendLoginForm()
    responseContainer.innerHTML = '<pre>Connectez-vous pour avoir une « Response ».</pre>'
    btnLogin.innerHTML = `<p>Annuler connexion</p>`
  }
  btnLogin.classList.toggle('active')
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
