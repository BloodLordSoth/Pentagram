const email = document.getElementById('email')
const username = document.getElementById('username')
const password = document.getElementById('password')
const btn = document.getElementById('btn1')

async function registerUser() {
    if (email.value.length === 0) {
        alert('Email field is missing')
        return
    }

    if (username.value.length === 0) {
        alert('Username field is missing')
        return
    }

    if (password.value.length === 0) {
        alert('Password field is missing')
        return
    }

    const dataObj = {
        email: email.value,
        username: username.value,
        password: password.value
    }

    const res = await fetch('/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj)
    })

    if (!res.ok) {
        const error = await res.json()
        alert(error.message)
        return
    }

    const data = await res.json()
    localStorage.setItem('Username', data.username)
    window.location.href = './login.html'
}

btn.addEventListener('mousedown', () => {
    registerUser()
})