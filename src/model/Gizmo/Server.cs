using Microsoft.Xna.Framework;
using Newtonsoft.Json;
using NotGMS.Util;
using ProdModel.Object;
using ProdModel.Utils;
using System.Collections.Generic;

namespace ProdModel.Gizmo
{
    public class Server
    {
        public static void HandleData(string data)
        {
            // Debug.WriteLine("\nResponse: " + data);
            string[] args = WASD.Unpack(data); // to, id, cmd, args
            if (args.Length < 2) return; 
            try
            {
                if (args[2] == "respond" && WebSocketP.waitList.ContainsKey(int.Parse(args[1])))
                {
                    string ret = WebSocketP.waitList[int.Parse(args[1])](args.Length < 4 ? "" : args[3]);
                    if (!string.IsNullOrWhiteSpace(ret)) ProdModel.WebSocket.Send(args[0], ret);
                }
            }
            catch { }
            switch (args[2])
            {
                case "tracker":
                    Puppet.ModelHandler.HandleTracker(args[3]);
                    break;
                case "chat":
                    {
                        if (args.Length < 7) return;
                        Chat.AddChat(args[3], ColorP.RGBA(ColorP.Hex(args[4])), args[5], args[6]); // icon, color, author, message
                        Audio.Play("audio/chat");
                    }
                    break;
                case "point":
                    {
                        if (args.Length < 7) return;
                        Vector2 pos = new(float.Parse(args[3]), float.Parse(args[4]));
                        Chat.AddPointer("point", pos, pos, ColorP.RGBA(ColorP.Hex(args[5])), args[6]);
                        Audio.Play("audio/point");
                    }
                    break;
                case "click":
                    {
                        if (args.Length < 7) return;
                        Vector2 pos = new(float.Parse(args[3]), float.Parse(args[4]));
                        Chat.AddPointer("click", pos, pos, ColorP.RGBA(ColorP.Hex(args[5])), args[6]);
                        Audio.Play("audio/click");
                        for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
                        {
                            var o = Object.Object.OBJECTS[i];
                            if (MathP.PositionInBoundingBox(o, pos))
                            {
                                var positionRelative = MathP.Rotate(pos - o.Position, -o.Angle);
                                o.OnHover(positionRelative);
                                o.OnMouse(InputP.Mouses.Left, positionRelative);
                                o.OnMouse(InputP.Mouses.Right, positionRelative);
                            }
                        }
                    }
                    break;
                case "drag":
                    {
                        if (args.Length < 9) return;
                        Vector2 pos = new(float.Parse(args[3]), float.Parse(args[4]));
                        Vector2 pos2 = new(float.Parse(args[5]), float.Parse(args[6]));
                        Chat.AddPointer("click", pos, pos2, ColorP.RGBA(ColorP.Hex(args[7])), args[8]);
                        Audio.Play("audio/fling");
                        for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
                        {
                            var o = Object.Object.OBJECTS[i];
                            if (MathP.PositionInBoundingBox(o, pos))
                            {
                                var positionRelative = MathP.Rotate(pos - o.Position, -o.Angle);
                                o.OnHover(positionRelative);
                                o.OnMouse(InputP.Mouses.Left, positionRelative);
                                o.OnDrag(positionRelative, (pos2 - pos) / 100);
                            }
                        }
                    }
                    break;
                case "window":
                    {
                        if (args.Length < 7) return;
                        Vector2 pos = new(float.Parse(args[3]), float.Parse(args[4]));
                        Chat.AddTextWindow(pos, args[5], args[6]);
                        Audio.Play("audio/window");
                    }
                    break;
                case "removetriangle":
                    {
                        int trianglesToRemove = args.Length < 4 ? 1 : (int)float.Parse(args[3]);
                        ModelSprite.TriangleRemoved += trianglesToRemove;
                    }
                    break;
                case "startingsoon":
                    Screens.AddStartingSoon();
                    break;
                case "brb":
                    Screens.AddBRB();
                    break;
                case "sync":
                    Sync();
                    break;
            }
        }

        public static void Sync()
        {
            List<string> ret = new();
            foreach (var o in Object.Object.OBJECTS)
            {
                if (o.WebSocket == null) continue;
                o.WSSendForce = true;
                ret.Add(o.Name);
            }
            ProdModel.WebSocket.Send("main", "modelobjects", JsonConvert.SerializeObject(ret));
        }
    }
}
