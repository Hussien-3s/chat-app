import axios from "axios"

export async function FreindId(username: string) {
    const res = await axios.get(`http://localhost:8080/api/get-username/${username}`)
    return res.data
}

export async function FreindName(Id: string) {
    const res = await axios.get(`http://localhost:8080/api/get-user-by-id/${Id}`)
    return res.data
}