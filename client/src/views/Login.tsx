import Form, { FormAction, FormMethod } from "../components/Form/Form"

const Login = () => {

    return (
        <div className="login">
            <div className="login__wrapper">
                <h1 className="login__title">Login</h1>
                <div className="login__logo"></div>
                <div className="login__avatar"></div>
                <div className="login__form">
                    <Form action={FormAction.LOGIN} method={FormMethod.POST} />
                </div>
                <div className="login__helpers">
                    <div className="login__helpers-links">
                        <a href="/new-password">Forgot your password?</a>
                        <a href="/register">Get a new account</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login