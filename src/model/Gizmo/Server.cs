using Microsoft.Xna.Framework;
using NotGMS.Util;
using ProdModel.Object;
using ProdModel.Utils;
using System;
using System.Diagnostics;

namespace ProdModel.Gizmo
{
    public class Server
    {
        public static void HandleData(string data)
        {
            // Debug.WriteLine("\nResponse: " + data);
            string[] args = WebSocketP.TakeWord(data, 4); // to, id, cmd, args
            args[3] = args[3].TrimEnd('\0');
            switch (args[2])
            {
                case "tracker":
                    Puppet.ModelHandler.HandleTracker(args[3]);
                    break;
                case "chat":
                    {
                        string[] msg = WebSocketP.TakeWord(args[3], 4); // icon, color, author, message
                        Chat.AddChat(msg[0], ColorP.RGBA(ColorP.Hex(msg[1])), msg[2], msg[3]);
                        Audio.Play("audio/chat");
                    }
                    break;
                case "point":
                    {
                        string[] msg = WebSocketP.TakeWord(args[3], 4); // x, y, color, author
                        Vector2 pos = new(float.Parse(msg[0]), float.Parse(msg[1]));
                        Chat.AddPointer("point", pos, pos, ColorP.RGBA(ColorP.Hex(msg[2])), msg[3]);
                        Audio.Play("audio/point");
                    }
                    break;
                case "click":
                    {
                        string[] msg = WebSocketP.TakeWord(args[3], 4); // x, y, color, author
                        Vector2 pos = new(float.Parse(msg[0]), float.Parse(msg[1]));
                        Chat.AddPointer("click", pos, pos, ColorP.RGBA(ColorP.Hex(msg[2])), msg[3]);
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
                        string[] msg = WebSocketP.TakeWord(args[3], 6); // x, y, x2, y2, color, author
                        Vector2 pos = new(float.Parse(msg[0]), float.Parse(msg[1]));
                        Vector2 pos2 = new(float.Parse(msg[2]), float.Parse(msg[3]));
                        Chat.AddPointer("click", pos, pos2, ColorP.RGBA(ColorP.Hex(msg[4])), msg[5]);
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
                        string[] msg = WebSocketP.TakeWord(args[3], 4); // x, y, title, content
                        Vector2 pos = new(float.Parse(msg[0]), float.Parse(msg[1]));
                        Chat.AddTextWindow(pos, msg[2], msg[3]);
                        Audio.Play("audio/window");
                    }
                    break;
            }
        }
    }
}
