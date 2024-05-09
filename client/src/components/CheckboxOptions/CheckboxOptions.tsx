import { CheckboxOptionType } from '../../utils/types'
import './CheckboxOptions.scss'

interface CheckboxOptionsProps {
    options: CheckboxOptionType[];
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxOptions = ({ options, handleChange }: CheckboxOptionsProps) => {

    return (
        <div className="checkbox-options">
            {options.map(option => {
                return (
                    <div key={option.id} className="checkbox-options__option field-row">
                        <input
                            type="checkbox"
                            className="checkbox-options__option-input"
                            id={option.id}
                            name={option.name}
                            onChange={handleChange}
                            checked={option.checked}
                        />
                        <label htmlFor={option.id} className="checkbox-options__option-label">
                            {option.label}
                        </label>
                    </div>
                )
            })}
        </div>
    )
}

export default CheckboxOptions