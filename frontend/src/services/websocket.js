import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscribers = new Map();
    }

    connect(onConnect) {
        if (this.client && this.client.active) {
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                if (onConnect) onConnect();

                // Resubscribe to topics if reconnecting
                this.subscribers.forEach((callback, topic) => {
                    this.client.subscribe(topic, (message) => {
                        callback(JSON.parse(message.body));
                    });
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (!this.client) {
            console.warn('WebSocket not connected. Queueing subscription.');
        }

        this.subscribers.set(topic, callback);

        if (this.client && this.client.active) {
            return this.client.subscribe(topic, (message) => {
                callback(JSON.parse(message.body));
            });
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

const socketService = new WebSocketService();
export default socketService;
