import { WithoutEvents } from "./rpcCoreTypes"

export type WrapWithPromise<T> = {
    [Property in keyof T]: T[Property] extends (...args:never[]) => infer Return ? (...args:Parameters<T[Property]>)=> Promise<Return> : never;
}

type FilterStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never
type FilterNotStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? never : Set



export function createClient<T>(methods: Array<WithoutEvents<T>>, 
                                outgoingHandler: (name:string, ...args:any)=>Promise<any>)
                                :{client: T, eventPump: (name: string, ...args:any)=>void}{
    var clientProxy: any = {};
    for(const m of methods){        
        clientProxy[m] = (...args:any) => outgoingHandler(m, args);
    }    

    const listeners: {[eventName:string] : (...args:any) => void} = {}
    clientProxy['on'] = (eventName:string, handler: (...args:any) => void) => {
        listeners[eventName] = handler;        
    }

    function invoker(eventName: string, ...args:any){
        const listener = listeners[eventName];
        if(listener)
            listener(...args);
    }
    
    return {client: <T>clientProxy, eventPump: invoker};
}

