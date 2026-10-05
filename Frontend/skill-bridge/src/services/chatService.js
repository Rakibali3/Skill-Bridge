import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = import.meta.env.VITE_API_BASE_URL;

export function createChatClient({
    onConnect,
    onError,
}) {
    const client = new Client({

        webSocketFactory: () => {
            return new SockJS(WS_URL);
        },

        reconnectDelay: 5000,

        debug: (message) => {
            console.log("[STOMP]", message);
        },

        onConnect: () => {
            console.log("WebSocket connected");

            if (onConnect) {
                onConnect(client);
            }
        },

        onStompError: (frame) => {
            console.error(
                "STOMP error:",
                frame.headers["message"]
            );

            if (onError) {
                onError(frame);
            }
        },

        onWebSocketError: (error) => {
            console.error(
                "WebSocket error:",
                error
            );

            if (onError) {
                onError(error);
            }
        },

        onDisconnect: () => {
            console.log("WebSocket disconnected");
        },
    });

    client.activate();

    return client;
}