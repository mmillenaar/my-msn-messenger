import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate('/login')
        }, 2000);
    }, [])

    return (
        <div className="logout">
            <div className="logout__wrapper">
                <h1>You have been successfully logged out</h1>
            </div>
        </div>
    )
}

export default Logout