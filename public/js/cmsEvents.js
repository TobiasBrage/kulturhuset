if(readCookie('user_login')) {
    console.log('logged in');
} else {
    window.location.href = '/login';
}