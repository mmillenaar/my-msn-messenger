import { CSSProperties, useState } from 'react'
import blockedUser from '../../assets/icons/avatar-blocked.png'
import unblockUser from '../../assets/icons/avatar-online.png'
import nudgeIcon from '../../assets/icons/nudge.png'
import MessageFontPopover from '../MessageFontPopover/MessageFontPopover'
import './ChatControls.scss'

interface ChatControlsProps {
    messageFontStyle: CSSProperties | undefined;
    onApplyMessageStyle: (messageStyle: CSSProperties) => void;
    onNudgeClick: () => void;
    isContactBlocked: boolean;
    onBlockClick: () => void;
    hasContactBlockedMe?: boolean;
}

const ChatControls = (
    { messageFontStyle, onApplyMessageStyle, onNudgeClick, isContactBlocked, onBlockClick, hasContactBlockedMe }: ChatControlsProps
) => {
    const [isMessageFontPopoverOpen, setIsMessageFontPopoverOpen] = useState<boolean>(false)

    return (
        <div className="chat-controls">
            <div className="chat-controls__wrapper">
                <div
                    className="chat-controls__block"
                    onClick={onBlockClick}
                >
                    <img
                        src={isContactBlocked ? unblockUser : blockedUser}
                        alt="Block action"
                        className="chat-controls__block-image"
                    />
                    <p className="chat-controls__block-text">
                        {isContactBlocked ? 'Unblock' : 'Block'}
                    </p>
                </div>
                {isContactBlocked || hasContactBlockedMe
                    ? null
                    : <>
                        <div
                            className="chat-controls__font chat-controls"
                            onClick={() => setIsMessageFontPopoverOpen(true)}
                        >
                            <span className="chat-controls__font-icon">A</span>
                            <p className="chat-controls__font-text">Font</p>
                        </div>
                        <div
                            className="chat-controls__nudge"
                            onClick={onNudgeClick}
                        >
                            <img src={nudgeIcon} alt="Nudge" className="chat-controls__nudge-image" />
                            <p className="chat-controls__nudge-text">Nudge</p>
                        </div>
                    </>
                }
            </div>
                {isMessageFontPopoverOpen &&
                <MessageFontPopover
                    defaultStyle={messageFontStyle}
                    onCancelClick={() => setIsMessageFontPopoverOpen(false)}
                    onOkClick={(messageStyle) => {
                        setIsMessageFontPopoverOpen(false)
                        onApplyMessageStyle(messageStyle)
                    }}
                />
                }
        </div>
    )
}

export default ChatControls