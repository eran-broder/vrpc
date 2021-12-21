interface LiveElementToken{
    Key: number;
}
interface ElementDetails{
    Name: string;
AutomationId: string;
}
interface IRemoteInspector{
    GetElementUnderMouse(): LiveElementToken;
GetElementDetails(token: LiveElementToken): ElementDetails;
}
const IRemoteInspector_methods : Array<keyof IRemoteInspector> = ['GetElementUnderMouse','GetElementDetails'];
const IRemoteInspector_arguments = {"GetElementUnderMouse": [], "GetElementDetails": ["token"]};
export {IRemoteInspector, IRemoteInspector_methods, IRemoteInspector_arguments}
