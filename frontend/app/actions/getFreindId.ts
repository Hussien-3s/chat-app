import axios from "axios"

export default async function FreindId(username: string) {
    const res = await axios.get(`http://localhost:8080/api/get-username/${username}`)
    return res.data
}