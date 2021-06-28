$(function () {
    $("#btn-login").click(function (e) { 
        e.preventDefault();
        let email=$("#inputEmail").val();
        let password=$("#inputPassword").val();
        console.log(email + password)
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "https://api-chat-web.herokuapp.com/api/auth/signin",
            contentType: 'application/json',
            data: JSON.stringify( { "username": email, "password": password} ),
        }).always(function(data) {
       
       
             $("#login-form").submit(); 
            localStorage.setItem("token",data.token);
        
        });
    });
});