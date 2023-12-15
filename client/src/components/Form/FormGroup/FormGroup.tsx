import { forwardRef } from 'react';

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
            <div className="form__group">
                <label htmlFor={ groupName }>{ label }</label>
                <input
                    ref={ref || inputRef}
                    type={ inputType }
                    name={ groupName }
                    id={groupName}
                    onBlur={ onBlur }
                />
            </div>
        );
    }
);

export default FormGroup;
