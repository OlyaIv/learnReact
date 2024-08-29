import axios from "axios";
import {getEndpoints} from "../consts";

export async function getTrack(accessToken: string, id: string): Promise<string> {
    let response = await axios.get(`${getEndpoints.track}/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.data
}
