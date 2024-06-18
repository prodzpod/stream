using Microsoft.Xna.Framework;
using Newtonsoft.Json;
using NotGMS.Util;
using ProdModel.Object.Audio;
using ProdModel.Object.Sprite;
using ProdModel.Utils;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;

namespace ProdModel.Gizmo
{
    public class Server
    {
        public static void HandleData(string data)
        {
            string[] args = WASD.Unpack(data); // to, id, cmd, args
            switch (args[1])
            {
                case "info": Info(args[2], int.Parse(args[3])); break;
                case "tracker": Tracker(args[2]); break;
                case "speak": Speak(args[2]); break;
                case "chat": _Chat(args[4], ColorP.RGBA(ColorP.Hex(args[3])), args[5], bool.Parse(args[6]), args[2]); break;
                case "point": Point(new Vector2(float.Parse(args[4]), float.Parse(args[5])), args[2], ColorP.RGBA(ColorP.Hex(args[3])), args[6]); break;
                case "click": Click(new Vector2(float.Parse(args[4]), float.Parse(args[5])), args[2], ColorP.RGBA(ColorP.Hex(args[3])), args[6]); break;
                case "close": Close(new Vector2(float.Parse(args[4]), float.Parse(args[5])), args[2], ColorP.RGBA(ColorP.Hex(args[3])), args[6]); break;
                case "pin": Pin(new Vector2(float.Parse(args[4]), float.Parse(args[5])), args[2], ColorP.RGBA(ColorP.Hex(args[3])), args[6]); break;
                case "fling": Fling(new Vector2(float.Parse(args[4]), float.Parse(args[5])), new Vector2(float.Parse(args[6]), float.Parse(args[7])), args[2], ColorP.RGBA(ColorP.Hex(args[3])), args[8]); break;
                case "window": Window(new Vector2(float.Parse(args[4]), float.Parse(args[5])), args[6], args[7], args[2], ColorP.RGBA(ColorP.Hex(args[3]))); break;
                case "raid": Raid(args[2], int.Parse(args[3]), args[4]); break;
                case "idoldream": IdolDream(new Vector2(float.Parse(args[4]), float.Parse(args[5])), args[6], args[2], ColorP.RGBA(ColorP.Hex(args[3])), args[7]); break;
                case "removetriangle": RemoveTriangle(int.Parse(args[2])); break;
                case "startingsoon": Screens.AddStartingSoon(); break;
                case "brb": Screens.AddBRB(); break;
                case "song": Song(new Vector2(float.Parse(args[2]), float.Parse(args[3])), args[4], args[5]); break;
                case "gravity": Gravity(new Vector2(float.Parse(args[2]), float.Parse(args[3]))); break;
                case "fetch": Fetch(int.Parse(args[0])); break;
            }
        }

        public static void Info(string subject, int phase)
        {
            ProdModel.Log("Info called: " + subject + ", " + phase.ToString());
            Object.Object? _phase = Object.Object.OBJECTS.Find(x => x.Name == "_phase");
            if (_phase != null) ((TextSprite)_phase.Children[1].Sprite).Content = phase.ToString().PadLeft(2, '0');
            Object.Object? _subject = Object.Object.OBJECTS.Find(x => x.Name == "_subject");
            if (_subject != null) ((TextSprite)_subject.Children[1].Sprite).Content = "\"" + (string.IsNullOrWhiteSpace(subject) ? "gizmo" : subject) + "\"";
        }
        public static void Tracker(string data) { Puppet.ModelHandler.HandleTracker(data); }

        public static void Speak(string text)
        {
            Object.Object.ID++;
            var prod = Object.Object.OBJECTS.Find(x => x.Name == "_prod");
            var window = new Object.Object("speech_" + Object.Object.ID.ToString());
            window.Extra.Add("lastsound", 0f);
            window
                .AddChild(new ImageSprite("Content/sprites/speech_bubble"))
                .AddChild(new TextSprite("arcaoblique", text).SetColor(Color.Black), 16, 12);
            window.SetBoundingBoxes(1, 57, 45).SetPosition(-prod.Position.X - (prod.BoundingBoxSize.X + window.BoundingBoxSize.X) / 2 - 8, -prod.Position.Y).SetDepth(100).Listen();
            ImageSprite c = (ImageSprite)window.Children[0].Sprite;
            c.Scale = window.BoundingBoxSize / c.GetBoundingBox();
            var _c = window.Children[0]; _c.Sprite = c; window.Children[0] = _c;
            window.onUpdate += (self, d) => { 
                if (self.Lifetime > MathP.Max(text.Length / 10, 2f))
                {
                    if (!self.Extra.ContainsKey("noremove")) self.OnDestroy();
                } 
                else if (self.Lifetime >= (float)self.Extra["lastsound"])
                {
                    Audio.Play("audio/speak", MathP.Random(0.9f, 1.1f));
                    self.Extra["lastsound"] = (float)self.Extra["lastsound"] + 0.1f;
                }
            };
            window.onMouse += (self, m, p) =>
            {
                if (m != InputP.Mouses.Left) return;
                if (!self.Extra.ContainsKey("noremove")) self.Extra.Add("noremove", true);
                self.Physics();
            };
        }

