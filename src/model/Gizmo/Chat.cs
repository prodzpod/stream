using Microsoft.Xna.Framework;
using ProdModel.Object;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

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
                .AddChild(new ImageSprite(icon), -152, 0)
                .AddChild(new TextSprite("arcaoblique", author).SetColor(color).SetAlign(-1, -1), 36, 0)
                .AddChild(new TextSprite("arcaoblique", message).SetAlign(-1, -1).BreakWord(356 - 16 - 36 - 16), 36, 28)
                .SetBoundingBoxes(2, 0, 32).SetBoundingBoxes(356 - 16, -1).SetPosition(-60, 60).Listen();
            foreach (var p in ChatObjects)
            {
                p.Position.Y -= o.BoundingBoxSize.Y;
                if (p.Position.Y - p.BoundingBoxSize.Y < 500) p.OnDestroy();
            }
            o.onMouse += (self, m, p) =>
            {
                if (m != Utils.InputP.Mouses.Left) return;
                self.Physics();
                ChatObjects.Remove(self);
            };
            o.onWSSend += (self) =>
            {
                self.AddWSData("author", author);
                self.AddWSData("message", message);
            };
            // ChatObjects = ChatObjects.Where(x => !x.Destroyed).ToList(); TODO: figure out what the hell is wrong with this LOL epic memory leak
            ChatObjects.Add(o);
        }

        public static void AddPointer(string icon, Color color, string author, float life = 2)
        {
        }
    }
}
