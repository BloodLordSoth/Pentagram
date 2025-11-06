const submit = document.getElementById('submit')
const logoutbtn = document.getElementById('logout')
const clear = document.getElementById('clear')
const continuePrompt = document.getElementById('continue')
const download = document.getElementById('download')
const target = document.getElementById('target')
const aiprompt = document.getElementById('prompt')

const token = localStorage.getItem('accessToken')

if (!token) {
    logout()
}

async function fetchPreview() {
    const file = localStorage.getItem('userFile')

    const res = await fetch(`/users/${file}`)

    if (!res.ok) {
        const error = await res.json()
        alert(error.message)
        return
    }

    target.src = `/users/${file}`
    submit.style.display = 'none'
    continuePrompt.style.display = 'block'
    clear.style.display = 'block'
    download.style.display = 'block'
}
fetchPreview()

async function validate() {
    const res = await fetch('/tokenValidate', {
        headers: { 'Authorization': `Bearer ${token}`}
    })

    if (!res.ok) {
        logout()
        return
    }
    
}
setInterval(() => {
    validate()
}, 10000)

function logout() {
    localStorage.removeItem('accessToken')
    window.location.href = './login.html'
}

async function sendPrompt() {
    const message = aiprompt.value

    if (!message) {
        alert('Message required to prompt ai.')
        return
    }

    const res = await fetch('/prompt', {
        method: "POST",
        headers: {
             "Content-Type": "application/json" ,
             "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: message })
    })

    if (!res.ok) {
        const error = await res.json()
        alert(error.message)
        return
    }

    aiprompt.value = ''

    submit.style.display = 'none'
    continuePrompt.style.display = 'block'
    download.style.display = 'block'
    clear.style.display = 'block'
    const data = await res.json()
    localStorage.setItem('userFile', data.file)
    fetchPreview()
}

submit.addEventListener('mousedown', () => {
    sendPrompt()
})

download.addEventListener('mousedown', async () => {
    const reqFile = localStorage.getItem('userFile')
    const res = await fetch(`/download/${reqFile}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) {
        const error = await res.json()
        alert(error.message)
        return
    }

    const data = await res.json()
    const blob = new Blob([data.file], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'index.html'
    a.click()
})

continuePrompt.addEventListener('mousedown', async () => {
    if (aiprompt.value.length === 0) {
        alert('No prompt has been provided')
        return
    }

    if (aiprompt.value.length < 15) {
        alert('You need to provide more context.')
        return
    }

    const filename = localStorage.getItem('userFile')

    const res = await fetch(`/reprompt/${filename}`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiprompt.value })
    })

    if (!res.ok) {
        const error = await res.json()
        alert(error.message)
        return
    }

    const data = await res.json()
    target.src = data.file
    window.location.reload()
})

clear.addEventListener('mousedown', () => {
    target.src = './nofile.html'
    clear.style.display = 'none'
    continuePrompt.style.display = 'none'
    download.style.display = 'none'
    submit.style.display = 'block'
    localStorage.removeItem('userFile')
})

logoutbtn.addEventListener('mousedown', () => {
    logout()
})
