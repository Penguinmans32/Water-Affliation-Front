// src/services/WebSocketService.js
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscription = null;
        this.reconnectTimeout = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(onMessageReceived) {
        console.log('Attepmting to connect to WebSocket....');
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);

        this.stompClient.debug = null;

        this.stompClient.connect({}, () => {
            console.log('WebSocket Connected!');
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
            
            this.subscription = this.stompClient.subscribe('/topic/water-quality', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    onMessageReceived(data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
            this.handleConnectionError();
        });

        // Add connection event listeners
        socket.onclose = () => {
            console.log('WebSocket connection closed');
            this.handleConnectionError();
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleConnectionError();
        };
    }

    handleConnectionError() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            // Clear any existing reconnect timeout
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }

            // Exponential backoff for reconnect
            const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            
            this.reconnectTimeout = setTimeout(() => {
                this.disconnect();
                this.connect();
            }, backoffTime);
        } else {
            console.error('Max reconnection attempts reached');
            this.disconnect();
        }
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }

        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.disconnect(() => {
                console.log('Disconnected from WebSocket');
            });
        }

        this.stompClient = null;
    }

    isConnected() {
        return this.stompClient && this.stompClient.connected;
    }

    // Method to manually trigger reconnection
    reconnect() {
        this.reconnectAttempts = 0;
        this.disconnect();
        this.connect();
    }
}

export default new WebSocketService();