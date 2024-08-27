import './ArraySelector.scss'

interface ArraySelectorProps {
    label: string;
    options: string[];
    onChange: (value: string | number) => void;
    value?: string | number;
    defaultValue?: string | number;
}

const ArraySelector = ({label, options, value, defaultValue, onChange}: ArraySelectorProps) => {

    return (
        <div className="array-selector">
            <div className="array-selector__wrapper">
                <label htmlFor={label} className="array-selector__label">{label}</label>
                <select
                    className="array-selector__select"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    defaultValue={defaultValue}
                >
                    {options.map((option, index) => {
                        return (
                            <option
                                key={index}
                                className="array-selector__option"
                                value={option}
                            >
                                {option}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}

export default ArraySelector