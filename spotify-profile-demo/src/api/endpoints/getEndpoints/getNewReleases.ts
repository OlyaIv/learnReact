import axios from "axios";
import { getEndpoints } from "../consts";

export async function getNewReleases(acessToken: string): Promise<string> {
    let response = await axios.get(getEndpoints.newReleases, {
        headers: {
            'Authorization': `Bearer ${acessToken}`
        }
    })
    return response.data;
}
