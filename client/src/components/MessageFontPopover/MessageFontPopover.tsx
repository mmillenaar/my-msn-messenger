import { ChangeEvent, CSSProperties, useRef, useState } from 'react'
import { chatMessageFontColors, chatMessageFontFamilies, chatMessageFontSizes, chatMessageFontStyles } from '../../utils/constants'
import WindowLayout from '../WindowLayout/WindowLayout'
import ArraySelector from '../ArraySelector/ArraySelector'
import './MessageFontPopover.scss'

interface MessageFontPopoverProps {
    defaultStyle: CSSProperties | undefined
    onCancelClick: () => void
    onOkClick: (messageStyle: CSSProperties) => void
}

const searchFontStyleProperty = (fontStyle?: string, fontWeight?: string) => {
    if (fontStyle?.includes(('italic' || 'Italic')) && fontWeight?.includes('bold' || 'Bold')) {
        return 'Bold Italic'
    }
    else if (fontStyle?.includes('italic' || 'Italic')) {
        return 'Italic'
    } else if (fontWeight?.includes('bold' || 'Bold')) {
        return 'Bold'
    } else {
        return 'Normal'
    }
}

const MessageFontPopover = ({ defaultStyle, onCancelClick, onOkClick }: MessageFontPopoverProps) => {
    const [fontFamily, setFontFamily] = useState<string | undefined>(defaultStyle?.fontFamily)
    const [fontSize, setFontSize] = useState<string | number | undefined>(defaultStyle?.fontSize)
    const [fontColor, setFontColor] = useState<string | undefined>(defaultStyle?.color)
    const [fontStyle, setFontStyle] = useState<string | undefined>(
        searchFontStyleProperty(defaultStyle?.fontStyle, defaultStyle?.fontWeight as string)
    )
    const [textDecoration, setTextDecoration] = useState<string[]>(
        typeof defaultStyle?.textDecoration === 'string' ? defaultStyle?.textDecoration.split(' ') : []
    )

    const colorInputRef = useRef<HTMLInputElement>(null)

    const handleCheckboxChange = (parameter: string) => {
        if (textDecoration?.includes(parameter)) {
            setTextDecoration(textDecoration.filter(item => item !== parameter))
        } else {
            setTextDecoration([...textDecoration, parameter])
        }
    }
    const handleColorInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFontColor(event.target.value)
    }
    const handleColorSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (colorInputRef.current) {
            colorInputRef.current.value = event.target.value
            setFontColor(event.target.value)
        }
    }
    const isFontColorSelectedFromDefault = () => {
        const defaultColorsHexValues = chatMessageFontColors.map(color => color.hex)

        return defaultColorsHexValues.includes(fontColor!)
    }

    return (
        <div className="message-font-popover">
            <WindowLayout title='Change My Message Font'>
                <div className="message-font-popover__wrapper">
                    <div className="message-font-popover__font-settings">
                        <div className="message-font-popover__font-settings-item">
                            <ArraySelector
                                label='Font:'
                                options={chatMessageFontFamilies}
                                value={fontFamily ? fontFamily : 'Tahoma'}
                                onChange={(value) => setFontFamily(String(value))}
                            />
                        </div>
                        <div className="message-font-popover__font-settings-item">
                            <ArraySelector
                                label='Size:'
                                options={chatMessageFontSizes}
                                value={fontSize ? fontSize : '16'}
                                onChange={(value) => setFontSize(value)}
                            />
                        </div>
                        <div className="message-font-popover__font-settings-item">
                            <ArraySelector
                                label='Font style:'
                                options={chatMessageFontStyles}
                                value={fontStyle}
                                // defaultValue={searchFontStyleProperty(fontStyle)}
                                onChange={(value) => setFontStyle(String(value))}
                            />
                        </div>
                    </div>
                    <div className="message-font-popover__font-displays">
                        <div className="message-font-popover__grouped-display">
                            <span className="message-font-popover__grouped-display-title">Effects</span>
                            <div className="message-font-popover__grouped-display-item grouped-display-item">
                                <input
                                    type='checkbox'
                                    className='grouped-display-item__checkbox'
                                    id='line-through'
                                    name='line-through'
                                    checked={textDecoration?.includes('line-through')}
                                    onChange={() => handleCheckboxChange('line-through')}
                                />
                                <label
                                    htmlFor="line-through"
                                    className='grouped-display-item__checkbox-label'
                                >
                                    Strikeout
                                </label>
                            </div>
                            <div className="message-font-popover__grouped-display-item grouped-display-item">
                                <input
                                    type='checkbox'
                                    className='grouped-display-item__checkbox'
                                    id='underline'
                                    name='underline'
                                    checked={textDecoration?.includes('underline')}
                                    onChange={() => handleCheckboxChange('underline')}
                                />
                                <label
                                    htmlFor="underline"
                                    className='grouped-display-item__checkbox-label'
                                >
                                    Underline
                                </label>
                            </div>
                            <div className="message-font-popover__grouped-display-item grouped-display-item">
                                <label htmlFor="color">Color:</label>
                                <div className="grouped-display-item__color-selection">
                                    <input
                                        ref={colorInputRef}
                                        onChange={handleColorInputChange}
                                        type="color"
                                        name="color"
                                        id="color"
                                        defaultValue={fontColor}
                                    />
                                    <select
                                        onChange={handleColorSelectChange}
                                        value={fontColor === undefined
                                            ? 'Black' : isFontColorSelectedFromDefault()
                                                ? fontColor : ''}
                                    >
                                        <option value="" disabled>{fontColor}</option>
                                        {chatMessageFontColors.map((color, index) => {
                                            return (
                                                <option key={index} value={color.hex}>
                                                    {color.name}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="message-font-popover__grouped-display
                            message-font-popover__grouped-display--sample"
                        >
                            <span className="message-font-popover__grouped-display-title">Sample</span>
                            <div
                                className="message-font-popover__grouped-display-item
                                    grouped-display-item grouped-display-item__sample"
                            >
                                <span
                                    className="grouped-display-item__sample-text"
                                    style={{
                                        fontFamily: fontFamily,
                                        fontSize: fontSize && Number(fontSize),
                                        color: fontColor,
                                        fontWeight: fontStyle?.includes('Bold') ? 'bold' : '',
                                        fontStyle: fontStyle?.includes('Italic') ? 'italic' : '',
                                        textDecoration: textDecoration.join(' ')
                                    }}
                                >
                                    AaBbÁáÔô
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="message-font-popover__buttons">
                        <button
                            className="message-font-popover__button"
                            onClick={onCancelClick}
                        >
                            Cancel
                        </button>
                        <button
                            className="message-font-popover__button"
                            onClick={() => onOkClick({
                                fontFamily: fontFamily,
                                color: fontColor,
                                fontSize: fontSize && Number(fontSize),
                                fontWeight: fontStyle?.includes('Bold') ? 'bold' : '',
                                fontStyle: fontStyle?.includes('Italic') ? 'italic' : '',
                                textDecoration: textDecoration.join(' ')
                            })}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </WindowLayout>
        </div>
    )
}

export default MessageFontPopover