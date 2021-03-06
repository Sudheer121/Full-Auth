var expdate = new Date();
expdate.setDate(expdate.getDate() + 7);

function validateForm() {

    var errorCount = 0; 
    var fields = ['email','password'];
    var a = $('#email').val(); 
    var b = $('#password').val(); 
    fields.forEach((el)=> {
        var x = $("#" + el).val(); 
        if (x === null || x === "") {
            $("#" + el + "_error").html("This field can't be empty");
            $("#" + el).css({"margin-bottom":"0px"});
            ++errorCount;
        } else  {
            $("#" + el + "_error").html("");
            $("#" + el).css({"margin-bottom":"10px"});
        }
    });

    regex = /\S+@\S+\.\S+/;
    if(a!=null && a.length!=0 && !regex.test(a)) {
        $('#email_error').html("Please enter a valid email");
        $("#email").css({"margin-bottom":"0px"});
        ++errorCount;
    } 
    if(b!=null && b.length!=0 && b.length < 8) {
        $('#password_error').html("Password is not valid");
        $("#password").css({"margin-bottom":"0px"});
        ++errorCount;
    } 
    if (errorCount) return 0;
    return 1
}

// logs in the user from nu 
$("#main_login").bind("click", function(){
    if(validateForm()) {
        
        $.ajax({
            url: SITE_NAME + '/login',  
            type: 'post',
            data: JSON.stringify({ 
              email: $('#email').val(),
              password: $('#password').val(),
            }),
            contentType: "application/json",
            dataType: 'json',
            success: function(jsonobj) {        
                if(jsonobj.success===1) {   
                    $('#login_message').html("Logged in successfully") ;     
                    window.location.replace(SITE_NAME);
                } else {
                    $('#login_message').html(jsonobj.message);
                }
            }
        }); 
    }
    
});


/*

// For reset password feature :( not using as of now 

function toggleResetPswd(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle() // display:block or none
    $('#logreg-forms .form-reset').toggle() // display:block or none
}

$(()=>{
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
})

*/ 
