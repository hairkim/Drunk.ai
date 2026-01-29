import React, { useState, useEffect, useRef } from 'react'
import '../CSS/Home.css'

export default function Home() {
    const [userMessage, setUserMessage] = useState("")
    const [name, setName] = useState("")
    const [personality, setPersonality] = useState("")
    const [bac, setBac] = useState(0.0)
    const [drinkCount, setDrinkCount] = useState(0)
    const [botSetUp, setBotSetUp] = useState(false)
    const [chatHistory, setChatHistory] = useState([])
    const box = useRef(null)


    const BACKEND_URL = `${import.meta.env.VITE_BACKEND_PORT}`;

    useEffect(() => {
        const scrollingBox = box.current;
        if(!scrollingBox) {
            return;
        }

        scrollingBox.scrollTop = scrollingBox.scrollHeight;
    }, [chatHistory])

    const sendChat = async (e) => {
        e.preventDefault();
        console.log(userMessage)
        const newConversation = {
            user: userMessage,
            response: '. . .'
        }
        setChatHistory(prev => [...prev, newConversation]);
        setUserMessage("")
        try {
            const response = await fetch(`${BACKEND_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    name: name,
                    personality: personality,
                    current_bac: bac,
                    drinks_count: drinkCount
                })
            })

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const chatResponse = await response.json()
            setChatHistory(prev => {
                const updatedConversation = [...prev];
                updatedConversation[updatedConversation.length - 1] = {
                    ...updatedConversation[updatedConversation.length - 1],
                    response: chatResponse
                }
                return updatedConversation
            })
        } catch {
            console.error('Error with sending message')
        }
    }

    const createBot = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/bot/create`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {
                    name: 'Luna',
                    personality: "happy"
                })
            })

            if(!response.ok) {
                throw new Error(`there was error noooo status: ${response.status}`)
            }

            const bot = await response.json()
            setName(bot.name)
            setPersonality(bot.personality)
            setBac(bot.current_bac)
            setDrinkCount(bot.drinks_count)
            if(botSetUp == false) {
                setBotSetUp(true)
            }
            // setBot(bot)
        } catch {
            console.error("error creating bot")
        }
    }

    const giveShot = () => {
        // const new_bac = Math.round((bac + 0.03) * 1000 / 1000)
        // setBac(new_bac)
        setBac(bac + 0.03)
        setDrinkCount(drinkCount + 1)
        const shotMessage = `Lets take a shot, ${name}!`
        const botMessage = 'Lets do it!'

        const newMessage = {
            user: shotMessage,
            response: botMessage
        }

        setChatHistory(prev => [...prev, newMessage])
    }

    return(
        <div className='main_container'>
            <div className='header'>
                <h1>DrunkGPT</h1>
                <h4>Made by Harris Kim</h4>
            </div>
            <div className='main_content'>
                <div className='left_side'>
                    <div className='messages_box' ref={box}>
                        {chatHistory.length === 0 ? (
                            // no messages, set a default message
                            <div className='default_message'>
                                Type to start a conversation with me!
                            </div>
                        ) : (
                            chatHistory.map((chat) => (
                                <div className='messages_container'>
                                    <div className='messages user'>
                                        <div className='user_message_wrapper'>{chat.user}</div>
                                    </div>
                                    <div className='messages chat'>
                                        <div className='chat_message_wrapper'>{chat.response}</div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                    <form onSubmit={sendChat} className='input_form'>
                        <input 
                            type="text"
                            placeholder='Talk with DrunkGPT'
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                        />
                    </form>
                </div>
                <div className='right_side'>
                    <div className='bot_information'>
                        { botSetUp ? (
                            // bot name
                            // personality type
                            // bac level
                            // drink count
                            <div className='current_bot'>
                                <p>Name: {name}</p>
                                <p>Personality: {personality}</p>
                                <p>BAC level: {bac}</p>
                                <p>Number of Drinks: {drinkCount}</p>
                            </div>
                        ) : (
                            <div className='no_bot'>
                                Please create a bot to start the party!
                            </div>
                        )}
                    </div>
                    <div className='buttons'>
                        <button className="give_shot" onClick={giveShot}>🍺</button>
                        <button className="create_bot" onClick={createBot}>Create Bot</button>
                    </div>
                </div>
            </div>
        </div>
    )
}