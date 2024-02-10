async function validateuser(){
    let jwt=getCookie("jwt");
    const url = '/app/auth/validate';
    let jwtheader=`Bearer ${jwt}`;
    const requestOptions = {
      method: 'POST',
      headers: {
          'Content-type':'application/json',
          'Authorization': jwtheader
      }
    }
    try {
        //FIRST VERIFY IF THE TOKEN IS VALID AF IF NOT, REFRESH IT
        if(isTokenExpired(jwt)){
            let refreshToken=getCookie("refresh")
            let refreshObject={token: refreshToken};
            fetch('/app/auth/refresh', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify(refreshObject)})
            .then(response => { if(response.ok) return response.json(); })
            .then(data=>{
               document.cookie = `jwt=${data.token}`;
               document.cookie = `refresh=${data.refreshToken}`;
               //RETURN TRUE IF THE RESPONSE FROM THE SERVER IS OK, OTHERWISE LOGIN NOT VALID AND RETURN FALSE
               fetch(url,requestOptions)
               .then(response=>{ if (response.status!=200) return false;
                                 return true; })
               .catch(error => { return false; })
               })
            .catch(error => { console.log("Error refreshing token");
            return false;
            });

        }
        else{
            //USE THE TOKEN
                    const response = await fetch(url,requestOptions);
                    //RETURN TRUE IF THE RESPONSE FROM THE SERVER IS OK, OTHERWISE LOGIN NOT VALID AND RETURN FALSE
                    if (response.status!=200) return false;
                    return true;

        }

      } catch (error) {
        return false;
      }
  }

  function isTokenExpired(token) {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));

      // Check if EXPIRATION claim exists in the payload
      if (payload && payload.exp) {
          const expirationTimeMs = payload.exp * 1000;
          const currentTimeMs = new Date().getTime();
          return currentTimeMs >= expirationTimeMs;
      } else {
          console.log("EXPIRED")
          return true;
      }
  }

  function currentuser(){
    const token=getCookie("jwt")
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    if (payload && payload.sub) return payload.sub;
    return null;
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

