const btn = document.getElementById('btn1')
const username = document.getElementById('username')
const password = document.getElementById('password')

const userToken = localStorage.getItem('Username')

if (userToken) {
    username.value = userToken
}

async function login() {
    if (username.value.length === 0) {
        alert('Username field is required')
        return
    }

    if (password.value.length === 0) {
        alert('Password field is required')
        return
    }

    const res = await fetch('/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value, password: password.value })
    })

    password.value = ''

    if (!res.ok) {
        const error = await res.json()
        alert(error.message)
        return
    }

    const data = await res.json()
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('Username', data.username)
    window.location.href = './preview.html'
}

btn.addEventListener('mousedown', () => {
    login()
})