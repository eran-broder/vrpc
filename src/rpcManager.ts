interface IRemoteMessage{
    id: number;    
    messageType: number;
    payload: any | IEventMessagePayload | string;
}

interface IEventMessagePayload{
    name: string;
    argument: any;
}

enum MessageType
{
    Request,
    Response,
    Event,
    Error
}

export interface ITransport{
    on(event: "data", listener: (data: Buffer)=>void );    
    write(msg: string): Promise<void>;
}

type PromiseCallbacks = Parameters<ConstructorParameters<typeof Promise>[0]>
//TODO: support events
export class RpcChannel{

    private  _runningId: number = 0;
    private _awaitingPromises: {[id: number]: PromiseCallbacks} = {};
    private _eventListener: (eventName: string, eventArg:any)=>void;

    constructor(private transport: ITransport){
        this.doRead();//TODO: not the place...don't abuse constructor
    }

    private async doRead(){
        this.transport.on("data", (data)=>{
            const raw = data.toString()    
            const msg = <IRemoteMessage>JSON.parse(raw);            

            //TODO: really??? if else? no way man...no way... perhaps map an enum to an interface handler?
            if(msg.messageType == MessageType.Response){
                const matchigPromise = this._awaitingPromises[msg.id];
                //TODO: how should I handle a non existing message?
                matchigPromise[0](msg.payload);        
            }else if(msg.messageType == MessageType.Event){                
                if(this._eventListener){                    
                    console.log(msg)
                    console.log(JSON.stringify(msg))
                    const eventPyload = <IEventMessagePayload>msg.payload;//TODO: What is this crap??????
                    this._eventListener(eventPyload.name, eventPyload.argument);
                }
            }else if(msg.messageType == MessageType.Error){
                const matchigPromise = this._awaitingPromises[msg.id];
                matchigPromise[1](msg.payload);
            }
        })
    }

    private createRequestMessage<T>(payload:T): IRemoteMessage{
        return {id: this._runningId++, payload, messageType: MessageType.Request};
    }

    public async write(payload: any): Promise<any>{
        const msg = this.createRequestMessage(payload);        
        const futurePromise = new Promise<any>((resolve, reject) => {
            this._awaitingPromises[msg.id] = [resolve, reject];
        });        
        await this.transport.write(JSON.stringify(msg));
        return futurePromise;
    }

    public listen(listener: (eventName: string, eventArg:any)=>void){
        if(this._eventListener)
            throw Error("Cannot have multiple event handlers");
        this._eventListener = listener;
    }
}