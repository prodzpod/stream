using Microsoft.Xna.Framework;
using NotGMS.Util;
using ProdModel.Object.Sprite;
using ProdModel.Utils;
using System;

namespace ProdModel.Gizmo
{
    public class Windows
    {
        public static void AddWindow(Vector2 pos, string title, Func<Object.Object, Object.Object> content, Func<Object.Object, string> toWS)
        {
            Object.Object.ID++;
            var window = new Object.Object("window_" + Object.Object.ID.ToString());
            window
                .AddChild(new NineSliceSprite("Content/layout/window", true, true))
                .AddChild(new TextSprite("arcaoblique", title).SetColor(Color.White).SetAlign(-1, -1), 8, 12);
            window = content(window);
            window.SetBoundingBoxes(2, 20, 54).SetBoundingBoxes(MathP.Max(window.Children[2].Sprite.GetBoundingBox().X, window.Children[1].Sprite.GetBoundingBox().X + 42) + 12, -1).SetPosition(-pos.X, -pos.Y).Physics().MakeTopdown().SetDepth(100).Listen();
            window.onUpdate += (self, time) =>
            {
                self.Rotation *= 0.99f;
            };
            window.onWSSend += (self) =>
            {
                self.AddWSData("title", ((TextSprite)self.Children[1].Sprite).Content);
                self.AddWSData("content", toWS(self));
            };
            window.onMouse += (self, button, pos) =>
            {
                if (button == InputP.Mouses.Left && pos.X >= (self.BoundingBoxSize.X / 2 - 48) && pos.Y <= 42)
                    self.OnDestroy();
            };
        }

        public static void AddTextWindow(Vector2 pos, string title, string content)
        {
            AddWindow(pos, title,
                window => window.AddChild(new TextSprite("arcaoblique", content).SetAlign(-1, -1), 8, 50), 
                self => ((TextSprite)self.Children[2].Sprite).Content);
        }
        public static void AddJoel(Vector2 pos, string title = "Joel")
        {
            AddWindow(pos, title,
                window => window.AddChild(new AnimationSprite(window, "Content/sprites/joel", 7, 10), 0, 8),
                self => "Joel");
        }
        public static void AddSongWindow(Vector2 pos, string title, string file)
        {
            Note[] song = SongHandler.ParseSong(file);
            if (song.Length == 0) return;
            float time = song[^1].startTime + song[^1].duration;
            if (SongHandler.Instruments.TryGetValue(song[^1].instrument, out var inst)) time += inst.GetDuration(song[^1].pitch).Z; // TODO: replace this with max endtime
            AddWindow(pos, title,
                window => {
                    var handler = new SongHandler();
                    window.Extra.Add("SongHandler", handler);
                    window.Extra.Add("time", time);
                    handler.PlaySong(song);
                    window
                        .AddChild(new ImageSprite("Content/layout/song_1"), 7, 10)
                        .AddChild(new ImageSprite("Content/layout/song_2"), -126, -4);
                    window.onUpdate += (self, time) =>
                    {
                        var child = self.Children[3];
                        child.BoundingBox.X = MathP.Lerp(-126, 264 - 126, self.Lifetime / (float)self.Extra["time"]);
                        self.Children[3] = child;
                        if (self.Lifetime > (float)self.Extra["time"]) self.OnDestroy();
                    };
                    window.onDestroy += (self) =>
                    {
                        ((SongHandler)self.Extra["SongHandler"]).Stop = true;
                        Screens.AddExplosion(-self.Position + new Vector2(240, 358));
                    };
                    return window;
                }, self => "Song");
        }
    }
}
