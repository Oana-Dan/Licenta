let User = (function () {
    let isLoggedIn = false;
    let email = "";

    let getIsLoggedIn = function () {
        return isLoggedIn;
    }

    let setIsLoggedIn = function (isLogged) {
        isLoggedIn = isLogged;
    }

    let getEmail = function () {
        return email;
    }

    let setEmail = function (email2) {
        email = email2;
    }

    return {
        getIsLoggedIn: getIsLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        getEmail: getEmail,
        setEmail: setEmail
    }

})()

export default User;