        public static void _Chat(string name, Color color, string text, bool firstMessage, string icon)
        {
            ProdModel.Log("Chat (" + name + "): " + text);
            if (text == "Joel")
            {
                Windows.AddJoel(new(MathP.Random(1, ProdModel.SCREEN_WIDTH), MathP.Random(1, ProdModel.SCREEN_HEIGHT)), name + ": Joel");
                Audio.Play("audio/window");
                return;
            }
            Chat.AddChat(icon, color, name, text, firstMessage);
            Audio.Play("audio/chat");
        }

        public static void Point(Vector2 pos, string name, Color color, string pointer)
        {
            Chat.AddPointer(pointer + "_point", pos, pos, color, name);
            Audio.Play("audio/point");
        }
        public static void Click(Vector2 pos, string name, Color color, string pointer)
        {
            Chat.AddPointer(pointer + "_click", pos, pos, color, name);
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
        public static void Close(Vector2 pos, string name, Color color, string pointer)
        {
            var _pointer = Chat.AddPointer(pointer + "_click", pos, pos, color, name);
            Audio.Play("audio/click");
            for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
            {
                var o = Object.Object.OBJECTS[i];
                if (_pointer == o) continue;
                if (MathP.PositionInBoundingBox(o, pos))
                {
                    var positionRelative = MathP.Rotate(pos - o.Position, -o.Angle);
                    o.OnMouse(InputP.Mouses.Middle, positionRelative);
                }
            }
        }
        public static void Pin(Vector2 pos, string name, Color color, string pointer)
        {
            Chat.AddPointer(pointer + "_pin", pos, pos, color, name);
            Audio.Play("audio/point");
            for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
            {
                var o = Object.Object.OBJECTS[i];
                if (MathP.PositionInBoundingBox(o, pos))
                {
                    if (!o.EnablePhysics) continue;
                    o.Extra.Add("pinned", true);
                    o.EnablePhysics = false;
                    o.Speed = Vector2.Zero;
                    o.Rotation = 0;
                }
            }
        }
        public static void Fling(Vector2 from, Vector2 to, string name, Color color, string pointer)
        {
            Chat.AddPointer(pointer + "_click", from, to, color, name);
            Audio.Play("audio/fling");
            for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
            {
                var o = Object.Object.OBJECTS[i];
                if (MathP.PositionInBoundingBox(o, from))
                {
                    if (o.Extra.ContainsKey("pinned"))
                    {
                        o.EnablePhysics = true;
                        o.Extra.Remove("pinned");
                    }
                    var positionRelative = MathP.Rotate(from - o.Position, -o.Angle);
                    o.OnHover(positionRelative);
                    o.OnMouse(InputP.Mouses.Left, positionRelative);
                    o.OnDrag(positionRelative, (to - from) / 100);
                }
            }
        }
        public static void Window(Vector2 pos, string title, string content, string name, Color color)
        {
            Windows.AddTextWindow(pos, title, content.Replace("\\n", "\n"));
            Audio.Play("audio/window");
        }
        public static void Raid(string name, int viewers, string profile)
        {
            Windows.AddRaid(name, viewers, profile);
            Audio.Play("audio/window");
        }
        public static void IdolDream(Vector2 pos, string title, string name, Color color, string profile)
        {
            Windows.AddIdolDream(pos, title, profile);
            Audio.Play("audio/window");
        }
        public static void RemoveTriangle(int n)
        {
            ModelSprite.TriangleRemoved += n;
        }
        public static void Song(Vector2 pos, string title, string song)
        {
            Windows.AddSongWindow(pos, title, song);
        }
        public static void Gravity(Vector2 pos)
        {
            for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
            {
                var o = Object.Object.OBJECTS[i];
                if (!o.EnablePhysics || o.Name.StartsWith("_")) continue;
                if (!o.Extra.ContainsKey("originalGravity")) o.Extra.Add("originalGravity", o.Gravity);
                o.Gravity = pos;
            }
        }

        public static void Fetch(int id)
        {
            ProdModel.WebSocket.Respond(id, $"[{WASD.Pack("windowcount ", Object.Object.OBJECTS.Where(x => x.Name.StartsWith("window_")).Count().ToString())}]");
        }
    }
}
