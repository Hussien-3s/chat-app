import API from "@/config/axiosConfig"

export async function FreindId(username: string) {
    const res = await API.get(`/get-username/${username}`)
    return res.data
}

export async function FreindName(Id: string) {
    const res = await API.get(`/get-user-by-id/${Id}`)
    return res.data
}
