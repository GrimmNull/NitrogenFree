export interface IState {
    dispatch?: any;
    username: string | undefined;
    sendMessage: (message: string) => void;
    receivedMessage: string;
    connection: WebSocket | null;
    connectionStatus: string,
    openModal: (name: string) => void;
    onlineUsers: string[];
    activeServer: string;
    devices: object;
    serverList: string[];
    activeVoiceChannel: object | null;
    voiceChannels: IChannel[];
    connectedServers: string[];
    history: any;
    bottomRef: any;
}

export interface IAction {
    type: string;
    payload?: any;
}

export interface IChannel {
    name: string;
    connectedUsers: string[];
}

export interface IMessage {
    sender: string;
    attachment: any;
    content: string;
    timestamp: number;
}

export interface IImage {

}

export type TDispatcher = (action: IAction) => void