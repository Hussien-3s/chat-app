"use client"

import { useState } from "react"
import axios from "axios"

export default function addConversationInput() {
    const [messageToInput, setMessageToInput] = useState("message")

    return (
        <h1 className="text-2xl font-bold text-white tracking-tight">Massge</h1>
    )
}
