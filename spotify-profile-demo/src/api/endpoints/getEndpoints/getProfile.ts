import axios from "axios";
import { API_BASE_URL } from "../consts";

export async function getProfile(accessToken: string): Promise<string> {
  var profile = ''

  await axios.get(`${API_BASE_URL}/me`, { // get the profile data
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
  console.log("Bearer token in console" + accessToken)
  return profile
}
