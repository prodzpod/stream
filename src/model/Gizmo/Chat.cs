using Microsoft.Xna.Framework;
using NotGMS.Util;
using ProdModel.Object;
using ProdModel.Object.Audio;
using ProdModel.Object.Sprite;
using ProdModel.Utils;
using System.Collections.Generic;
using System.Linq;

namespace ProdModel.Gizmo
{
    public static class Chat
    {
        public static List<Object.Object> ChatObjects = new();
        public static Object.Object AddChat(string icon, Color color, string author, string message, bool isFirstMessage)
        {
            Object.Object.ID++;
            var o = new Object.Object("chat_" + Object.Object.ID.ToString())
                .AddChild(new ColorSprite(ColorP.RGBA(ColorP.Hex("D7D0C8"))))
                .AddChild(new ImageSprite(icon), -152, 0)
                .AddChild(new TextSprite("arcaoblique", author).SetColor(color).SetAlign(-1, -1), 36, 0)
                .AddChild(new TextSprite("arcaoblique", message).SetAlign(-1, -1).BreakWord(356 - 16 - 36 - 16), 36, 28)
                .SetBoundingBoxes(3, 0, 32).SetBoundingBoxes(356 - 16, -1).SetPosition(-60, 60).SetDepth(1).Listen();
            foreach (var p in ChatObjects)
            {
                p.Position.Y -= o.BoundingBoxSize.Y;
                if (p.Position.Y - (p.BoundingBoxSize.Y / 2) < 352) p.OnDestroy();
            }
            ChatObjects = ChatObjects.Where(p => p.Position.Y - (p.BoundingBoxSize.Y / 2) >= 352).ToList();
            o.onMouse += (self, m, p) =>
            {
                if (m != InputP.Mouses.Left) return;
                self.Physics();
                self.Rotatability = 0.1f;
                if (self.Extra.ContainsKey("follow")) self.Extra["follow"] = false;
                else ChatObjects.Remove(self);
            };
            o.onWSSend += (self) =>
            {
                self.AddWSData("author", author);
                self.AddWSData("color", color);
                self.AddWSData("message", message);
            };
            if (isFirstMessage)
            {
                o.Extra.Add("follow", true);
                o.Physics().onUpdate += (self, time) =>
                {
                    if (!(bool)o.Extra["follow"]) return;
                    self.Speed = (InputP.MousePosition - self.Position) * 0.1f;
                    self.Rotation = float.Parse(Object.Object.writeAngle(MathP.Atan2(self.Speed) - self.Angle)) * 0.1f;
                };
                Audio.Play("audio/join", MathP.Random(0.8f, 1.2f));
            } else ChatObjects.Add(o);
            return o;
        }

        public static Object.Object AddPointer(string icon, Vector2 pos, Vector2 dest, Color color, string author)
        {
            Object.Object.ID++;
            var pointer = new Object.Object("pointer_" + Object.Object.ID.ToString())
                .AddChild(new ImageSprite("Content/sprites/cursor_" + icon))
                .AddChild(new TextSprite("arcaoblique", author).SetAlign(-1, 1).SetColor(color), 48, 0)
                .SetBoundingBoxes(0).SetPosition(-pos).SetDepth(200).Listen();
            ((ImageSprite)pointer.Children[0].Sprite).Color = color;
            pointer.onUpdate += (self, time) =>
            {
                if (self.Statetime < 2)
                {
                    self.Position = MathP.Lerp(self.Position, dest, 0.1f);
                    if (pos == dest) for (var i = Object.Object.OBJECTS.Count - 1; i >= 0; i--)
                    {
                        var o = Object.Object.OBJECTS[i];
                            if (MathP.PositionInBoundingBox(o, self.Position))
                        {
                                ImageSprite img = (ImageSprite)self.Children[0].Sprite;
                                if (img.Path == "Content/sprites/cursor_click")
                                {
                                    if (!o.EnablePhysics || !o.Extra.ContainsKey("pinned")) continue;
                                    o.Speed *= 0.8f;
                                    o.Rotation -= o.Angle * 0.1f;
                                    o.Angle *= 0.8f;
                                }
                                else if (img.Path == "Content/sprites/cursor_point" && o.Name == "_prod" && MathP.Between(-180, self.Position.X - o.Position.X, 180) && MathP.Between(-160, self.Position.Y - o.Position.Y, -30))
                                {
                                    var color = img.Color;
                                    img = new("Content/sprites/cursor_pet") { Color = color };
                                    var z = self.Children[0];
                                    z.Sprite = img;
                                    self.Children[0] = z;
                                }
                        }
                    }
                }
                else
                {
                    if (!self.EnablePhysics)
                    {
                        self.Physics();
                        self.Speed = new(MathP.Random(-10f, 10f), MathP.Random(0f, -50f));
                        self.Rotation = MathP.Random(-20f, 20f);
                    }
                    if (self.Position.Y + (self.BoundingBoxSize.Y / 2) >= ProdModel.SCREEN_HEIGHT) self.OnDestroy();
                }
            };
            pointer.onWSSend += (self) =>
            {
                self.AddWSData("sprite", ((ImageSprite)self.Children[0].Sprite).Path);
                self.AddWSData("author", ((TextSprite)self.Children[1].Sprite).Content);
                self.AddWSData("color", ((ImageSprite)self.Children[0].Sprite).Color);
            };
            return pointer;
        }
    }
}
