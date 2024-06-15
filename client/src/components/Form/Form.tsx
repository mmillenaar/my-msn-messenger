import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from './FormGroup/FormGroup';
import Context from '../../context/AppContext';
import { formConfirmPasswordGroup, formEmailGroup, formPasswordGroup, formUsernameGroup } from '../../utils/constants';
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
    const [doPasswordsMatch, setDoPasswordsMatch] = useState<boolean | null>(null)

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const confirmPasswordRef = useRef<HTMLInputElement>(null)

    const { setIsUserLoggedIn, setUserData } = useContext(Context)

    const navigate = useNavigate()

    const handleOnFormSubmit = async () => {
        if (doPasswordsMatch === false) {
            alert('Passwords do not match')

            return
        }

        const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/user/${action}`,
            {
                method: method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value,
                    username: usernameRef.current?.value,
                    confirmPassword: confirmPasswordRef.current?.value,
                })
            }
        )
        const data = await res.json()

        if (res.status === 200) {
            setIsUserLoggedIn(true)
            setUserData(data.user)
            navigate('/')
        }
        else {
            alert(data.message)

            return null
        }
    }

    const onConfirmPasswordBlur = () => {
        if (passwordRef.current?.value === confirmPasswordRef.current?.value) {
            setDoPasswordsMatch(true)
        }
        else {
            setDoPasswordsMatch(false)
        }
    }

    return (
        <div className="form">
            <div className="form__wrapper">
                {action === FormAction.REGISTER &&
                <div className="form__group">
                    <FormGroup
                        groupName={formUsernameGroup.groupName}
                        inputType={formUsernameGroup.inputType}
                        label={formUsernameGroup.label}
                        inputRef={usernameRef}
                    />
                </div>
                }
                <div className="form__group">
                    <FormGroup
                        groupName={formEmailGroup.groupName}
                        inputType={formEmailGroup.inputType}
                        label={formEmailGroup.label}
                        inputRef={emailRef}
                    />
                </div>
                <div className="form__group">
                    <FormGroup
                        groupName={formPasswordGroup.groupName}
                        inputType={formPasswordGroup.inputType}
                        label={formPasswordGroup.label}
                        inputRef={passwordRef}
                    />
                </div>
                {action === FormAction.REGISTER &&
                <div className="form__group">
                    <FormGroup
                        groupName={formConfirmPasswordGroup.groupName}
                        inputType={formConfirmPasswordGroup.inputType}
                        label={formConfirmPasswordGroup.label}
                        inputRef={confirmPasswordRef}
                        onBlur={onConfirmPasswordBlur}
                    />
                </div>
                }
                { doPasswordsMatch === false &&
                    <p className="form__password-match-error">* Passwords do not match</p>
                }
                <div className="form__buttons">
                    <button className="form__buttons-submit" type="submit" onClick={handleOnFormSubmit}>
                        OK
                    </button>
                    <button
                        className="form__buttons-cancel"
                        type="button"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form