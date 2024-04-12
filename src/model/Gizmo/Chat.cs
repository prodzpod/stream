using Microsoft.Xna.Framework;
using NotGMS.Util;
using ProdModel.Object;
using ProdModel.Utils;
using SharpDX.Direct2D1;
using System.Collections.Generic;
using System.Diagnostics;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace ProdModel.Gizmo
{
    public static class Chat
    {
        private static int ID = 0;
        public static List<Object.Object> ChatObjects = new();
        public static void AddChat(string icon, Color color, string author, string message)
        {
            ID++;
            var o = new Object.Object("chat_" + ID.ToString())
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
            o.onMouse += (self, m, p) =>
            {
                if (m != InputP.Mouses.Left) return;
                self.Physics();
                self.Rotatability = 0.1f;
                ChatObjects.Remove(self);
            };
            o.onWSSend += (self) =>
            {
                self.AddWSData("author", author);
                self.AddWSData("color", color);
                self.AddWSData("message", message);
            };
            ChatObjects.Add(o);
        }

        public static void AddPointer(string icon, Vector2 pos, Vector2 dest, Color color, string author)
        {
            ID++;
            var pointer = new Object.Object("pointer_" + ID.ToString())
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
                            o.Speed *= 0.8f;
                            o.Rotation -= o.Angle * 0.1f;
                            o.Angle *= 0.8f;
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
        }

        public static void AddTextWindow(Vector2 pos, string title, string content)
        {
            ID++;
            var window = new Object.Object("window_" + ID.ToString())
                .AddChild(new NineSliceSprite("Content/layout/window", true, true))
                .AddChild(new TextSprite("arcaoblique", content).SetAlign(-1, -1), 8, 50)
                .AddChild(new TextSprite("arcaoblique", title).SetColor(Color.White).SetAlign(-1, -1), 8, 12)
                .SetBoundingBoxes(1, 20, 54).SetPosition(-pos.X, -pos.Y).Physics().MakeTopdown().SetDepth(100).Listen();
            window.onWSSend += (self) =>
            {
                self.AddWSData("title", ((TextSprite)self.Children[2].Sprite).Content);
                self.AddWSData("content", ((TextSprite)self.Children[1].Sprite).Content);
            };
            window.onMouse += (self, button, pos) =>
            {
                if (button == InputP.Mouses.Left && pos.X >= (self.BoundingBoxSize.X / 2 - 48) && pos.Y <= 42)
                    self.OnDestroy();
            };
        }
    }
}
