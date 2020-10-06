
// client_id_ in header.ejs 
function init() {
    gapi.load('auth2', function() {
        /* Ready. Make a call to gapi.auth2.init or some other API */
        gapi.auth2.init({
                client_id: client_id_
        }) 
        
    });
}

function signOut() 
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out of google.');
    });
}

// FB sign out
window.fbAsyncInit = function() {
    FB.init({
        appId      : fb_app_id_,  /* Fb app id is already on top */ 
        cookie     : true,
        xfbml      : true,
        version    : 'v8.0'
    });
        
    FB.AppEvents.logPageView();  
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {   // Logged into your webpage and Facebook.
            console.log(response);
          } 
    });

    };
    
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
       
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'))
   
function fbLogout() {
    FB.logout(function(response) {
        console.log("Logged out of facebook")
     });
}


function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
    //console.log("I got it " + cookie[name]);
    return cookie[name];
}

$('#postpay').click(function(){
    
    if( $('#product_name').val() === "" || $('#product_id').val() === "" || $('#product_price').val() === "" ) {
        console.log(" All fields are required ");
        return; 
    }
    var x = getCookie('grishmat');
    $.ajax({
        url: SITE_NAME + '/api/pay',
        type: 'post',
        data : JSON.stringify({
            product_name : $('#product_name').val(),
            product_id : $('#product_id').val(),
            product_price : $('#product_price').val()
        }),
        contentType: "application/json",
        dataType: 'json',
        xhrFields: {  //setting this is very important as cookies won't be send otherwise
        withCredentials: true
        },
        success : function(json) {
            const str = "<pre style='color:green;'>" + json.message + "<pre>";
            $('#postpaymsg').hide().html(str).fadeIn(1000).delay(1000).fadeOut(2000) ;
            //console.log(json); 
        }  
    });
});
$('#getpay').click(function(){  //get history
    var x = getCookie('grishmat'); 
    if(x == undefined || x==null) return; 
    $.ajax({
        url: SITE_NAME + '/api/pay',
        type: 'get',
        contentType: "application/json",
        dataType: 'json',
        xhrFields: {  //setting this is very important as cookies won't be send otherwise
        withCredentials: true
        },
        success : function(json) {
            //console.log(json); 
            printDetails(json.data); 
        }
    });
});

function printDetails(resultArr){ 
    if(resultArr.length===0 || resultArr === undefined || resultArr === null) {
        $("#details").html("<p>No transactions so far</p>");
        return; 
    }
    $("#details").html("<table><tr><th> Time </th><th> Date </th><th> Product Name </th><th> Producut ID </th>  <th> Product Price</th></tr> </table>");
    var x = '<td>'; var y = '</td>';
    var str; 
    var prev = 0; 
    for(var i=0;i<resultArr.length;i++)
    {
        const obj = resultArr[i]; 
        str =  x + obj.ttime + y; 
        str += x + obj.tdate + y; 
        str += x + obj.pname + y;
        str += x + obj.pid + y;
        str += x + obj.pprice + y; 
        str = '<tr>' + str + '</tr>';  
        $("#details table").hide().append(str).fadeIn(1000); 
    }
    
}

$('#logout').click(function(){  //logs you out 
    
    try {
        signOut();  //signs out of google 
        fbLogout(); //signs out of facebook
    } catch(err) {
      console.log("All good "); 
    }
    
    //clears cookie 
    var expdate = new Date()
    expdate.setDate(expdate.getDate() - 1);
    document.cookie = "grishmat=" + ";expires=" + expdate.toUTCString() + ";"; //grishmat is jwt token 
    window.location.replace(SITE_NAME);
    
});