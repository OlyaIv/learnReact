import {authConstants } from './api/auth/consts'
import { getAccessToken } from './api/auth/getToken'
import { getProfile } from './api/endpoints/getEndpoints/getProfile'
import { populateUI } from './ui/populateUI'

const params = new URLSearchParams(window.location.search);
const code = params.get("code") 

if(!code){
    console.log("inside if when no code") // check if the callback contains a code parameter. If it doesn't, we redirect the user to the Spotify authorization endpoint.
    redirectToAuthCodeFlow(authConstants.clientId)
  }
  else {
    const accessToken = await getAccessToken(authConstants.clientId, code);
    const profile = await getProfile(accessToken);
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

