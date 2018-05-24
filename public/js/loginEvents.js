if(readCookie('user_login')) {
    window.location.href = '/cms';
} else {
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginSubmit = document.getElementById("loginSubmit");
    let token = createToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    loginSubmit.addEventListener('click', (event) => {
        let init = {
            method: 'POST',
            headers: headers,
            body: `{"username":"${loginUsername.value}","password":"${hashMd5(loginPassword.value)}","token":"${token}"}`,
            cache: 'no-cache',
            mode: 'cors'
        };
        let request = new Request('http://localhost:3000/cms/login', init);
        fetch(request)
        .then(response => {
            return response.json();
        })
        .then((data) => { 
            if(data.message == 'success') {
                createCookie('user_login', token, 1);
                window.location.href = '/cms';
            } else if(data.message == 'no match') {
                console.log('no macth');
            } else {
                console.log('error');
            }
        });
    });
}