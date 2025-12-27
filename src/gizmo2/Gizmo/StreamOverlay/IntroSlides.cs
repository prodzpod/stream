using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Windows;
using System.Numerics;

namespace Gizmo.StreamOverlay
{
    public class IntroSlides
    {
        public static List<Instance> Instances = [];
        public static int Slide = 0;
        public static Audio.AudioInstance bgm;
        public static bool deleteAll = false;
        public static int depth = -20;
        public static void NextSlide()
        {
            Slide += 1;
            depth += 1;
            if (deleteAll)
            {
                foreach (var i in Instances)
                {
                    i.Set("pinned", false);
                    i.Speed = new(RandomP.Random(-500, 500), RandomP.Random(0, -1000));
                    i.Rotation = RandomP.Random(-360, 360);
                    i.Gravity = Vector2.UnitY * 3000;
                }
                Instances = [];
                depth = -20;
            }
            deleteAll = false;
            Dictionary<int, string> extra = [];
            switch (Slide)
            {
                case 1:
                    NewSquareish("intro/hello");
                    Audio.Play("screen/click_me");
                    break;
                case 2:
                    NewText("like 2 weeks", "papyrus", 72, ColorP.WHITE);
                    Audio.Play("screen/click_me");
                    break;
                case 3:
                    NewSquareish("intro/chill");
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 4:
                    Audio.Play("screen/click_me");
                    break;
                case 5:
                    NewSquareish("intro/crash");
                    Audio.Play("screen/gong");
                    break;
                case 6:
                    NewSquareish("intro/discord");
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 7:
                    Audio.Play("screen/chat");
                    List<string> sleepingcat = [
                        "∩――――∩",
                        "||     ∧ ﾍ　 ||",
                        "||    (* ´ ｰ`) ZZzz",
                        "|ﾉ^⌒⌒づ`￣  ＼",
                        "(　ノ　　⌒ ヽ ＼",
                        "＼　　||￣￣￣￣￣||",
                        "　 ＼,ﾉ||",
                    ];
                    var maxWidth = 0f;
                    for (int y = 0; y < sleepingcat.Count; y++) {
                        var width = 0f;
                        for (int x = 0; x < sleepingcat[y].Length; x++)
                        {
                            var t = Text.Compile(sleepingcat[y][x].ToString(), "nanumgothic", 48, ColorP.WHITE);
                            width += t.Size.X;
                            NewSquareishInternal(t, t.Size, new(width + t.Size.X / 2, 48 * y));
                        }
                        if (width > maxWidth) maxWidth = width;
                    }
                    foreach (var i in Instances) i.Position += new Vector2(-maxWidth / 2, -(sleepingcat.Count - 1) * 48 / 2);
                    deleteAll = true;
                    break;
                case 8:
                    NewSquareish("intro/soop");
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 9:
                    DrawCalendar([]);
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 10:
                    extra.Add(15, "Started");
                    extra.Add(16, "slept");
                    extra.Add(17, "slept");
                    extra.Add(18, "ate good");
                    extra.Add(19, "Snooz");
                    extra.Add(20, "Snooz");
                    extra.Add(21, "slept");
                    extra.Add(22, "ate good");
                    DrawCalendar(extra);
                    Audio.Play("screen/chat");
                    deleteAll = true;
                    break;
                case 11:
                    extra.Add(15, "Started");
                    extra.Add(19, "Snooz");
                    extra.Add(20, "Snooz");
                    extra.Add(28, "slept");
                    extra.Add(30, "all this");
                    DrawCalendar(extra);
                    Audio.Play("screen/chat");
                    deleteAll = true;
                    break;
                case 12:
                    extra.Add(15, "Started");
                    extra.Add(19, "Snooz");
                    extra.Add(20, "Snooz");
                    extra.Add(29, "\"GCGIZMO\"");
                    extra.Add(30, "all this");
                    DrawCalendar(extra);
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 13:
                    DrawCalendar(extra, 22, 27);
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 14:
                    Audio.Play("screen/click_me");
                    break;
                case 15:
                    NewText("what was prod doing???", "neodunggeunmo", 80, ColorP.WHITE);
                    NewText("you have 3 guesses", "neodunggeunmo", 80, ColorP.WHITE, 0, 80);
                    bgm = Audio.Play("intro/minigame");
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 16:
                    bgm.Stop();
                    NewText("You Did", "papyrus", 80, ColorP.WHITE);
                    NewText("It", "papyrus", 80, ColorP.WHITE, 20, 80);
                    bgm = Audio.Play("intro/clap");
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 17:
                    bgm.Stop();
                    Audio.Play("screen/click_me");
                    break;
                case 18:
                    NewSquareish("intro/stell");
                    deleteAll = true;
                    break;
                case 19:
                    Audio.Play("screen/click_me");
                    break;
                case 20:
                    NewText("7 engine rewrite in gamemaker:", "neodunggeunmo", 80, ColorP.WHITE, 0, -120);
                    NewText("6 months+", "neodunggeunmo", 80, new ColorP(255, 0, 0), 0, -40);
                    NewText("(like 30x faster and Works)", "neodunggeunmo", 80, ColorP.WHITE, 0, 80);
                    Audio.Play("intro/vineboom");
                    deleteAll = true;
                    break;
                case 21:
                    Audio.Play("screen/click_me");
                    break;
                case 22:
                    NewText("actually good plan i hope", "arcaoblique", 13 * 8, ColorP.WHITE);
                    Audio.Play("screen/chat");
                    deleteAll = true;
                    break;
                case 23:
                    extra.Add(1, "Stream");
                    extra.Add(8, "Stream");
                    extra.Add(15, "Stream");
                    extra.Add(22, "Stream");
                    extra.Add(29, "Stream");
                    extra.Add(4, "Stream");
                    extra.Add(11, "Stream");
                    extra.Add(18, "Stream");
                    extra.Add(25, "Stream");
                    DrawCalendar(extra, 0, 31);
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 24:
                    extra.Add(1, "Stream");
                    extra.Add(8, "Stream");
                    extra.Add(15, "Stream");
                    extra.Add(22, "Stream");
                    extra.Add(29, "Stream");
                    DrawCalendar(extra, 0, 31);
                    Audio.Play("screen/gong");
                    deleteAll = true;
                    break;
                case 25:
                    extra.Add(1, "STARTELLERS");
                    extra.Add(8, "STARTELLERS");
                    extra.Add(15, "STARTELLERS");
                    extra.Add(22, "STARTELLERS");
                    extra.Add(29, "STARTELLERS");
                    DrawCalendar(extra, 0, 31);
                    bgm = Audio.Play("intro/clap");
                    deleteAll = true;
                    break;
                case 26:
                    extra.Add(1, "STARTELLERS");
                    extra.Add(8, "SPECIAL event");
                    extra.Add(15, "STARTELLERS");
                    extra.Add(22, "SPECIAL event");
                    extra.Add(29, "STARTELLERS");
                    DrawCalendar(extra, 0, 31);
                    bgm.Stop();
                    Audio.Play("screen/window");
                    break;
                case 27:
                    NewText("PLAYING OOMVES VIDEOGAMES", "neodunggeunmo", 80, ColorP.WHITE, new Vector2(1, 0), 500, -200);
                    Audio.Play("screen/chat");
                    break;
                case 28:
                    NewText("RANDOM WIFE TIME", "neodunggeunmo", 80, ColorP.WHITE, new Vector2(1, 0), 500, -100);
                    Audio.Play("screen/chat");
                    break;
                case 29:
                    NewText("ONE OFF GIZMOS", "neodunggeunmo", 80, ColorP.WHITE, new Vector2(1, 0), 500, 0);
                    Audio.Play("screen/chat");
                    break;
                case 30:
                    NewText("FULL TETRIS STREAM", "neodunggeunmo", 80, ColorP.WHITE, new Vector2(1, 0), 500, 100);
                    Audio.Play("screen/chat");
                    break;
                case 31:
                    NewText("KARAOKE???", "neodunggeunmo", 80, ColorP.WHITE, new Vector2(1, 0), 500, 200);
                    Audio.Play("screen/chat");
                    deleteAll = true;
                    break;
                case 32:
                    extra.Add(1, "STARTELLERS");
                    extra.Add(8, "SPECIAL event");
                    extra.Add(15, "STARTELLERS");
                    extra.Add(22, "SPECIAL event");
                    extra.Add(29, "STARTELLERS");
                    DrawCalendar(extra, 0, 31);
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 33:
                    extra.Add(1, "STARTELLERS");
                    extra.Add(8, "SPECIAL event");
                    extra.Add(15, "STARTELLERS");
                    extra.Add(22, "SPECIAL event");
                    extra.Add(29, "STARTELLERS");
                    extra.Add(3, "2kki");
                    extra.Add(13, "2kki");
                    extra.Add(18, "2kki");
                    extra.Add(28, "2kki");
                    DrawCalendar(extra, 0, 31);
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 34:
                    extra.Add(1, "STARTELLERS");
                    extra.Add(8, "SPECIAL event");
                    extra.Add(15, "STARTELLERS");
                    extra.Add(22, "SPECIAL event");
                    extra.Add(29, "STARTELLERS");
                    extra.Add(3, "2kki");
                    extra.Add(13, "DIFFERENT FANGAME");
                    extra.Add(18, "2kki");
                    extra.Add(28, "2kki");
                    DrawCalendar(extra, 0, 31);
                    Audio.Play("intro/vineboom");
                    deleteAll = true;
                    break;
                case 35:
                    NewText("Greenheat Update", "impact", 72, ColorP.WHITE);
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 36:
                    NewText("prod.kr did not die !! !", "papyrus", 72, ColorP.WHITE);
                    bgm = Audio.Play("intro/jackpot");
                    deleteAll = true;
                    break;
                case 37:
                    NewSquareish("intro/kyuppin0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 38:
                    NewSquareish("intro/kyuppin");
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 39:
                    Audio.Play("screen/click_me");
                    break;
                case 40:
                    NewSquareish("intro/spy");
                    Audio.Play("screen/chat");
                    deleteAll = true;
                    break;
                case 41:
                    NewSquareish("intro/vex0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 42:
                    NewSquareish("intro/vex");
                    Audio.Play("screen/join");
                    deleteAll = true;
                    break;
                case 43:
                    Audio.Play("screen/click_me");
                    break;
                case 44:
                    NewSquareish("intro/eldra0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 45:
                    NewSquareish("intro/eldra");
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 46:
                    NewSquareish("intro/ellg0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 47:
                    NewSquareish("intro/ellg");
                    Audio.Play("screen/click_me");
                    deleteAll = true;
                    break;
                case 48:
                    Audio.Play("screen/click_me");
                    break;
                case 49:
                    NewSquareish("intro/allen0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 50:
                    NewSquareish("intro/allen");
                    Audio.Play("screen/window");
                    deleteAll = true;
                    break;
                case 51:
                    NewSquareish("intro/morse0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 52:
                    NewSquareish("intro/morse");
                    Audio.Play("intro/vineboom");
                    deleteAll = true;
                    break;
                case 53:
                    Audio.Play("screen/click_me");
                    break;
                case 54:
                    NewSquareish("intro/xhiggy0", 0, -300);
                    Audio.Play("screen/chat");
                    break;
                case 55:
                    NewSquareish("intro/xhiggy");
                    Audio.Play("screen/gong");
                    deleteAll = true;
                    break;
                case 56:
                    Audio.Play("screen/click_me");
                    break;
                case 57:
                    NewText(":teal:", "neodunggeunmo", 80, ColorP.WHITE);
                    deleteAll = true;
                    bgm = Audio.Play("intro/clap");
                    break;
                case 58:
                    bgm.Stop();
                    NewText("were  making pause menu btw", "neodunggeunmo", 80, ColorP.WHITE);
                    deleteAll = true;
                    Audio.Play("screen/click_me");
                    break;
                case 59:
                    Audio.Play("screen/click_me");
                    break;
            }
        }
        public static void DrawCalendar(Dictionary<int, string> extra, int start = 0, int end = 9999)
        {
            List<List<string>> calendar = [
                ["S", "M", "T", "W", "T", "F", "S"],
                ["30", "1", "2", "3", "4", "5", "6"],
                ["7", "8", "9", "10", "11", "12", "13"],
                ["14", "15", "16", "17", "18", "19", "20"],
                ["21", "22", "23", "24", "25", "26", "27"],
                ["28", "29", "30", "1", "2", "3", "4"],
            ];
            for (int y = 0; y < calendar.Count; y++) for (int x = 0; x < calendar[y].Count; x++)
            {
                if (y != 0 && !MathP.Between(start, (y - 1) * calendar[0].Count + x, end)) continue;
                string text = "";
                if (y == 5 && x == 3) text = "Today!";
                else if (!(y == 0 || (y == 1 && x == 0) || (y == 5 && x > 2)) && !extra.TryGetValue(int.Parse(calendar[y][x]), out text)) text = "";
                var t = Text.Compile(text, "arcaoblique", 26, Vector2.Zero, StreamOverlay.DefaultTextColor);
                Vector2 size = new(128 + 42, 64 + 62);
                Vector2 totalSize = new(size.X * calendar[0].Count, size.Y * (calendar.Count - 1) + 48 + 46);
                Vector2 position = new(960 + 320 - (totalSize.X / 2) + (size.X * x), 540 - (totalSize.Y / 2) + 48 + 46 + (size.Y * (y - 1)));
                Instance window;
                if (y == 0) window = Window.New(new(position.X, 540 - (totalSize.Y / 2)), calendar[y][x], new(128, 0));
                else window = Window.New(position, calendar[y][x], new(128, 64), t);
                window.Set("pinned", true);
                window.Set("title", calendar[y][x]);
                window.Set("content", text);
                window.onPostInit += () => {
                    window.Depth = depth;
                    var children = window.Get<Instance[]>("children");
                    foreach (var c in children) c.Depth = window.Depth;
                    return true;
                };
                Instances.Add(window);
            }
        }
        public static Instance NewSquareish(string sprite, float x = 0, float y = 0)
        {
            var spr = Resource.Sprites[sprite];
            return NewSquareishInternal(spr, spr.Size, new(x, y));
        }
        public static Instance NewText(string text, string font, float size, ColorP color, float x = 0, float y = 0) => NewText(text, font, size, color, Vector2.Zero, x, y);
        public static Instance NewText(string text, string font, float size, ColorP color, Vector2 align, float x = 0, float y = 0)
        {
            var t = Text.Compile(text, font, size, align, color);
            return NewSquareishInternal(t, t.Size, new(x, y));
        }
        public static Instance NewSquareishInternal(IDrawable sprite, Vector2 size, Vector2 position)
        {
            var ret = Squareish.New(nameof(Squareish), new Vector2(960, 540) + position, size, sprite);
            ret.Set("pinned", true);
            ret.onPostInit += () => {
                ret.Depth = depth;
                ret.Get<Instance[]>("children")[0].Depth = ret.Depth;
                return true;
            };
            Instances.Add(ret);
            return ret;
        }
    }
}
