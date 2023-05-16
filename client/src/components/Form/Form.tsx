import { Navigate } from 'react-router-dom';
import './Form.scss'

export enum FormMethod {
    GET = 'GET',
    POST = 'POST',
}
export enum FormAction {
    LOGIN = 'login',
    REGISTER = 'register',
}

interface FormProps {
    action: string;
    method: FormMethod;
}

const Form = ({ action, method }: FormProps) => {

    const UsernameGroup = () => {
        return (
            <div className="form__group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
            </div>
        )
    }
    const ConfirmPasswordGroup = () => {
        return (
            <div className="form__group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" />
            </div>
        )
    }
    const handleOnFormSubmit = () => {
        return <Navigate to='/' />
    }

    return (
        <div className="form">
            <form action={`/${action}`} method={method} className="form__wrapper" onSubmit={handleOnFormSubmit}>
                { action === FormAction.REGISTER && <UsernameGroup /> }
                <div className="form__group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" />
                </div>
                <div className="form__group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" />
                </div>
                { action === FormAction.REGISTER && <ConfirmPasswordGroup /> }
                <div className="form__buttons">
                    <button className="form__buttons-cancel" type="button">Cancel</button>
                    <button className="form__buttons-submit" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Form