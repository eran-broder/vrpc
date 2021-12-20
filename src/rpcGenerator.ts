type WrapWithPromise<T> = {
    [Property in keyof T]: T[Property] extends (...args:never[]) => infer Return ? (...args:Parameters<T[Property]>)=> Promise<Return> : never;
}

export function createClient<T>(methods: Array<Extract<keyof T, string>>, callback: (name:string, ...args:any)=>Promise<any>):WrapWithPromise<T>{    
    var clientDummy: any = {};
    for(const m of methods){        
        clientDummy[m] = (...args:any) => callback(m, args);
    }
    return clientDummy;
}

