using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Extra;
using System.Reflection;

namespace Gizmo.StreamOverlay
{
    public class StreamWebSocket
    {
        public static WebSocket ws;
        public static int ID = 0;
        public static Dictionary<string, Func<object?[], Task<object?[]?>>> Commands = [];
        public static Dictionary<int, Action<object?[]>> Callbacks = [];
        public static void Init()
        {
            foreach (var type in Assembly.GetCallingAssembly().GetTypes().Where(x => x.IsSubclassOf(typeof(Command))))
                type.GetConstructor(Type.EmptyTypes).Invoke([]);
            Logger.Info("Loaded", Commands.Count, "Commands");
            ws = new WebSocket("ws://localhost:339/gizmo", Recieve, Close);
            ws.OnInit += () => Send("init");
            Logger.Info("Websocket Loaded");
        }

        public static async void Recieve(string message)
        {
            object?[] args = WASD.Unpack(message);
            if (args.Length <= 1) { Logger.Error("Websocket is malformed: no id or command??"); return; }
            float id = WASD.Assert<float>(args[0]);
            var command = WASD.Assert<string>(args[1]);
            // if (command != "tracker") Logger.Log("Recieve:", message);
            args = args[2..];
            if (command == "respond") 
            {
                if (!Callbacks.ContainsKey((int)id)) Logger.Debug("callback does not exist or is already spent");
                else Callbacks[(int)id].Invoke(args);
                return;
            }
            if (id == default || command == null) { Logger.Error("id or command is not the right type"); return; }
            Commands.TryGetValue(command, out var fn);
            if (fn == null) { Logger.Warn("command does not exist"); return; }
            var ret = await fn.Invoke(args);
            if (ret == null || ret.Length == 0) return;
            _ = ws.Send(WASD.Pack([id, "respond", 0, ret]));
        }

        public static void Send(params object?[] data)
        {
            if (data.Length == 0) return;
            if (data[0] is not string) { Logger.Error("??? what is this"); return; }
            var id = ID++;
            if (data.Length > 1 && data.Last() is Action<object?[]> action) 
            {
                Callbacks.Add(id, action);
                data = data[..(data.Length - 1)];
            }
            _ = ws.Send(WASD.Pack([id, .. data]));
        }

        public static async void Close()
        {
            Logger.Info("Websocket Closed, Attempting Reconnection");
            await Task.Delay(100);
            ws = new WebSocket("ws://localhost:339/gizmo", Recieve, Close);
            Logger.Info("Websocket Loaded");
        }
    }

    public class WASD
    {
        public static string Pack(params object?[] message)
        {
            List<string> list = [];
            foreach (var o in message)
            {
                if (o == null) list.Add("\"\"");
                else if (o is IEnumerable<KeyValuePair<object, object>> dict) 
                {
                    List<object> os = [];
                    foreach (var kv in dict) { os.Add(kv.Key); os.Add(kv.Value); }
                    list.Add("{" + Pack([.. os]) + "}");
                }
                else if (o is IEnumerable<object> arr) list.Add("[" + Pack([.. arr]) + "]");
                else
                {
                    string str = o.ToString().Trim();
                    if (str.Contains(' ') || str.StartsWith('[') || str.StartsWith('{') || str.StartsWith('"'))
                        list.Add("\"" + str.Replace("\"", "\"\"") + "\"");
                    else list.Add(str);
                }
            }
            return list.Join(' ');
        }

        public static object?[] Unpack(string message)
        {
            List<object?> ret = [];
            while (true)
            {
                int end = 0;
                bool forceString = false;
                message = message.Trim();
                if (string.IsNullOrWhiteSpace(message)) break;
                else if (message.StartsWith('{'))
                {
                    int level = 0;
                    while (end < message.Length) 
                    { 
                        if (message[end] == '{') level++;
                        if (message[end] == '}') level--;
                        if (level == 0) break;
                        end++;
                    }
                    object?[] test = Unpack(message[1..end]);
                    Dictionary<string, object?> dict = [];
                    for (int i = 0; i < test.Length; i += 2) dict.Add(test[i].ToString(), test[i + 1]);
                    ret.Add(dict);
                    if (end >= message.Length - 1) break;
                    message = message[(end + 1)..];
                }
                else if (message.StartsWith('['))
                {
                    int level = 0;
                    while (end < message.Length)
                    {
                        if (message[end] == '[') level++;
                        if (message[end] == ']') level--;
                        if (level == 0) break;
                        end++;
                    }
                    object?[] test = Unpack(message[1..end]);
                    ret.Add(test);
                    if (end >= message.Length - 1) break;
                    message = message[(end + 1)..];
                }
                else 
                {
                    string temp;
                    if (message.StartsWith('"'))
                    {
                        end = 1;
                        while (true)
                        {
                            end = message.IndexOf('"', end);
                            if (end == -1) { end = message.Length; break; }
                            if (end + 1 < message.Length && message[end + 1] == '"') end += 2;
                            else break;
                        }
                        temp = message[1..end].Replace("\"\"", "\"");
                        if (temp.StartsWith(' ')) { temp = temp[1..]; forceString = true; }
                    } 
                    else
                    {
                        end = message.IndexOf(' ');
                        if (end == -1) end = message.Length;
                        temp = message[..end];
                    }
                    if (temp == "") ret.Add(null);
                    else if (!forceString && float.TryParse(temp, out var f)) ret.Add(f);
                    else ret.Add(temp);
                    if (end >= message.Length - 1) break;
                    message = message[(end + 1)..];
                }
            }
            return [..ret];
        }

        public static T? Assert<T>(object? thing)
        {
            if (thing == null || thing is not T) return default;
            return (T)thing;
        }
    }

    public abstract class Command
    {
        public abstract Task<object?[]?> Execute(params object?[] args);
        public Command() { StreamWebSocket.Commands.Add(GetType().Name.ToLowerInvariant(), Execute); }
    }
}
