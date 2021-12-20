import * as rpc from './RemoteInspector_vrpc';
import { createClient } from './rpcGenerator';
import * as net from "net";
import { NamedPipeTransport } from './pipeTransport';
import { RpcChannel } from './rpcManager';

var pipe: net.Socket;

function outgoingMessageGenerator(name: string, ...args:any): any {
    const message = {method: name, arguments: args};
    return message;
}

const client = createClient<rpc.RemoteInspector>(rpc.RemoteInspector_methods, (name, args)=>{    
    const outgoingMessage = outgoingMessageGenerator(name, args);    
    return Promise.resolve();
});

function argsToJson(nameOfMethod: string, args: any[]): any{
    const jsonObj:any = {};
    for (let index = 0; index < args.length; index++) {
        jsonObj[rpc.RemoteInspector_arguments[nameOfMethod][index]] = args[index];        
    }
    return jsonObj;
}

async function DoStuff(){    
    const transport = new NamedPipeTransport("mypipe");
    const channel = new RpcChannel<{}>(transport);
    const client = createClient<rpc.RemoteInspector>(rpc.RemoteInspector_methods, (name, args)=>{    
        const outgoingMessage = outgoingMessageGenerator(name, args);    
        return channel.write(outgoingMessage);
    });
    const result = await client.FindElement(10, "hello");
    console.log(`Got back : ${JSON.stringify(result)}`)
}
DoStuff();
/*
var PIPE_NAME = "mypipe";
var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;
var L = console.log;

// == Client part == //
pipe = net.connect(PIPE_PATH, function() {
    L('Client: on connection');
})

pipe.on('data', function(data) {
    L('Client: on data:', data.toString());
    pipe.end('Thanks!');
});

pipe.on('end', function() {
    L('Client: on end');
})

*/