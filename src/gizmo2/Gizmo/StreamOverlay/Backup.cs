using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements;
using Gizmo.StreamOverlay.Elements.Windows;
using Raylib_CSharp.Images;
using System.Numerics;
using System.Text.RegularExpressions;
using YamlDotNet.Core.Tokens;

namespace Gizmo.StreamOverlay
{
    public class BackupP
    {
        public static float BackupTime = 60;
        public static float _backupTime = BackupTime;
        public static bool BackupEnabled = true;
        // TODO: (refactor)move this to dedicated file
        public static void Backup()
        {
            Logger.Log("Backup Initiated");
            FileP.Write("backup.txt", Game.INSTANCES
                .Where(x => x.Element is GameElement)
                .Select(x => ((GameElement)x.Element).Serialize(ref x))
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Join('\n'));
        }
        public static void Restore(object?[] args)
        {
            if (args.Length == 0) return;
            string? type = WASD.Assert<string>(args[0]);
            if (type == null) return;
            args = args[1..];
            switch (type)
            {
                case "chat":
                    {
                        string? id = WASD.Assert<string>(args[0]);
                        float? x = WASD.Assert<float>(args[1]);
                        float? y = WASD.Assert<float>(args[2]);
                        float? angle = WASD.Assert<float>(args[3]);
                        object?[]? icon = WASD.Assert<object?[]>(args[4]);
                        string? author = WASD.Assert<string>(args[5]);
                        string? color = WASD.Assert<string>(args[6]);
                        string? content = WASD.Assert<string>(args[7]);
                        float? isRacked = WASD.Assert<float>(args[8]);
                        if (content == null) return;
                        var i = Commands.Chat.SpawnChat(id, color, author, content, icon.Select(x => (string)x).ToArray(), false, new Regex(@"^<emote=[^>]+>$").IsMatch(content));
                        i.Position = new(x.Value, y.Value);
                        i.Angle = angle.Value / 256f;
                        i.Set("racked", isRacked.Value == 1);
                        i.Set("follow", false);
                        i.Gravity = Vector2.UnitY * 3000;
                        break;
                    }
                case "window":
                case "okwindow":
                case "yesnowindow":
                    {
                        float? x = WASD.Assert<float>(args[0]);
                        float? y = WASD.Assert<float>(args[1]);
                        float? angle = WASD.Assert<float>(args[2]);
                        string? title = WASD.Assert<string>(args[3]);
                        string? content = args.Length > 4 ? WASD.Assert<string>(args[4]) : "";
                        if (content == "Joel")
                        {
                            var i = Commands.Chat.SpawnJoel(title);
                            i.Position = new(x.Value, y.Value);
                            i.Angle = angle.Value / 256f;
                        }
                        else if (content.StartsWith("<idoldream="))
                        {
                            content = content["<idoldream=".Length..(content.Length - 1)];
                            StreamOverlay.DrawResolve.Add(new(Image.Load(content), texture =>
                            {
                                var i = Commands.IdolDream.SpawnProfileWindow(x.Value, y.Value, title, content, texture);
                                i.Angle = angle.Value / 256f;
                            }));
                        }
                        else
                        {
                            string? extra = args.Length > 5 ? WASD.Assert<string>(args[5]) : "";
                            Instance i;
                            if (extra == "OK") i = OKWindow.New(new(x.Value, y.Value), title, content);
                            else if (extra == "YesNo") i = YesNoWindow.New(new(x.Value, y.Value), title, content, () => { });
                            else if (extra == "Draw") {
                                float? x2 = WASD.Assert<float>(args[6]);
                                float? y2 = WASD.Assert<float>(args[7]);
                                i = DrawWindow.New(new(x.Value, y.Value), new(x2.Value, y2.Value));
                                i.Set("lines", content.Split(' ').Select(x =>
                                {
                                    var args = x.Split('/');
                                    return new Line { a = new(MathP.SafeParse(args[0]), MathP.SafeParse(args[1])), b = new(MathP.SafeParse(args[2]), MathP.SafeParse(args[3])), color = new(args[4]) };
                                }).ToList());
                            }
                            else i = Commands.Window.SpawnWindow(x.Value, y.Value, title, content);
                            i.Angle = angle.Value / 256f;
                        }
                    }
                    break;
                case "shimeji":
                    {
                        float? x = WASD.Assert<float>(args[0]);
                        float? y = WASD.Assert<float>(args[1]);
                        float? angle = WASD.Assert<float>(args[2]);
                        string? author = WASD.Assert<string>(args[3]);
                        string? color = WASD.Assert<string>(args[4]);
                        // var i = Commands.SpawnShimeji._SpawnShimeji(x.Value, y.Value, author, color);
                        // i.Angle = angle.Value / 256f;
                    }
                    break;
                case "fan":
                case "antifan":
                    {
                        float? x = WASD.Assert<float>(args[0]);
                        float? y = WASD.Assert<float>(args[1]);
                        float? angle = WASD.Assert<float>(args[2]);
                        float? force = WASD.Assert<float>(args[4]);
                        Instance i;
                        if (type == "fan") i = Elements.Gizmos.Fan.New(new(x.Value, y.Value), 128, angle.Value, force.Value);
                        else i = Elements.Gizmos.AntiFan.New(new(x.Value, y.Value), 128, angle.Value, force.Value);
                        i.Angle = angle.Value / 256f;
                    }
                    break;
            }
        }
    }
}
