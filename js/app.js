/*
$(document).ready(function(){
	//
});
*/



$(function(){
	console.log('App Entry');

    // Load native UI library
    var gui = require('nw.gui');
    // Get the current window
    var winC = gui.Window.get();
    
    //
     $('#btnLogin').on('click',function(event){
        event.preventDefault();
        console.log('TODO: Login');
        openLoginWin();
        //finally
        return false;
    });

    var new_win = null;
    var intervalID = null;
    //google App settings
    var aClientId = 'AppID';
    var apiKey = 'AppSecret';
    var aScopes = 'https://www.googleapis.com/auth/plus.login';
    //var scopes = 'email%20profile';
    //var scopes = 'https://www.googleapis.com/auth/plus.me';

    //var aRedirect_uri = 'http://localhost';//does not work everywhere, data: on URL
    var aRedirect_uri = 'urn:ietf:wg:oauth:2.0:oob';//data: on title

    //google Auth API url
    var googleURI = 'https://accounts.google.com/o/oauth2/auth?response_type=code'+'&redirect_uri='+aRedirect_uri+'&scope='+aScopes+'&client_id='+aClientId;
    //
    var authUserCode = null;

    var openLoginWin = function(){
        // Create a new window and get it
        var winConf = "location=1,status=1,scrollbars=1,  width=500,height=100";
        new_win = gui.Window.get( window.open(googleURI,"loginWindow",winConf) );
        new_win.on('loaded',checkURIChangeOnLoad);
    };

    var checkURIChangeOnLoad = function(){
        var sTitle = new_win.window.document.title;
        console.log(sTitle);
        //var that = this;
        
        //check for auth code and close the window
        var iS = iF = -1;
        iS = sTitle.indexOf("Success authuser");
        iF = sTitle.indexOf("Denied error");
        if((iS===-1)&&(iF===-1)){
            console.log('Do Nothing.');
        }else{
            new_win.close();
            new_win = null;
            //get the code from the data
            //parse the string to get the data
            var arrayOfStrings = sTitle.split("&");
            console.log(arrayOfStrings);
            var resultObj = arrayOfStrings[0];
            var aResultObj = resultObj.split("=");
            var sResult = aResultObj[0];
            var sValue = aResultObj[1];
            //console.log(sResult+':'+sValue);
            if(sResult==='Success authuser'){
                //get the auth code and move on
                for(var i=0;i<arrayOfStrings.length;i++){
                    var oData = arrayOfStrings[i];
                    var a = oData.split("=");
                    var sKey = a[0];
                    var sValue = a[1];
                    console.log(sKey+':'+sValue);
                    if(sKey==='code'){
                        //console.log(authUserCode);
                        authUserCode = sValue;
                        onGotAuthCode();
                    }
                }
            }else{
               console.log('Opps! Not an authenticated user.'); 
            }
        }
        //console.log('Authenticated user code='+authUserCode);
    };
    var checkURI = function(){
        var u = new_win.window.location.href;
        //console.log(u);
        //console.log(new_win.window.location);
        console.log(new_win.window.document);
        //check
        if(u===googleURI){
            //DO Nothing
        }else{
            clearInterval(intervalID);
            console.log('URL Change :  detected');
            var u1 = new_win.window.location.href;
            console.log(u1);
            console.log(new_win.window.document.location.href);
        }
    };
    var onGotAuthCode = function(){
        console.log('onGotAuthCode:'+authUserCode);
        //
        //var u = '/o/oauth2/token';
        var u = 'https://accounts.google.com/o/oauth2/token';
        var dataObj = {code:authUserCode, client_id:aClientId,client_secret:apiKey,redirect_uri:aRedirect_uri,grant_type:'authorization_code' };
        $.ajax({
                type:"post",
                url:u,
                dataType: "json",
                data:dataObj,  
                success:function(result){          
                    console.log('SUCCESS');
                    //var demo = require('saumya/demoModule');
                    //console.log(demo.getName());
                    //console.log(result);
                    //onGotToken(result);
                    var myAppModule = require('saumya/entry');
                    console.log(myAppModule.getName());
                },
                error:function(data){
                    console.log('ERROR : getAllBands : ');
                    console.log(data);           
                }
        });
    };

    var onGotToken = function(resultObj){
        console.log('onGotToken');
        console.log(resultObj);
        application.init();
        application.setAuthObject(resultObj);
    };
    
});

var application = {
    userAuthObj:null,
    init: function(){
        console.log('application : init');

    },
    setAuthObject: function(authObj){
        console.log('application : setAuthObject : ');
        console.log(authObj);
        this.userAuthObj = authObj;
    },
    destroy: function(){
        console.log('application : destroy');
    }
};