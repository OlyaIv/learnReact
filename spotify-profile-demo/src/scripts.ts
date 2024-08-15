import axios from 'axios'

const clientId = "c0c2571297dc4471992f932ec37d12ec"; 
const params = new URLSearchParams(window.location.search);
const code = params.get("code") 

if(!code){
  console.log("inside if when no code") // check if the callback contains a code parameter. If it doesn't, we redirect the user to the Spotify authorization endpoint.
  redirectToAuthCodeFlow(clientId)
}
else {
  const accessToken = await getAccessToken(clientId, code);
  const profile = await getProfile(accessToken);
  const newReleases = await getNewReleases(accessToken);
  const track = await getTrack(accessToken);
  console.log(profile)
  console.log(track)
  populateUI(profile);
}

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128); // we're using this to verify that our request is authentic.
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier); // we store the verifier in local storage so that we can use it later. Which works like a password for the token exchange process.

  const params = new URLSearchParams(); // new URLSearchParams object is created and we add following parameters to it
  params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback"); //URL that Spotify will redirect the user back to after they've authorized the app. URL that points to our local Vite dev server.
    params.append("scope", "user-read-private user-read-email"); //The scope is a list of permissions that we're requesting from the user. 
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`; 
}

function generateCodeVerifier(length: number) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
}

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

async function getProfile(accessToken: string): Promise<string> { 
  var profile = ''

  await axios.get('https://api.spotify.com/v1/me', { // get the profile data
    headers: {
      'Authorization': `Bearer ${accessToken}` // access token that we got from the https://accounts.spotify.com/api/token endpoint.
    }
  })
  .then(function (response) {
    profile = response.data
    console.log(profile);
  })
  .catch(function (error) {
    console.log(error);
  })
  console.log("Bearer token in console" + accessToken )
  return profile
}

async function getNewReleases(acessToken:string): Promise<string> {
  let response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
    headers: {
      'Authorization': `Bearer ${acessToken}`
    }
  })
  return response.data;
}

async function getTrack(acessToken:string): Promise<string> {
  let response = await axios.get('https://api.spotify.com/v1/tracks/62bOmKYxYg7dhrC6gH9vFn?si=bf97783417964f51', {
    headers: {
      'Authorization': `Bearer ${acessToken}`
    }
  })
  return response.data
 }

async function refreshAccessToken(clientId: string){
  const refreshToken = localStorage.getItem("refreshToken");
  const url = `https://accounts.spotify.com/api/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken!);
  params.append("client_id", clientId);

  const response = await axios.post(url, params, {
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
 
  localStorage.setItem('access_token', response.data.accessToken);
  localStorage.setItem('refresh_token', response.data.refreshToken);
}

function populateUI(profile: any) {
    document.getElementById("displayName")!.innerHTML = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image (200, 200 )
        profileImage.src = profile.images[0].url
        document.getElementById("avatar")!.appendChild(profileImage);
    }
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify)
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';

}