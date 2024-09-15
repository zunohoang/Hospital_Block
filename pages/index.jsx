import { useEffect } from "react"

export default function Index() {

    useEffect(() => {
        window.location.href = '/login'
    }, [])

    return (
        <div>
            <h1>Redirecting...</h1>
        </div>
    )
}