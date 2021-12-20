interface RemoteInspector{
    SignElement(elementToken: number): string;
FindElement(element: number,options: string): string;
}
const RemoteInspector_methods : Array<keyof RemoteInspector> = ['SignElement','FindElement'];
const RemoteInspector_arguments = {"SignElement": ["elementToken"], "FindElement": ["element", "options"]};
export {RemoteInspector, RemoteInspector_methods, RemoteInspector_arguments}
