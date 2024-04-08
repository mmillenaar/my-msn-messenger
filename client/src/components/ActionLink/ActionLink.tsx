import { Link } from "react-router-dom";
import './ActionLink.scss';

interface ActionLinkProps {
    url: string;
    text: string;
    imgSource?: string;
    imgAlt?: string;
}

const ActionLink = ({ url, imgSource, imgAlt, text }: ActionLinkProps) => {

    return (
        <div className="action-link">
            <Link to={url} className="action-link__wrapper">
                <img src={imgSource} alt={imgAlt} className="action-link__image" />
                <p className="action-link__text">{text}</p>
            </Link>
        </div>
    )
}

export default ActionLink;