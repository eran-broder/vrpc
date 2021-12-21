import * as rpc from './IRemoteInspector_vrpc';
import { createClient } from './rpcGenerator';
import * as net from "net";
import { NamedPipeTransport } from './pipeTransport';
import { RpcChannel } from './rpcManager';

var pipe: net.Socket;

function outgoingMessageGenerator(name: string, args:any[]): any {
    const message = {method: name, arguments: args};
    return message;
}

async function DoStuff(){    
    const transport = new NamedPipeTransport("mypipe");
    const channel = new RpcChannel<{}>(transport);
    const client = createClient<rpc.IRemoteInspector>(rpc.IRemoteInspector_methods, (name, args)=>{    
        const outgoingMessage = outgoingMessageGenerator(name, args);    
        return channel.write(outgoingMessage);
    });

    async function fetchOne(){
        const liveToken = await client.GetElementUnderMouse();
        const elementDetails = await client.GetElementDetails(liveToken);
        console.log(`Got back : ${JSON.stringify(elementDetails)}`)        
    }

    setInterval(fetchOne, 1000);

}
DoStuff();