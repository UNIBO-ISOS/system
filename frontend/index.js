$(document).ready(() => {
    const url = "http://acmeat_backend:5000"

    $("#login_btn").on("click", () => {
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
    })
})