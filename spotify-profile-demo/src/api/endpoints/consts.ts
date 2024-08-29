export const API_BASE_URL = "https://api.spotify.com/v1";

export const getEndpoints = {
    profile: `${API_BASE_URL}/me`,
    newReleases: `${API_BASE_URL}/browse/new-releases`,
    track: `${API_BASE_URL}/tracks/`
}