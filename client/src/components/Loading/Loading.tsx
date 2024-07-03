import { useEffect, useState } from "react"
import { firstLoadingMessage } from "../../utils/constants"
import loadingImage from '../../assets/icons/MSN-messenger-icon.webp'
import "./Loading.scss"

const Loading = () => {
    const [loadingMessage, setLoadingMessage] = useState<string>("")

    const isServerLoaded = JSON.parse(sessionStorage.getItem("isServerLoaded")!)

    useEffect(() => {
        if (!isServerLoaded) {
            setLoadingMessage(firstLoadingMessage)
            sessionStorage.setItem("isServerLoaded", "true")
        } else {
            setLoadingMessage("Loading...")
        }
    }, [])

    return (
        <div className="loading">
            <div className="loading__wrapper">
                <p className="loading__text">{loadingMessage}</p>
                <img src={loadingImage} alt="MSN Messenger" className="loading__image" />
            </div>
        </div>
    )
}

export default Loading
