import './SelectionPopover.scss'

interface SelectionPopoverProps {
    items: SelectionPopoverItemsProps[];
    onItemClick: (itemName: string) => void;
}
interface SelectionPopoverItemsProps {
    id: string;
    text: string;
    icon?: string;
    iconAlt?: string;
    disabled?: boolean;
}

const SelectionPopover = ({items, onItemClick}: SelectionPopoverProps) => {

    return (
        <div className="selection-popover">
            <div className='selection-popover__wrapper'>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`selection-popover__item ${item.disabled ? 'selection-popover__item--disabled' : ''}`}
                        onClick={() => onItemClick(item.id) }
                    >
                        {item.icon && <img src={item.icon} alt={item.iconAlt} className="selection-popover__item-icon" />}
                        <p className="selection-popover__item-name">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectionPopover