'use strict'

const LIST_USER = 'listUser';
var listUser = [];

const localMethod = {
    set: function(key, value, callback) {
        localStorage.setItem(key.toString(), JSON.stringify(value))
        if (callback && typeof callback === 'function') {
            callback()
        }
    },
    get: function(key) {
        var data = localStorage.getItem(key.toString());
        if (!!data) {
            return JSON.parse(data);
        } else {
            return null;
        }
    },
    remove: function(key) {
        localStorage.removeItem(key.toString());
    },
    clear: function(key, callback) {
        localStorage.clear(key.toString());
        if (callback && typeof callback === 'function') {
            callback()
        }
    },
}
const getEl = (el) => {
    return document.querySelector(el);
}



var fields = {
    userName: {
        isRequired: true,
        requiredMessage: 'Bạn cần nhập Username',
        format: /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._@]+(?<![_.])$/,
        formatMessage: 'Username dài 6-20 kí tự, chỉ nhận ký tự chữ, số, @, . và _',
    },
    phone: {
        isRequired: true,
        requiredMessage: 'Bạn cần nhập số phone',
        format: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        formatMessage: 'Bạn nhập sai số phone, ví dụ: 0395638866',
    },
    password: {
        isRequired: true,
        requiredMessage: 'Bạn cần nhập password',
        format: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/,
        formatMessage: 'Password dài 6-12 kí tự, phải có ít nhất 1 chữ viết hoa, có ít nhất 1 số, 1 chữ',
    },
    confirmPassword: {
        isRequired: true,
        requiredMessage: 'Bạn cần xác nhận password',
        format: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/,
        formatMessage: 'Password dài 6-12 kí tự, phải có ít nhất 1 chữ viết hoa, có ít nhất 1 số, 1 chữ',
    },
    address: {
        isRequired: true,
        requiredMessage: 'Bạn cần nhập địa chỉ',
        format: /^[a-zA-Z0-9]*.{20,}$/,
        formatMessage: 'Bạn đã nhập sai địa chỉ, độ dài tối thiểu 20 kí tự',
    },

}

const validateFunction = (name) => {
    const data = getEl(`[name=${name}]`).value;
    if (fields[name].isRequired && !data) {
        getEl(`[name=${name}] ~ p`).innerHTML = fields[name].requiredMessage;
        getEl(`#address ~ span`).innerHTML = '';
        return false;
    }

    if (!fields[name].format.test(data)) {
        getEl(`[name=${name}] ~ p`).innerHTML = fields[name].formatMessage;
        getEl(`#address ~ span`).innerHTML = '';
        return false;
    }

    getEl(`[name=${name}] ~ p`).innerHTML = '';

    return true;
}




//Check khớp password jquery
$('#password, #confirmPassword').on('keyup', function() {
    if ($('#password').val() == $('#confirmPassword').val()) {
        $('#confirmPassword ~ p').html('Mật khẩu khớp').css('color', 'green');
    } else
        $('#confirmPassword ~ p').html('Mật khẩu không khớp').css('color', 'red');
});

var submitData = () => {

    var userName = getEl('#userName').value;
    var password = getEl('#password').value;
    var confirmPassword = getEl('#confirmPassword').value;

    //Kiểm tra tài khoản đã được đăng ký chưa
    listUser = localMethod.get(LIST_USER) || [];
    for (let i in listUser) {
        var storedName = listUser[i].userName;
        console.log('storedName', storedName)
    }
    var isValid = true;
    for (let i in fields) {
        isValid = validateFunction(i);
    }

    if (password !== confirmPassword) {
        $('#confirmPassword ~ p').html('Mật khẩu không khớp').css('color', 'red');
    }
    if (userName === storedName) {
        getEl('#userName ~ p').innerHTML = 'Tài khoản đã được đăng ký, vui lòng nhập tài khoản khác';
    }
    if (isValid && password === confirmPassword && userName !== storedName) {
        var userName = getEl('#userName').value;
        var phone = getEl('#phoneNumber').value;
        var address = getEl('#address').value;
        const user = {
            userName,
            password,
            confirmPassword,
            phone,
            address,
        }
        listUser = localMethod.get(LIST_USER) || [];

        listUser.push(user);
        localMethod.set(LIST_USER, listUser, () => {
            getEl(`#address ~ span`).innerHTML = `Đăng ký thành công`;
            getEl(`#address ~ span`).style.color = 'green';
        });
        getEl('#userName').value = '';
        getEl('#password').value = '';
        getEl('#confirmPassword').value = '';
        getEl('#phoneNumber').value = '';
        getEl('#address').value = '';

    }

}

