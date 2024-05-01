import Form, { FormAction, FormMethod } from "../components/Form/Form"
import msnLogo from '../assets/icons/MSN-messenger-icon.webp'
import { registerText } from "../utils/constants"
import { ReactComponent as MicrosoftNetIcon } from '../assets/icons/microsoft-net.svg'
import '../styles/views/Register.scss'

const Register = () => {

    return (
        <div className="register">
            <div className="register__wrapper window">
                <div className="register__window-title title-bar">
                    <div className="title-bar-text">
                        Register to .NET Messenger Service
                    </div>
                </div>
                <div className="register__window-content">
                    <div className="register__img-wrapper">
                        <img className="register__img-image" src={ msnLogo } alt="MSN logo" />
                        <p className="register__img-text">{ registerText }</p>
                    </div>
                    <div className="register__form">
                        <Form action={FormAction.REGISTER} method={FormMethod.POST} />
                    </div>
                    <div className="login__microsoft-net-logo">
                        <p className="login__microsoft-net-logo-text">Passport</p>
                        <MicrosoftNetIcon />
                    </div>
                    <div className="register__back-button">
                        <a href="/">Back to login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register