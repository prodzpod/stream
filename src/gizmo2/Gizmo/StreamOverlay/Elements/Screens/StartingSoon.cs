using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Screens
{
    public class StartingSoon : Element
    {
        public override string Sprite => "layout/startingsoon_2";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];

        public static Dictionary<string, List<Instance>> Texts = [];
        public static Dictionary<string, string> Font = [];
        // !exec send("gizmo", "startingsoon")
        public static void Register(Instance self, string key, string text, string font, float size, ColorP color, float x, float y)
        {
            if (Texts.ContainsKey(key)) foreach (var c in Texts[key]) c.Destroy();
            Texts[key] = [];
            Font[key] = font;
            List<Text> texts = [];
            List<float> offsets = [];
            float offset = 0;
            for (int i = 0; i < text.Length; i++)
            {
                var t = Text.Compile(text[i].ToString(), font, size, color);
                offsets.Add(offset + (t.Size.X / 2));
                offset += t.Size.X;
                texts.Add(t);
            }
            for (int i = 0; i < text.Length; i++)
            {
                var t = texts[i];
                var g = Graphic.New(self, t);
                g.Position = new(x + offsets[i] - (offset / 2), y);
                Texts[key].Add(g);
            }
        }
        public static void Update(Instance self, string key, string text, float x)
        {
            List<Text> texts = [];
            List<float> offsets = [];
            float offset = 0;
            for (int i = 0; i < text.Length; i++)
            {
                var t = Text.Compile(text[i].ToString(), Font[key], ((Text)Texts[key][0].Sprite).Characters[0].Scale, ((Text)Texts[key][0].Sprite).Characters[0].Color);
                offsets.Add(offset + (t.Size.X / 2));
                offset += t.Size.X;
                texts.Add(t);
            }
            for (int i = 0; i < text.Length; i++)
            {
                Texts[key][i].Sprite = texts[i];
                Texts[key][i].Position.X = x + offsets[i] - (offset / 2);
            }
        }
        public static string Tip = "!guy to summon a guy, !fight and !levelup to fight people // !screen to open Redemption Screen (awesome!!) // click the screen you are watching right now (in mobile, click the green fire icon next to top of chat to open a touchpad) to move things around (everything???) // shoutout my wife // prodzpod@bsky.social // !discord !irc // stream every 3PM EST, 12PM PST Monday (5AM JST Tuesday) and bonus stream sometime every week // youtube.com/@prodzpod, youtube.com/@prodzvod // ";
        public static float TipX;
        public static Instance TipInstance;
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            TipX = Text.Compile(Tip, "neodunggeunmo", 32, ColorP.WHITE).Size.X;
            TipInstance = Graphic.New(self, Text.Compile(Tip + Tip + Tip, "neodunggeunmo", 32, ColorP.WHITE));
            TipInstance.Position = new(-TipX, 540 - 16);
            StreamOverlay.Prod.Alpha = 0;
            self.Depth = -1;
            Register(self, "top", "the pod is loading...", "neodunggeunmo", 80, ColorP.WHITE, 0, -120);
            Register(self, "title", "STARTING SOON", "neodunggeunmo", 160, ColorP.WHITE, 0, 0);
            Register(self, "bottom", "PZPD season 1.??", "neodunggeunmo", 80, ColorP.WHITE, 0, 120);
            for (int i = 0; i < 17; i++)
            {
                var stars = Graphic.New(self, "layout/stars");
                stars.Position = new(-700, 540);
                stars.Angle = RandomP.Random(0, 360f);
                stars.Rotation = MathP.Sqr(RandomP.Random(0, 1f)) * .5f;
                var scale = RandomP.Random(2f, 4f);
                stars.Scale = new(scale, scale);
                stars.Blend = ColorP.FromHSV(RandomP.Random(0, 360), RandomP.Random(0, 1), 1);
                stars.Set("alpha", MathP.Sqr(RandomP.Random(0, 1f)));
                stars.Set("amp", RandomP.Random(0, 32f));
                stars.Set("freq", RandomP.Random(4f, 15f));
                stars.Life = RandomP.Random(0f, 300f);
                stars.onUpdate += deltaTime =>
                {
                    stars.Position.Y = MathP.Sin(stars.Life * 360 / stars.Get<float>("freq")) * stars.Get<float>("amp");
                    stars.Alpha = MathP.Max(0, MathP.Sin(stars.Life * 60 / stars.Get<float>("freq")) * stars.Get<float>("alpha"));
                    return true;
                };
            }
            //self.Set("fg", Graphic.New(self, "layout/cafe_fg"));
            if (MainRoom.Chat != null)
            {
                MainRoom.Chat.Set("pinned", true);
                if (!MainRoom.COLLAB_MODE) MainRoom.Chat.Alpha = .5f;
            }
            if (!MainRoom.COLLAB_MODE)
            {
                foreach (var e in MainRoom.BGS) e.Alpha = 0;
                MainRoom.Chat.Position.Y += 56;
            }
        }
        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            StreamOverlay.Prod.Alpha = 1;
            StreamWebSocket.Send("unbrb");
            if (MainRoom.Chat != null)
            {
                MainRoom.Chat.Set("pinned", false);
                if (!MainRoom.COLLAB_MODE) MainRoom.Chat.Alpha = 1;
            }
            if (!MainRoom.COLLAB_MODE)
            {
                foreach (var e in MainRoom.BGS) e.Alpha = 1;
                MainRoom.Chat.Position.Y -= 56;
            }
        }
        public float timer = 0;
        public static List<string> FONTS = [
            // common: cryptic fonts
            "notdef", "notdef", "notdef", "notdef", "notdef", "notdef", "notdef", "notdef", "notdef", "notdef", 
            // common: alternate pixel fonts
            "04b03", "alagard", "arcaoblique", "quan", "kirby", "minecraft", "puzzleport",
            "04b03", "alagard", "arcaoblique", "quan", "kirby", "minecraft", "puzzleport",
            "04b03", "alagard", "arcaoblique", "quan", "kirby", "minecraft", "puzzleport",
            "04b03", "alagard", "arcaoblique", "quan", "kirby", "minecraft", "puzzleport",
            "04b03", "alagard", "arcaoblique", "quan", "kirby", "minecraft", "puzzleport",
            // uncommon: serious fonts
            "constantia", "hexagon", "noto",
            "constantia", "hexagon", "noto",
            "constantia", "hexagon", "noto",
            // uncommon: references
            "iosevka", "jua", "ferrite",
            "iosevka", "jua", "ferrite",
            "iosevka", "jua", "ferrite",
            // rare: out of character fonts
            "comicsans", "impact", "nanumpen", "papyrus", "pop", "rocket", "scratch", "script", "wadang"
        ];
        public static List<string> BOTTOMS = ["blue", "875", "99", "9", "!?", "?!", "!!", "..", "--", "**", "xx", "XX", "67", "//"];
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            timer += deltaTime;
            if (timer > .1f)
            {
                timer -= .1f;
                Font["title"] = RandomP.Chance(.05f) ? RandomP.Random(FONTS) : "neodunggeunmo";
                Register(self, "bottom", "PZPD season 1." + (RandomP.Chance(.1f) ? RandomP.Random(BOTTOMS) : "??"), "neodunggeunmo", 80, ColorP.WHITE, 0, 120);
            }
            Update(self, "title", GlitchString("STARTING SOON", .01f), 0);
            for (int i = 0; i < Texts["top"].Count; i++)
                Texts["top"][i].Position.Y = 20 * MathP.Sin((self.Life + (i * 2f / Texts["top"].Count)) * 360 / 5) - 120;
            for (int i = 0; i < Texts["title"].Count; i++)
                Texts["title"][i].Position.Y = 20 * MathP.Sin((self.Life + (i * 2f / Texts["title"].Count)) * 360 / 5);
            for (int i = 0; i < Texts["bottom"].Count; i++)
                Texts["bottom"][i].Position.Y = 20 * MathP.Sin((self.Life + (i * 2f / Texts["bottom"].Count)) * 360 / 5) + 120;
            TipInstance.Position.X -= 64 * deltaTime;
            if (TipInstance.Position.X < -TipX * 2) TipInstance.Position.X += TipX;
            if (InputP.KeyPressed(-3)) self.Destroy();
        }
        public static string GlitchString(string from, float chance)
        {
            for (int i = 0; i < from.Length; i++)
            {
                if (from[i] == ' ') continue;
                if (RandomP.Chance(.01f)) from = ReplaceChar(from, i, RandomP.Random(['-', '*', 'x', '=', '@', '!', '?', '~', '.']));
                else while (RandomP.Chance(chance)) {
                    var c = from[i];
                    if (RandomP.Chance(.5f)) c = Convert.ToChar(Convert.ToByte(c) + 1);
                    else c = Convert.ToChar(Convert.ToByte(c) - 1);
                    from = ReplaceChar(from, i, c);
                }
            }
            return from;
        }
        public static string ReplaceChar(string str, int i, char c) 
        { 
            return str.Substring(0, i) + c + str.Substring(i + 1);
        }
    }
}
