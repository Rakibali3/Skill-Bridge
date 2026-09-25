import { useEffect, useRef, useState } from "react";
import { createChatClient } from "../../services/chatService";
import { useChatHistory } from "./useChatData";

export default function useChat(exchangeId) {

    const clientRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState("");

    const {
        data: history = [],
        isLoading: historyLoading,
    } = useChatHistory(exchangeId);

    // Load old messages
    useEffect(() => {

        if (!history) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(history);

    }, [history]);

    // WebSocket connection
    useEffect(() => {

        if (!exchangeId) {
            return;
        }

        const client = createChatClient({

            onConnect: (connectedClient) => {

                setConnected(true);
                setError("");

                connectedClient.subscribe(
                    `/topic/exchange/${exchangeId}`,
                    (message) => {

                        const newMessage =
                            JSON.parse(message.body);

                        setMessages(
                            (previousMessages) => {

                                const alreadyExists =
                                    previousMessages.some(
                                        (item) =>
                                            item.id ===
                                            newMessage.id
                                    );

                                if (alreadyExists) {
                                    return previousMessages;
                                }

                                return [
                                    ...previousMessages,
                                    newMessage,
                                ];
                            }
                        );
                    }
                );
            },

            onError: () => {

                setConnected(false);

                setError(
                    "Unable to connect to chat."
                );
            },
        });

        clientRef.current = client;

        return () => {

            setConnected(false);

            if (clientRef.current) {

                clientRef.current.deactivate();

                clientRef.current = null;
            }

        };

    }, [exchangeId]);

    const sendMessage = (message) => {

        const trimmedMessage =
            message.trim();

        if (!trimmedMessage) {
            return;
        }

        if (!clientRef.current?.connected) {

            setError(
                "Chat is not connected."
            );

            return;
        }

        clientRef.current.publish({

            destination: "/app/chat.send",

            body: JSON.stringify({
                exchangeId: Number(exchangeId),
                message: trimmedMessage,
            }),

        });
    };

    return {
        messages,
        sendMessage,
        connected,
        historyLoading,
        error,
    };
}