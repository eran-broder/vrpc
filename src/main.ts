import * as inspectorRpc from './IRemoteInspector_vrpc';
import * as highlighterRpc from './RemoteElementHighlighter_vrpc';
import { createClient } from './rpcGenerator';
import { NamedPipeTransport } from './pipeTransport';
import * as elements from './elements';
import { spawn } from 'child_process';
import { strictEqual } from 'assert';
import { channeledTransport, RpcChannel } from './rpcManager';
import { WithoutEvents } from './rpcCoreTypes';
import { isFunction } from 'util';


function outgoingMessageGenerator(name: string, args:any[]): any {
    const message = {method: name, arguments: args};
    return message;
}

function createSessionFactory(client: inspectorRpc.IRemoteInspector){
    async function withSession<T>(action: (session)=>Promise<T>){
        const sessionToken = await client.CreateSession();
        console.log("Got back session : ");
        console.log(sessionToken);        
        await action(sessionToken);
        await client.RemoveSession(sessionToken);
    };

    return withSession;
}

function SetupChanneledTransport(pipeName: string){
    const transport = new NamedPipeTransport(pipeName);
    const channels = new Map<string, RpcChannel>();

    const {write} = channeledTransport(transport, async (channelName, payload)=>{
        await channels.get(channelName).handleIncomingMessage(payload);
    });

    function CreateAndBindClient<T>(channelName: string, methodsToBind:Array<WithoutEvents<T>>): T{
        const newChannel = new RpcChannel(async (p) => await write(channelName, p));        

        const {client, eventPump} = createClient<T>(methodsToBind, async (name, args)=>{    
            const outgoingMessage = outgoingMessageGenerator(name, args);
            return await newChannel.write(outgoingMessage);
        });
    
        channels.set(channelName, newChannel);
        newChannel.listen(eventPump);
        return client;
    }

    return {addChannel : CreateAndBindClient}
}

async function DoStuff(){    
    const {addChannel} = SetupChanneledTransport("mypipe");
    
    const inspector = addChannel<inspectorRpc.IRemoteInspector>("inspector", inspectorRpc.IRemoteInspector_methods);        
    const highlighter = addChannel<highlighterRpc.RemoteElementHighlighter>("highlighter", highlighterRpc.RemoteElementHighlighter_methods);        
    
    inspector.on("NewWindowOpened", async (a)=>{
        console.log("NewWindowOpened : " + a.handle);                
    });
    inspector.on("WindowClosed", (a) => {
        console.log("WindowClosed:" + a.handle)
    });

    await inspector.ListenToNewWindows();
    
    const sessionpromise = inspector.CreateSession();
    console.log("session promise? : ", sessionpromise);
    const withSession = createSessionFactory(inspector);
    
    await withSession(async session=>{
        const elementToken = await inspector.FindElement(session, elements.ECW_LOGIN_BUTTON); 
        
        if(!elementToken){
            console.log("NO ELEMENT FOUND!");
            return;
        }

        const details = await inspector.GetElementDetails(elementToken);
        console.log(`WELL WELL WELL... here is my first element : [${details.name}]`)
        const d = details.dimension;
        await highlighter.Highlight({x: d.x, y: d.y, width: d.width, height: d.height})
        showFireWorks(d.x, d.y, d.width, d.height);
    });
    

    async function fetchOne(){
        await withSession(async session =>{                        
            const liveToken = await inspector.GetElementUnderMouse(session); 
            const elementDetails = await inspector.GetElementDetails(liveToken);
            console.log(`Element details : ${elementDetails.name}`);
            const parentName = await inspector.GetParentName(liveToken);
            console.log('Parent name = ' + parentName);            
            const dim = elementDetails.dimension;            
            await highlighter.Highlight({x: dim.x, y: dim.y, width: dim.width, height: dim.height})                                    
        });   
        setTimeout(fetchOne, 1000);
    }    

    //await fetchOne();
}

function showFireWorks(x :number, y :number, width :number, height :number){   
    spawn("C:/Users/broder/source/repos/FireWorks/FireWorks/bin/Debug/net6.0-windows/FireWorks.exe", [`${x -30}`, `${y - 30}`, `${60}`, `${60}`]);
}

DoStuff();