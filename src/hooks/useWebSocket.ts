import { useState, useEffect, useCallback } from 'react';
import { WebSocketMessage } from '../types';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000, 30000]; // Progressive reconnect delays

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const connect = useCallback(() => {
    if (retryCount >= RECONNECT_INTERVALS.length) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5001';
    const ws = new WebSocket(wsUrl);

    let heartbeatInterval: NodeJS.Timeout;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setRetryCount(0);

      // Start heartbeat
      heartbeatInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, HEARTBEAT_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type !== 'pong') { // Ignore heartbeat responses
          setLastMessage(message);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      setSocket(null);
      clearInterval(heartbeatInterval);

      // Attempt to reconnect with progressive delay
      if (retryCount < RECONNECT_INTERVALS.length) {
        const delay = RECONNECT_INTERVALS[retryCount];
        console.log(`Reconnecting in ${delay}ms...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      clearInterval(heartbeatInterval);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [retryCount]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
      setSocket(null);
    };
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, [socket]);

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
}