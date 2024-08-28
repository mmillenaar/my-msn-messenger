import React, { useContext, useEffect, useRef, useState } from "react";
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
import nudgeAudio from '../../assets/audio/nudge.mp3'
import Loading from "../Loading/Loading";

const ProtectedRoutes = () => {
    const [areSocketListenersActive, setAreSocketListenersActive] = useState<boolean>(false)
    const [isWindowShaking, setIsWindowShaking] = useState<boolean>(false)
    const { isUserLoggedIn,
        userData,
        setUserData,
        isSocketConnected,
        checkUserLogin,
        setIsSocketConnected,
        isPageLoading
    } = useContext(Context)
    const { tabs, addTab, addNotification } = useTabs()
    const tabsRef = useRef(tabs)

    const location = useLocation()

    useEffect(() => {
        checkUserLogin()
    }, [location]);

    // UseEffect + useRef to ensure tabs are always up-to-date for notifications
    useEffect(() => {
        tabsRef.current = tabs
    }, [tabs])

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
            isNudge={notification.nudge}
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
        if (notification.nudge) {
            playAudio(nudgeAudio)

            // Apply moving window effect
            setIsWindowShaking(true)
            setTimeout(() => setIsWindowShaking(false), 1000)
        }
        else if (!notification.message) {
            return playAudio(onlineAudio)
        }
        else {
            playAudio(newMessageAudio)
        }

        // message notification in tabs
        const conversationTab = tabsRef.current.find(tab => tab.id === `/chat/${notification.user.id}`)
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

    if (isUserLoggedIn === null || isPageLoading) {
        return <Loading />
    }

    return isUserLoggedIn && userData ?
        <div className={`protected-route ${isWindowShaking ? 'shake' : ''}`}>
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
        </div>
        : <Navigate to='/login' />;
};

export default ProtectedRoutes;
