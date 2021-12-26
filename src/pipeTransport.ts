import { ITransport } from "./rpcManager";
import * as net from "net";

const PIPE_PATH = "\\\\.\\pipe\\";

export class NamedPipeTransport implements ITransport{
     private _pipe: net.Socket

    constructor(name: string){
        //TODO: no protection here...wrap it with a static async creator
        this._pipe = net.connect(`${PIPE_PATH}${name}`, ()=>{
            console.log("CONNECTED!");
        })        
    }

    on(event: "data", listener: (data: Buffer) => void) {        
        this._pipe.on("data", listener);
    }

    
    write(msg: string):Promise<void> {
        return new Promise<void>((resolve, reject)=>{
            this._pipe.write(msg, ()=>resolve());            
        })
        
    }

}