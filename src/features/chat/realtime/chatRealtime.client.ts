'use client';

import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatReadEvent {
  roomId: string;
  readerId: number;
  lastReadSeq: number;
}

export interface ChatRealtimeClientOptions {
  roomId?: string;
  subscribeRoomList?: boolean;
  onConnected?: () => void;
  onMessage?: (payload: unknown) => void;
  onReadEvent?: (event: ChatReadEvent) => void;
  onRoomListUpdate?: (payload: unknown) => void;
  onError?: (message: string) => void;
}

export interface ChatRealtimeClient {
  connect: () => void;
  disconnect: () => void;
  sendTextMessage: (roomId: string, senderId: number, text: string) => void;
  sendReadEvent: (roomId: string, senderId: number, lastReadSeq: number) => void;
}

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const resolveChatEndpoint = () => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080';
  const parsed = new URL(apiBase);
  const path = parsed.pathname.replace(/\/$/, '');
  return `${parsed.origin}${path}/chat`;
};

class StompRealtimeClient implements ChatRealtimeClient {
  private readonly options: ChatRealtimeClientOptions;
  private readonly client: Client;
  private readonly subscriptions: StompSubscription[] = [];
  private activated = false;

  constructor(options: ChatRealtimeClientOptions) {
    this.options = options;

    this.client = new Client({
      webSocketFactory: () => new SockJS(resolveChatEndpoint()),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => undefined,
      onConnect: () => {
        this.subscribeDefaults();
        this.options.onConnected?.();
      },
      onStompError: (frame) => {
        const detail = frame.body?.trim() || frame.headers.message || '채팅 STOMP 오류가 발생했습니다.';
        this.options.onError?.(detail);
      },
      onWebSocketError: () => {
        this.options.onError?.('채팅 WebSocket 연결 중 오류가 발생했습니다.');
      },
    });
  }

  connect() {
    if (this.activated) return;
    this.activated = true;
    this.client.activate();
  }

  disconnect() {
    this.activated = false;
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions.length = 0;
    void this.client.deactivate();
  }

  sendTextMessage(roomId: string, senderId: number, text: string) {
    if (!this.client.connected) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    this.client.publish({
      destination: `/pub/chat.message.${roomId}`,
      headers: {
        senderId: String(senderId),
      },
      body: JSON.stringify({
        roomId,
        type: 'TEXT',
        payload: {
          payloadType: 'TEXT',
          text: trimmed,
        },
      }),
    });
  }

  sendReadEvent(roomId: string, senderId: number, lastReadSeq: number) {
    if (!this.client.connected) return;

    this.client.publish({
      destination: `/pub/chat.read.${roomId}`,
      headers: {
        senderId: String(senderId),
      },
      body: JSON.stringify({
        lastReadSeq,
      }),
    });
  }

  private subscribeDefaults() {
    if (this.options.roomId) {
      this.subscriptions.push(
        this.client.subscribe(`/exchange/chat.exchange/chat.room.${this.options.roomId}`, (message) => {
          const payload = parseJson(message.body);
          this.options.onMessage?.(payload);
        })
      );

      this.subscriptions.push(
        this.client.subscribe(`/topic/chat.read.${this.options.roomId}`, (message) => {
          this.handleReadEventMessage(message);
        })
      );
    }

    if (this.options.subscribeRoomList) {
      this.subscriptions.push(
        this.client.subscribe('/user/queue/chatroom.list', (message) => {
          const payload = parseJson(message.body);
          this.options.onRoomListUpdate?.(payload);
        })
      );
    }
  }

  private handleReadEventMessage(message: IMessage) {
    const payload = parseJson(message.body);
    const obj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
    if (!obj) return;

    const roomId = typeof obj.roomId === 'string' ? obj.roomId : null;
    const readerId = toNumber(obj.readerId);
    const lastReadSeq = toNumber(obj.lastReadSeq);

    if (!roomId || readerId === null || lastReadSeq === null) return;

    this.options.onReadEvent?.({
      roomId,
      readerId,
      lastReadSeq,
    });
  }
}

export const createChatRealtimeClient = (options: ChatRealtimeClientOptions): ChatRealtimeClient =>
  new StompRealtimeClient(options);
