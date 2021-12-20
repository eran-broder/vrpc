interface IRemoteMessage<T>{
    id: number;    
    payload: T;
}

export interface ITransport{
    on(event: "data", listener: (data: Buffer)=>void );    
    write(msg: string): Promise<void>;
}

type PromiseCallbacks = Parameters<ConstructorParameters<typeof Promise>[0]>
//TODO: support events
export class RpcChannel<T>{

    private  _runningId: number = 0;
    private _awaitingPromises: {[id: number]: PromiseCallbacks} = {};
    constructor(private transport: ITransport){
        this.doRead();//TODO: not the place...don't abuse constructor
    }

    private async doRead(){
        this.transport.on("data", (data)=>{
            const raw = data.toString()    
            console.log("Got back data with : ")        
            console.log(raw)
            const msg = <IRemoteMessage<T>>JSON.parse(raw);
            const matchigPromise = this._awaitingPromises[msg.id];
            //TODO: how should I handle a non existing message?
            matchigPromise[0](msg.payload);            
        })
    }

    private createRequestMessage(payload:T): IRemoteMessage<T>{
        return {id: this._runningId++, payload};
    }

    public async write(payload: T): Promise<T>{
        const msg = this.createRequestMessage(payload);        
        const futurePromise = new Promise<T>((resolve, reject) => {
            this._awaitingPromises[msg.id] = [resolve, reject];
        });        
        await this.transport.write(JSON.stringify(msg));
        return futurePromise;
    }


}