import * as rpc from './IRemoteInspector_vrpc';
import { createClient } from './rpcGenerator';
import { NamedPipeTransport } from './pipeTransport';
import { RpcChannel } from './rpcManager';
import * as elements from './elements';

function outgoingMessageGenerator(name: string, args:any[]): any {
    const message = {method: name, arguments: args};
    return message;
}

function createSessionFactory(client: rpc.IRemoteInspector){
    async function withSession<T>(action: (session)=>Promise<T>){
        const sessionToken = await client.CreateSession();
        try{
            await action(sessionToken);
        }finally{
            await client.RemoveSession(sessionToken);
        }
    };

    return withSession;
}

async function DoStuff(){    
    const transport = new NamedPipeTransport("mypipe");
    const channel = new RpcChannel(transport);
    const {client, eventPump} = createClient<rpc.IRemoteInspector>(rpc.IRemoteInspector_methods, (name, args)=>{    
        const outgoingMessage = outgoingMessageGenerator(name, args);
        return channel.write(outgoingMessage);
    });
    channel.listen(eventPump);    
    const withSession = createSessionFactory(client);
    
    client.on("NewWindowOpened", (a: rpc.WindowEventArgs)=>{
        console.log("NewWindowOpened : " + a.handle);
    });
    
    client.on("WindowClosed", (a : rpc.WindowEventArgs) => {
        console.log("WindowClosed:" + a.handle)
    });

    //await client.ListenToNewWindows();

    
    await withSession(async session=>{
        const elementToken = await client.FindElement(session, elements.login_button);
        const name = await client.GetElementDetails(elementToken);
        console.log(`WELL WELL WELL... here is my first element : [${name.name}]`)
    });
    

    async function fetchOne(){
        await withSession(async session =>{                        
            const liveToken = await client.GetElementUnderMouse(session); 
            const elementDetails = await client.GetElementDetails(liveToken);
            console.log(`Element details : ${elementDetails.name}`);
            const parentName = await client.GetParentName(liveToken);
            console.log('Parent name = ' + parentName);
            const parentElement = await client.GetParent(liveToken);
            const parentName2 = await client.GetElementDetails(parentElement);
            
        });   
        setTimeout(fetchOne, 10000);
    }    

    //await fetchOne();
}

DoStuff();