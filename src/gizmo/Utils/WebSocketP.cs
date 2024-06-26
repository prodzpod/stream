﻿using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ProdModel.Utils
{
    public class WebSocketP
    {
        public ClientWebSocket WebSocket = null;
        public bool IsOpen => WebSocket.State == WebSocketState.Open;
        private const int chunkSize = 4096;
        public event Action<WebSocketP> OnInit;
        public event Action<byte[]> OnReceive;
        public static Dictionary<int, Func<string, string>> waitList = new();
        private static int LastID = -1;

        public WebSocketP(string uri, Action<WebSocketP> OnInit, Action<string> onRecieve) : this(uri, OnInit, (b) => onRecieve(Encoding.UTF8.GetString(b))) { }
        public WebSocketP(string uri, Action<WebSocketP> OnInit, Action<byte[]> onRecieve)
        {
            OnReceive = onRecieve;
            this.OnInit = OnInit;
            _ = Connect(uri);
        }

        public async Task Connect(string uri)
        {
            try
            {
                WebSocket = new ClientWebSocket();
                await WebSocket.ConnectAsync(new Uri(uri), CancellationToken.None);
                while (WebSocket.State != WebSocketState.Open) await Task.Delay(100);
                OnInit(this);
                await Recieve();
            }
            catch (Exception ex) { Console.WriteLine("Exception: {0}", ex); }
            finally { WebSocket?.Dispose(); }
        }

        public int Send(params string[] msg)
        {
            if (WebSocket.State != WebSocketState.Open) return 0;
            List<object> args = new() { LastID };
            args.AddRange(msg);
            string txt = WASD.Pack(args.ToArray());
            LastID -= 1;
            WebSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(txt)), WebSocketMessageType.Text, true, CancellationToken.None);
            return LastID + 1;
        }
        public int Respond(int id, params string[] msg)
        {
            if (WebSocket.State != WebSocketState.Open) return 0;
            string txt = $"{id} respond 0 {WASD.Pack(msg)}";
            WebSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes(txt)), WebSocketMessageType.Text, true, CancellationToken.None);
            return id;
        }

        public int Send(Func<string, string> callback, params string[] msg)
        {
            if (WebSocket.State != WebSocketState.Open) return 0;
            int id = Send(msg);
            waitList.Add(id, callback);
            return id;
        }

        private async Task Recieve()
        {
            byte[] buffer = new byte[chunkSize];
            while (WebSocket.State == WebSocketState.Open)
            {
                var result = await WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (WebSocket.State == WebSocketState.Closed) break;
                if (result.MessageType == WebSocketMessageType.Close) await WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                else OnReceive(buffer);
                buffer = new byte[chunkSize];
            }
        }

        public static string[] TakeWord(string str, int count = 2)
        {
            string[] ret = new string[count];
            str = str.Trim();
            for (int i = 0; i < count - 1; i++)
            {
                int idx = str.IndexOf(' ');
                ret[i] = str[..idx];
                str = str[(idx + 1)..].Trim();
            }
            ret[count - 1] = str.Trim();
            return ret;
        }
    }
}