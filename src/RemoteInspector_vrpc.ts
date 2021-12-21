interface LiveElementToken{
    Key: number;
}
interface ElementDetails{
    Name: string;
AutomationId: string;
}
interface RemoteInspector{
    SignElement(elementToken: number): string;
SignElement2(elementToken: number): string;
FindElement(element: number,options: string): string;
GetToken(): LiveElementToken;
GetElementUnderMouse(): LiveElementToken;
GetElementDetails(token: LiveElementToken): ElementDetails;
}
const RemoteInspector_methods : Array<keyof RemoteInspector> = ['SignElement','SignElement2','FindElement','GetToken','GetElementUnderMouse','GetElementDetails'];
const RemoteInspector_arguments = {"SignElement": ["elementToken"], "SignElement2": ["elementToken"], "FindElement": ["element", "options"], "GetToken": [], "GetElementUnderMouse": [], "GetElementDetails": ["token"]};
export {RemoteInspector, RemoteInspector_methods, RemoteInspector_arguments}
