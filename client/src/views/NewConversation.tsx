import { useState } from 'react'
import { useTabs } from '../context/TabContext'
import SelectionPopover from '../components/SelectionPopover/SelectionPopover'
import newConversationIcon from '../assets/icons/start-chat.png'
import microsoftDotNetImage from '../assets/images/microsoft-net.png'
import SearchBar from '../components/SearchBar/SearchBar'
import { newConversationsubtitle } from '../utils/constants'
import { ContactType, TabType } from '../utils/types'
import WindowLayout from '../components/WindowLayout/WindowLayout'
import '../styles/views/NewConversation.scss'

const NewConversation = () => {
    const [query, setQuery] = useState<string>('')
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
    const [popoverOptions, setPopoverOptions] = useState<ContactType[]>([])

    const { removeTab, addTab } = useTabs()

    const handleSearchBarValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) {
            setIsPopoverOpen(true)
            fetchSearchResults(e.target.value)
        } else {
            setIsPopoverOpen(false)
        }
        setQuery(e.target.value)
    }

    const formatPopoverOptions = () => {
        if (popoverOptions.length === 0) {
            return [{
                id: '',
                text: 'No results found',
                disabled: true
            }]
        } else {
            return popoverOptions?.map(option => {
                return {
                    id: option.id,
                    text: `${option.username} <${option.email}>`
                }
            })
        }
    }

    const fetchSearchResults = async (searchTerm: string) => {
        const result = await fetch('/user/search-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: searchTerm })
        })
        const data = await result.json()
        setPopoverOptions(data)
    }

    const handlePopoverOptionClick = (optionId: string) => {
        const contact = popoverOptions.find(option => option.id === optionId)
        const newTab: TabType = {
            id: `/chat/${optionId}`,
            label: `${contact?.username} - Conversation`,
            path: `/chat/${optionId}`,
            icon: newConversationIcon
        }

        removeTab('/new-conversation')
        addTab(newTab, true)
    }

    const handleClose = () => {
        removeTab('/new-conversation')
    }

    return (
        <div className="new-conversation">
            <WindowLayout
                title="Send an Instant Message"
                hasControls={true}
            >
                <img src={microsoftDotNetImage} alt="Microsoft.net" className="new-conversation__image" />
                <h3 className="new-conversation__subtitle">
                    {newConversationsubtitle}
                </h3>
                <div className="new-conversation__search-bar">
                    <SearchBar
                        searchTerm={query}
                        type='text'
                        handleInputChange={handleSearchBarValueChange}
                    />
                    { isPopoverOpen &&
                        <div className="new-conversation__search-bar-popover">
                            <SelectionPopover
                                items={formatPopoverOptions()}
                                onItemClick={handlePopoverOptionClick}
                            />
                        </div>
                    }
                </div>
                <div className="new-conversation__footer">
                    <button
                        className="new-conversation__footer-button"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                </div>
            </WindowLayout>
        </div>
    )
}

export default NewConversation