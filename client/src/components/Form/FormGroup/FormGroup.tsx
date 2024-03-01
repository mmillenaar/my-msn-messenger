import { forwardRef } from 'react';
import './FormGroup.scss'

interface FormGroupProps {
    groupName: string;
    inputType: string;
    label: string;
    inputRef?: React.RefObject<HTMLInputElement>;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormGroup = forwardRef<HTMLInputElement, FormGroupProps>(
    ({ groupName, inputType, label, inputRef, onBlur }, ref) => {
        return (
            <div className="form-group">
                <div className="form-group__wrapper">
                    <label className='form-group__label' htmlFor={ groupName }>
                        { label }
                    </label>
                    <input
                        className='form-group__input'
                        ref={ref || inputRef}
                        type={ inputType }
                        name={ groupName }
                        id={groupName}
                        onBlur={ onBlur }
                    />
                </div>
            </div>
        );
    }
);

export default FormGroup;