//Check Login
const checkLogin = () => {

    listUser = localMethod.get(LIST_USER) || [];
    var userNameLogin = document.getElementById('userNameLogin').value;
    var userPasswordLogin = document.getElementById('passwordLogin').value;

    for (let i in listUser) {
        var storedName = listUser[i].userName;
        var storedPassword = listUser[i].password;

        if (userNameLogin === storedName && userPasswordLogin === storedPassword) {

            alert('Welcome ' + userNameLogin + ' đăng nhập thành công');
            getEl('#passwordLogin ~ p').innerHTML = '';
            document.getElementById('userNameLogin').value = '';
            document.getElementById('passwordLogin').value = '';
            $('#form_login').delay('slow').fadeOut();

            getEl('#userLoginAccept').innerHTML = `<a>${userNameLogin}</a>`;
            getEl('li:last-child').style.display = 'block';

            break;

        }
        if (userNameLogin !== storedName || userPasswordLogin !== storedPassword) {
            getEl('#passwordLogin ~ p').innerHTML = 'Tên đăng nhập hoặc mật khẩu không đúng';
        }
        if (!userNameLogin && !userPasswordLogin) {
            getEl('#passwordLogin ~ p').innerHTML = 'Vui lòng nhập tên đăng nhập và mật khẩu';
        }
    }
}

const logOut = () => {
    getEl('li:last-child').style.display = 'none';
    getEl('#userLoginAccept').innerHTML = `<a href="" id="login">Login/Register</a>`;

}

const themeMode = () => {

    var isClass = document.querySelector('body').className;
    document.querySelector('body').classList.toggle("dark-mode");

    switch (isClass) {
        case 'dark-mode':
            document.querySelector('#mode').innerHTML = `Dark mode`;
            break;
        default:
            document.querySelector('#mode').innerHTML = `Light mode`;
    }
}

const removeValueRegister = () => {

    getEl('#userName').value = '';
    getEl('#password').value = '';
    getEl('#confirmPassword').value = '';
    getEl('#phoneNumber').value = '';
    getEl('#address').value = '';
    getEl(`#address ~ span`).innerHTML = '';

    try {
        var tagNameP = document.getElementsByTagName('p');
        for (let i = 0; i <= tagNameP.length; i++) {
            tagNameP[i].innerHTML = '';
        }

    } catch (error) {

    }
}

const removeValueLogin = () => {
    getEl('#userNameLogin').value = '';
    getEl('#passwordLogin').value = '';
    getEl('#passwordLogin ~ p').innerHTML = '';

}

window.onload = function() {

    //Jquery ẩn hiện form: 
    $('#login').click(function(event) {
        event.preventDefault();
        $('#form_login').delay('slow').fadeIn();
    });

    $('#link_changeFormRegister').click(function(event) {
        event.preventDefault();
        $('#form_login').delay('slow').fadeOut();
        $('#form_register').delay('slow').fadeIn();
        removeValueRegister();

    });

    $('#link_changeFormLogin').click(function(event) {
        event.preventDefault();
        $('#form_register').delay('slow').fadeOut();
        $('#form_login').delay('slow').fadeIn();
        removeValueLogin();

    });

    $('#pseudo_formRegister').click(function(event) {
        event.preventDefault();
        $('#form_register').delay('slow').fadeOut();
    });

    $('#pseudo_formLogin').click(function(event) {
        event.preventDefault();
        $('#form_login').delay('slow').fadeOut();
    });

    //Dark mode / Light mode
    $('#mode').click(function(event) {
        event.preventDefault();
        themeMode();

    });

    //Submit
    $('#submitRegister').click(function(event) {
        event.preventDefault();
        submitData();
    });

    $('#submitLogin').click(function(event) {
        event.preventDefault();
        checkLogin();
    });
    //logout
    $('#logout').click(function(event) {
        event.preventDefault();
        logOut();
    });


}