import './SelectionPopover.scss'

interface SelectionPopoverProps {
    items: SelectionPopoverItemsProps[];
    onItemClick: (itemName: string) => void;
}
interface SelectionPopoverItemsProps {
    name: string;
    icon?: string;
    iconAlt?: string;
}

const SelectionPopover = ({items, onItemClick}: SelectionPopoverProps) => {

    return (
        <div className="selection-popover">
            <div className='selection-popover__wrapper'>
                {items.map((item, index) => (
                    <div key={index} className="selection-popover__item" onClick={() => onItemClick(item.name) }>
                        {item.icon && <img src={item.icon} alt={item.iconAlt} className="selection-popover__item-icon" />}
                        <p className="selection-popover__item-name">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectionPopover