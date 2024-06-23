import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const RedirectHandler = () => {
    const navigate = useNavigate()
    const { redirectTo } = useParams()

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo, { replace: true })
        }
    }, [navigate, redirectTo])

    return null
}

export default RedirectHandler