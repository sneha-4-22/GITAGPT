import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const apiKey = 'VF.DM.654f2817e25d4b0007e9e213.CiVeIWoM9qanNBEp';
  const userID = 'user_123'; 

  const handleSend = async (newMessages = []) => {
    try {
      const userMessage = newMessages[0];
      const userInput = userMessage.text;

      const body = {
        action: {
          type: 'text',
          payload: userInput,
        },
      };
      const userChatMessage = {
        _id: new Date().getTime() + 1,
        text: userInput,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [userChatMessage]));

      
      const response = await axios({
        method: 'POST',
        baseURL: 'https://general-runtime.voiceflow.com',
        url: `/state/user/${userID}/interact`,
        headers: {
          Authorization: apiKey,
        },
        data: body,
      });

      const botMessage = {
        _id: new Date().getTime(),
        text: response.data[response.data.length - 1].payload.message, 
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Voiceflow Assistant',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
    } catch (error) {
      console.error('Error in chatbot API request:', error);
    }
  };

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const initialGreeting = "🕉️ Welcome! Begin your day with the wisdom of Bhagavad Gita.📔🙏🏻 ";

        const initialMessage = {
          _id: new Date().getTime(),
          text: initialGreeting,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Voiceflow Assistant',
          },
        };

        setMessages([initialMessage]);
      } catch (error) {
        console.error('Error handling initial message:', error);
      }
    };

    fetchInitialMessage();
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{
        _id: 1,
      }}
    />
  );
};

export default ChatComponent;
