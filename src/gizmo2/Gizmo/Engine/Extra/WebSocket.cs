using Gizmo.Engine.Data;
using System.Net.WebSockets;
using System.Text;

namespace Gizmo.Engine.Extra
{
    public class WebSocket
    {
        public ClientWebSocket _ws;
        public bool IsOpen => _ws.State == WebSocketState.Open;
        public event Action? OnInit = null;
        public event Action<byte[]>? OnReceive = null;
        public event Action? OnClose = null;
        public static List<KeyValuePair<WebSocket, byte[]>> ActiveWSMessages = [];
        public static int chunkSize = 4096;
        public static int pollDelay = 100;
        public WebSocket(string uri, Action<string> onRecieve) : this(uri, (b) => onRecieve(Encoding.UTF8.GetString(b ?? []))) { }
        public WebSocket(string uri, Action<byte[]> onRecieve)
        {
            OnReceive = onRecieve;
            _ = Connect(uri);
        }
        public WebSocket(string uri, Action<string> onRecieve, Action onClose) : this(uri, onRecieve) { OnClose = onClose; }
        public WebSocket(string uri, Action<byte[]> onRecieve, Action onClose) : this(uri, onRecieve) { OnClose = onClose; }
        public async Task Connect(string uri)
        {
            try
            {
                _ws = new ClientWebSocket();
                await _ws.ConnectAsync(new Uri(uri), CancellationToken.None);
                Logger.Log("Websocket Connected to " + uri);
                while (_ws.State != WebSocketState.Open) await Task.Delay(pollDelay);
                OnInit?.Invoke();
                await Recieve();
            }
            catch (Exception ex) { Console.WriteLine("Exception: {0}", ex); }
            finally { _ws?.Dispose(); }
        }

        private async Task Recieve()
        {
            byte[] buffer = new byte[chunkSize];
            while (IsOpen)
            {
                byte[] txt = [];
                while (true)
                {
                    if (_ws.State == WebSocketState.Closed) break;
                    var result = await _ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                    txt = [.. txt, .. buffer];
                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await _ws.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                        Logger.Log("Websocket Disconnected");
                    }
                    if (result.EndOfMessage) break;
                }
                for (int i = txt.Length - 1; i >= 0; i--) if (txt[i] != '\0') { txt = txt[..(i + 1)]; break; }
                Logger.Debug("Websocket Recieved: " + Encoding.UTF8.GetString(txt));
                ActiveWSMessages.Add(new(this, txt));
                buffer = new byte[chunkSize];
            }
            OnClose?.Invoke();
        }
        public async Task Send(string msg) => await Send(Encoding.UTF8.GetBytes(msg), true);
        public async Task Send(byte[] msg, bool asText = false)
        {
            if (_ws.State != WebSocketState.Open) { Logger.Error("Websocket is closed!"); return; }
            for (int i = 0; i < msg.Length; i += chunkSize)
            {
                bool endOfMessage = msg.Length <= i + chunkSize;
                await _ws.SendAsync(new ArraySegment<byte>(msg[i .. (endOfMessage ? msg.Length : (i + chunkSize))]), asText ? WebSocketMessageType.Text : WebSocketMessageType.Binary, endOfMessage, CancellationToken.None);
            }
            return;
        }
        public void Recieve(byte[] msg) => OnReceive?.Invoke(msg);
    }
}
