import './ActionLink.scss';

interface ActionLinkProps {
    text: string;
    handleClick: () => void;
    imgSource?: string;
    imgAlt?: string;
}

const ActionLink = ({ imgSource, imgAlt, text, handleClick }: ActionLinkProps) => {

    return (
        <div className="action-link">
            <div className="action-link__wrapper" onClick={handleClick}>
                <img src={imgSource} alt={imgAlt} className="action-link__image" />
                <p className="action-link__text">{text}</p>
            </div>
        </div>
    )
}

export default ActionLink;