import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.29.72:5000';  

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🕉️ Welcome! Begin your day with the wisdom of Bhagavad Gita.📔🙏🏻' }
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    try {
      const response = await axios.post(`${API_URL}/chat`, { message: input });
      const botMessage = { role: 'assistant', content: response.data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, there was an error processing your request. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    setInput('');
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
      <Text style={[styles.messageText, item.role === 'user' ? styles.userMessageText : styles.assistantMessageText]}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about Bhagavad Gita..."
          placeholderTextColor="#4A90E2"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  chatContainer: {
    paddingVertical: 15,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3F2FD',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#000000',
  },
  assistantMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
    color: '#000000',
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Chatbot;