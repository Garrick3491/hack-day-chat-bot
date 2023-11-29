import React, {useState, useEffect,} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogFlowConfig} from "./env";
import { StatusBar } from 'expo-status-bar';
import {
    GiftedChat,
} from 'react-native-gifted-chat';


export default function App() {
    const Bot = {
        _id: 4,
        name: 'AoS Bot',
        avatar: '',
    };

    const [messages, setMessages] = useState([
    ]);

    useEffect(() => {
        Dialogflow_V2.setConfiguration(
            dialogFlowConfig.client_email,
            dialogFlowConfig.private_key,
            Dialogflow_V2.LANG_ENGLISH_US,
            dialogFlowConfig.project_id,
        );
    }, []);

    const sendBotResponse = (text) => {
        let msg = {
            _id: messages.length + 1,
            text,
            createdAt: new Date(),
            user: Bot,
        };
        setMessages(previousMessages => {
            return GiftedChat.append(previousMessages, [msg]);
        });
    };

    const handleGoogleResponse = (result) => {
        let text = result.queryResult.fulfillmentMessages[0].text.text[0];
        sendBotResponse(text);
    };
    const onSend = (message) => {
        setMessages(previousMessages => {
            return GiftedChat.append(previousMessages, message);
        });
        let msg = message[0].text;
        console.log(message);
        Dialogflow_V2.requestQuery(
            msg,
            result => {
                console.log('result', result);
                handleGoogleResponse(result);
            },
            error => {
                console.log(error);
            },
        );
    };

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
                avatar: '',
            }}
        />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
      width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
