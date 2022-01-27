import { IncomingMessage } from "http";

interface IChanneledMessage {
    channelName: string;
    payload: IRemoteMessage
}

interface IRemoteMessage {
    id: number;
    messageType: number;
    payload: any | IEventMessagePayload | string;
}

interface IEventMessagePayload {
    name: string;
    argument: any;
}

enum MessageType {
    Request,
    Response,
    Event,
    Error
}

export interface ITransport {
    on(event: "data", listener: (data: Buffer) => void);
    write(msg: string): Promise<void>;
}

export function channeledTransport(transport: ITransport, onMessage: (channel:string, payload:any)=>void): {write: (channel:string, payload:any)=>void}{
    async function writeImpl(channelName:string, payload:any){
        const msg: IChanneledMessage = {channelName, payload}
        const raw = JSON.stringify(msg);
        console.log("About to write:");
        console.log(raw);
        await transport.write(raw);
    }
    transport.on("data", (data)=>{
        const strData = data.toString();
        const msg = <IChanneledMessage>JSON.parse(strData);        
        onMessage(msg.channelName, msg.payload);
    })

    return {write: writeImpl};
}

type PromiseCallbacks = Parameters<ConstructorParameters<typeof Promise>[0]>
//TODO: support events
export class RpcChannel{

    private _runningId: number = 0;
    private _awaitingPromises: { [id: number]: PromiseCallbacks } = {};
    private _eventListener: (eventName: string, eventArg: any) => void;    

    constructor (private writeOut: (outgoingMessage: any) => Promise<void>){
    }
    
    public async handleIncomingMessage(msg: IRemoteMessage) {
        //TODO: really??? if else? no way man...no way... perhaps map an enum to an interface handler?
        if (msg.messageType == MessageType.Response) {
            console.log("Got back response for message : [" + msg.id + "]")
            console.log(JSON.stringify(msg));
            const matchigPromise = this._awaitingPromises[msg.id];
            console.log("Will invoke matching promise : ", matchigPromise);
            console.log("with : ", msg.payload);
            //TODO: how should I handle a non existing message?
            matchigPromise[0](msg.payload);
        } else if (msg.messageType == MessageType.Event) {
            if (this._eventListener) {
                const eventPyload = <IEventMessagePayload>msg.payload;//TODO: What is this crap??????
                this._eventListener(eventPyload.name, eventPyload.argument);
            }
        } else if (msg.messageType == MessageType.Error) {
            const matchigPromise = this._awaitingPromises[msg.id];
            matchigPromise[1](msg.payload);
        }
    }

    private createRequestMessage<T>(payload: T): IRemoteMessage {
        return { id: this._runningId++, payload, messageType: MessageType.Request };
    }

    public async write(payload: any): Promise<any> {
        const msg = this.createRequestMessage(payload);
        const futurePromise = new Promise<any>((resolve, reject) => {
            this._awaitingPromises[msg.id] = [resolve, reject];
        });
        //const outgoingRaw = JSON.stringify(msg);
        //await this.writeOut(outgoingRaw);
        //await this.writeOut(msg);
        await this.writeOut(msg);
        return futurePromise;
    }

    public listen(listener: (eventName: string, eventArg: any) => void) {
        if (this._eventListener)
            throw Error("Cannot have multiple event handlers");
        this._eventListener = listener;
    }

}