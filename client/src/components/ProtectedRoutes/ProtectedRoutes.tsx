import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Context from "../../context/AppContext";
import { useTabs } from "../../context/TabContext";
import { initializeSocketConnection, setupNotificationListener, setupUserEventsListener } from "../../utils/websocket";
import { NotificationType, TabType } from "../../utils/types";
import TabNavigation from "../TabNavigation/TabNavigation";
import NotificationPopup from "../NotificationPopup/NotificationPopup";
import newConversationIcon from '../../assets/icons/start-chat.png'
import newMessageAudio from '../../assets/audio/newMessage.mp3'
import onlineAudio from '../../assets/audio/online.mp3'

const ProtectedRoutes = () => {
    const [ areSocketListenersActive, setAreSocketListenersActive ] = useState<boolean>(false)
    const { isUserLoggedIn,
        userData,
        setUserData,
        isSocketConnected,
        checkUserLogin,
        setIsSocketConnected
    } = useContext(Context)
    const { tabs, addTab, addNotification } = useTabs()

    const location = useLocation()

    useEffect(() => {
        checkUserLogin()
    }, [location]);

    useEffect(() => {
        if (userData && !isSocketConnected && isUserLoggedIn) {
            initializeSocketConnection(userData.id)
            setIsSocketConnected(true)
        }
    }, [userData, isSocketConnected, isUserLoggedIn, setIsSocketConnected])

    useEffect(() => {
        if (isSocketConnected && !areSocketListenersActive) {
            console.log('user events and notification sockets listening')
            setupUserEventsListener(setUserData)
            setupNotificationListener(handleNotification)
            setAreSocketListenersActive(true)
        }
    }, [isSocketConnected, setUserData, areSocketListenersActive])

    // Web Audio API to play audio even when window is not active
    const audioContext = new (window.AudioContext)()
    const playAudio = (audioUrl: string) => {
        fetch(audioUrl)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                const source = audioContext.createBufferSource()
                source.buffer = audioBuffer
                source.connect(audioContext.destination)
                source.start()
            })
    }

    const handleNotification = (notification: NotificationType) => {
        toast(<NotificationPopup
            username={notification.user.username}
            message={notification.message}
        />, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            transition: Slide,
        })

        // Play notification audio based on notification type
        if (!notification.message) {
            return playAudio(onlineAudio)
        }
        else {
            playAudio(newMessageAudio)
        }

        // message notification in tabs
        const conversationTab = tabs.find(tab => tab.id === `/chat/${notification.user.id}`)
        if (!conversationTab) {
            const newTab: TabType = {
                id: `/chat/${notification.user.id}`,
                label: `${notification.user.username} - Conversation`,
                icon: newConversationIcon,
                path: `/chat/${notification.user.id}`,
                hasNotification: true
            }

            return addTab(newTab, false)
        } else {
            return addNotification(conversationTab.id)
        }
    }

    if (isUserLoggedIn === null) {
        return <div>Loading...</div>;
    }

    return isUserLoggedIn && userData ?
        <>
            <Outlet />
            <TabNavigation />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
                theme="light"
                transition={Slide}
            />
        </>
        : <Navigate to='/login' />;
};

export default ProtectedRoutes;
