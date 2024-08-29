import axios from 'axios'

export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier"); //we load the verifier from local storage and using both the code returned from the callback and the verifier to perform a POST to the Spotify token API. The API uses these two values to verify our request and it returns an access token.
    var access_token = ''
  
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier!);
  
    await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
      },
    })
    .then(function (response) {
      access_token = response.data.access_token
      console.log(access_token);
    })
    .catch(function (error) {
      console.log(error);
    }) 
  
    return access_token;
  }