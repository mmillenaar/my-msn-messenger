import { Link } from "react-router-dom";
import './ActionLink.scss';
import { useTabs } from "../../context/TabContext";
import { TabType } from "../../utils/types";

interface ActionLinkProps {
    url: string;
    text: string;
    newTabLabel: string;
    newTabImgSource: string;
    imgSource?: string;
    imgAlt?: string;
}

const ActionLink = ({ url, imgSource, imgAlt, text, newTabLabel, newTabImgSource }: ActionLinkProps) => {
    const { addTab } = useTabs()

    const handleClick = () => {
        const newTab: TabType = {
            id: url,
            label: newTabLabel,
            path: url,
            icon: newTabImgSource
        }

        addTab(newTab)
    }

    return (
        <div className="action-link">
            <Link to={url} className="action-link__wrapper" onClick={handleClick}>
                <img src={imgSource} alt={imgAlt} className="action-link__image" />
                <p className="action-link__text">{text}</p>
            </Link>
        </div>
    )
}

export default ActionLink;