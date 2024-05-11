using Microsoft.Xna.Framework;
using NotGMS.Util;
using ProdModel.Object.Audio;
using ProdModel.Object.Sprite;
using ProdModel.Utils;
using System;
using System.Diagnostics;
using System.Linq;

namespace ProdModel.Gizmo
{
    public class Windows
    {
        public static Object.Object AddWindow(Vector2 pos, string title, Func<Object.Object, Object.Object> content, Func<Object.Object, string> toWS)
        {
            Object.Object.ID++;
            var window = new Object.Object("window_" + Object.Object.ID.ToString());
            window
                .AddChild(new NineSliceSprite("Content/layout/window", true, true))
                .AddChild(new TextSprite("arcaoblique", title).SetColor(Color.White).SetAlign(-1, -1), 8, 12);
            window.SetPosition(-pos.X, -pos.Y).Physics().MakeTopdown().SetDepth(100).Listen();
            window = content(window);
            window.SetBoundingBoxes(2, 20, 54).SetBoundingBoxes(MathP.Max(window.Children[2].Sprite.GetBoundingBox().X, window.Children[1].Sprite.GetBoundingBox().X + 42) + 12, -1);
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
            return window;
        }

        public static Object.Object AddTextWindow(Vector2 pos, string title, string content)
        {
            return AddWindow(pos, title,
                window => window.AddChild(new TextSprite("arcaoblique", content).SetAlign(-1, -1), 8, 50), 
                self => ((TextSprite)self.Children[2].Sprite).Content);
        }
        public static Object.Object AddJoel(Vector2 pos, string title = "Joel")
        {
            return AddWindow(pos, title,
                window => window.AddChild(new AnimationSprite(window, "Content/sprites/joel", 7, 10), 0, 8),
                self => "Joel");
        }
        public static Object.Object AddSongWindow(Vector2 pos, string title, string file)
        {
            Note[] song = SongHandler.ParseSong(file);
            if (song.Length == 0) return null;
            float time = song.Select(x =>
            {
                var ret = x.startTime + x.duration;
                if (SongHandler.Instruments.TryGetValue(x.instrument, out var inst) && !x.cutFeet)
                    ret += inst.GetDuration(x.pitch).Z;
                // Debug.WriteLine($"note: {x.startTime} / {x.duration} ({x.pitch}): {ret}");
                return ret;
            }).Max() * 1.1f; // dilation
            return AddWindow(pos, title,
                window => {
                    var handler = new SongHandler();
                    window.Extra.Add("SongHandler", handler);
                    window.Extra.Add("time", time);
                    handler.PlaySong(song);
                    window
                        .AddChild(new ImageSprite("Content/layout/song_1"), 0, 16)
                        .AddChild(new ImageSprite("Content/layout/song_2"), -133, 4);
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
        public static Object.Object AddRaid(string name, int viewers, string pfp)
        {
            return AddWindow(new Vector2(MathP.Random(1, ProdModel.SCREEN_WIDTH), MathP.Random(1, ProdModel.SCREEN_HEIGHT)), $"{name} raid!",
            window => {
                window.AddChild(new ImageSprite(pfp), 0, 8);
                window.Rotatability = 0.1f;
                window.Gravity = new(0, 1f);
                window.Drag = 0;
                window.Speed = new(MathP.Random(-128, 128), MathP.Random(-128, 128));
                window.Rotation = MathP.Random(-360, 360);
                window.Extra.Add("viewer", MathP.Random(4 + viewers, viewers + 10));
                window.Extra.Add("i", 0);
                window.onUpdate += (self, time) =>
                {
                    if ((int)self.Extra["i"] >= (int)self.Extra["viewer"]) return;
                    if (self.Lifetime > ((int)self.Extra["i"] * (0.1f + (0.8f / (1 + (int)self.Extra["viewer"])))))
                    {
                        self.Extra["i"] = (int)self.Extra["i"] + 1;
                        AddWindow(self.Position, "Welcome Raid ers!", w => {
                            w.AddChild(new AnimationSprite(w, "Content/sprites/joel", 7, 10), 0, 8);
                            w.Angle = self.Angle;
                            w.Rotation = self.Rotation;
                            return w;
                        }, self => "Raid Alert");
                        Audio.Play("audio/join", MathP.Random(0.8f, 1.2f));
                        // if ((int)self.Extra["i"] >= (int)self.Extra["viewer"]) window.MakeTopdown();
                    }
                };
                window.onBounce += (self, _) => { if ((int)self.Extra["i"] >= (int)self.Extra["viewer"]) return; window.Speed = new(MathP.Random(-128, 128), MathP.Random(-128, 128)); self.Rotation = MathP.Random(-360, 360); };
                return window;
            }, self => "Raid Alert");
        }

        public static Object.Object AddIdolDream(Vector2 pos, string title, string picture)
        {
            return AddWindow(pos, title,
                window => window.AddChild(new ImageSprite(picture), 0, 16),
                self => "something about eidolon wyrm calamari from big geima");
        }
    }
}
