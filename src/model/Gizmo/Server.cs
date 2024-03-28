using Microsoft.Xna.Framework;
using ProdModel.Utils;
using System.Diagnostics;

namespace ProdModel.Gizmo
{
    public class Server
    {
        public static void HandleData(string data)
        {
            Debug.WriteLine(" Response: " + data + "\n");
            string[] args = WebSocketP.TakeWord(data, 4); // to, id, cmd, args
            switch (args[2])
            {
                case "tracker":
                    Model.Model.HandleTracker(args[3]);
                    break;
                case "chat":
                    string[] msg = WebSocketP.TakeWord(args[3], 4); // icon, color, author, message
                    Chat.AddChat(msg[0], new Color(int.Parse(msg[1][0..2], System.Globalization.NumberStyles.HexNumber), int.Parse(msg[1][2..4], System.Globalization.NumberStyles.HexNumber), int.Parse(msg[1][4..6], System.Globalization.NumberStyles.HexNumber)), msg[2], msg[3].TrimEnd('\0'));
                    break;
            }
        }
    }
}
