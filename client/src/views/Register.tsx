import Form, { FormAction, FormMethod } from "../components/Form/Form"

const Register = () => {

    return (
        <div className="register">
            <div className="register__wrapper">
                <h1 className="register__title">Register</h1>
                <div className="register__form">
                    <Form action={FormAction.REGISTER} method={FormMethod.POST} />
                </div>
                <div className="register__back-button">
                    <a href="/">Back to login</a>
                </div>
            </div>
        </div>
    )
}

export default Register