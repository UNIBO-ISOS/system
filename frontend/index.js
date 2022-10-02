const url = "/api"

function login(){
    const username = $("#uname").val()
    const password = $("#psw").val()

    $.ajax({
    url: url + "/users/login",
    type: "post",
    data: {
        username: username,
        password: password
    },
    success: (response) => {
        console.log(response)
    },
    error: (jqxhr, status, error) => {
        console.log(error)
    }
})
}

$(document).ready(() => {
    $("#login_btn").on("click", login())
    $("#psw").on("keyup", (e) => {

        if(e.key == "Enter"){
            login()
        }
    })
})