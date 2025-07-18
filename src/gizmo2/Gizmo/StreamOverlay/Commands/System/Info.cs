﻿using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Windows;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;

namespace Gizmo.StreamOverlay.Commands.System
{
    public class Info : Command
    {
        public override async Task<object?[]?> Execute(params object?[] args)
        {
            string subject = WASD.Assert<string>(args[0]);
            float phase = WASD.Assert<float>(args[1]);
            string game = WASD.Assert<string>(args[2]);
            if (subject == null) return null;
            var text = Text.Compile($"\"{subject}\"", "arcaoblique", 26, -Vector2.One, ColorP.BLACK);
            var ns = Resource.NineSlices["window/making"];
            MainRoom.MakingText.Sprite = text;
            var x = ns.innerLeft + text.Size.X + ns.innerRight;
            MainRoom.Making.Set("size", new Vector2(x, 44));
            MainRoom.Making.Position = new(748 + (MainRoom.LALA_MODE ? 90 : 0) + x / 2, 1056);
            MainRoom.MakingText.Position = new((Resource.NineSlices["window/making"].innerLeft - text.Size.X) / 2, 4);
            MainRoom.Phase.Sprite = Text.Compile(phase.ToString().PadLeft(2, '0'), "arcaoblique", 26, -Vector2.One, ColorP.BLACK);
            string[] full = ["Linux for PlayStation 2", "Software and Game Development", "Special Events", "Just Chatting"];
            DrawWindow.IsTetris = !full.Contains(game);
            if (!StreamOverlay.BackupCalled)
            {
                StreamOverlay.BackupCalled = true;
                if (phase >= 0)
                {
                    if (FileP.Exists("backup.txt") && FileP.Slurp("backup.txt").Length > 0)
                    {
                        BackupP.BackupEnabled = false;
                        var i = YesNoWindow.New(new(960, 540), "Backup Found", "Restore from backup?", () =>
                        {
                            // TODO: make this a popup with two buttons (w graphic)
                            foreach (var lines in FileP.Slurp("backup.txt").Split('\n'))
                                BackupP.Restore(WASD.Unpack(lines));
                        });
                        i.Set("pinned", true);
                        i.onDestroy += () => BackupP.BackupEnabled = true;
                    }
                }
                else if (FileP.Exists("backup.txt")) FileP.Delete("backup.txt");
            }
            return null;
        }
    }
}
