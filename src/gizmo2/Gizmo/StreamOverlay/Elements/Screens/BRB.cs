using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Commands.Shimeji;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Screens
{
    public class BRB : Element
    {
        public override string Sprite => "layout/brbbg2";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];
        public static List<Instance> LeaderboardInstance = [];
        public static Dictionary<string, int> Leaderboard = [];
        public static Dictionary<string, ColorP> Colors = [];
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            self.Depth = -1;
            StreamOverlay.Prod.Alpha = 0;
            self.Set("fg", Graphic.New(self, "layout/brb_fg2"));
            self.Set("rb", Squareish.New(nameof(RaidBoss), new Vector2(960 + 350, 540), Resource.Sprites["other/raidboss"].Size));
            StartingSoon.TipX = Text.Compile(StartingSoon.Tip, "neodunggeunmo", 32, ColorP.WHITE).Size.X;
            StartingSoon.TipInstance = Graphic.New(self, Text.Compile(StartingSoon.Tip + StartingSoon.Tip + StartingSoon.Tip, "neodunggeunmo", 32, ColorP.WHITE));
            StartingSoon.TipInstance.Position = new(-StartingSoon.TipX, 540 - 56 - 16);
            Graphic.New(self, Text.Compile("Free Pizza!", "neodunggeunmo", 160, new Vector2(-1, -1), ColorP.WHITE)).Position = new(-960 + 96, -540 + 96);
            Graphic.New(self, Text.Compile("Click the screen for free pizza!", "neodunggeunmo", 80, new Vector2(-1, -1), ColorP.WHITE)).Position = new(-960 + 56, -540 + 216);
            Graphic.New(self, Text.Compile("Leaderboard:", "neodunggeunmo", 40, new Vector2(1, -1), ColorP.WHITE)).Position = new(960 - 16, -540 + 32);
            for (var i = 0; i < 10; i++)
            {
                var instance = Graphic.New(self, Text.Compile("", "neodunggeunmo", 40, new Vector2(1, -1), ColorP.WHITE));
                instance.Position = new(960 - 16, -540 + 72 + (40 * i));
                LeaderboardInstance.Add(instance);
            }
            Leaderboard = [];
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            StartingSoon.TipInstance.Position.X -= 64 * deltaTime;
            if (StartingSoon.TipInstance.Position.X < -StartingSoon.TipX * 2) StartingSoon.TipInstance.Position.X += StartingSoon.TipX;
            var names = Leaderboard.Keys.ToList();
            names.Sort((a, b) => Leaderboard[b] - Leaderboard[a]);
            for (var i = 0; i < names.Count; i++)
            {
                if (i >= 10) break;
                var text = names[i] + ": " + Leaderboard[names[i]];
                LeaderboardInstance[i].Sprite = Text.Compile(text, "neodunggeunmo", 40, new Vector2(1, -1), Colors[names[i]]);
            }
            if (InputP.KeyPressed(-3)) self.Destroy();
        }
        public override void OnDestroy(ref Instance self)
        {
            self.Get<Instance>("fg").Destroy();
            self.Get<Instance>("rb").Destroy();
            StreamOverlay.Prod.Alpha = 1;
            StreamWebSocket.Send("unbrb");
            base.OnDestroy(ref self);
        }
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            ((Sprite)self.Sprite).Draw(self.Frame, self.Position + new Vector2(self.Life * 32 % 64, self.Life * 32 % 64), self.Scale, self.Angle, self.Blend * self.Alpha);
        }
    }
    public class RaidBoss : Shimeji
    {
        public override bool Immortal => true;
        public override string Sprite => "other/raidboss";
        public override float Mass(Instance i) => 100;
        public override float Drag(Instance i) => 1;
        public override float Friction(Instance i) => 0f;
        public override float Bounciness(Instance i) => 0.9f;
        public override Vector2 Gravity(Instance i) => Vector2.UnitY * 2000;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            var GuyAmount = MathP.Max(1, Guys.Where(x => Game.Time - x.Value <= 1800).Count());
            Fight.FightingRaidBoss = [];
            self.Depth = 50;
            self.Set("ai", new Dictionary<string, float>()
            {
                {  "dexterity", .5f },
                {  "jokerness", .5f },
                {  "agility", .5f },
                {  "jumpness", .5f },
                {  "zebraness", .5f },
                {  "jumpheight", .5f },
                {  "camelness", .5f },
                {  "wisdom", .5f },
                {  "aggression", .5f },
                {  "strength", .5f },
                {  "bisonness", .5f },
                {  "luck", .5f },
                {  "banananess", .5f },
                {  "orangeness", .5f },
                {  "appleness", 0f },
                {  "constitution", 200 * GuyAmount },
                {  "attack", GuyAmount },
                {  "defense", 0 },
                {  "critchance", 0.4f },
                {  "critdamage", 2.5f },
                {  "multihit", 1 },
                {  "attackspeed", 3 },
                {  "oxness", 0 },
                {  "hipponess", 0.1f },
            });
            self.Set("author", "prodzpod");
            self.Set("color", "#ffffff");
            self.Set("raidboss", true);
            var _self = self;
            var guys = Game.INSTANCES.Where(x => x != _self && x.Element is Shimeji);
            foreach (var guy in guys)
            {
                var hostiles = guy.Get<List<Instance>>("hostiles");
                hostiles.Add(self);
                guy.Set("hostiles", hostiles);
            }
            StreamOverlay.Shimeji["prodzpod"] = self;
        }

        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            Fight.FightingRaidBoss = [];
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            self.Set("jumps", 0f);
            base.OnUpdate(ref self, deltaTime);
            if (self.Life % 7 < 3) self.Frame = 0;
            else self.Frame = (self.Life - 3) * 2;
            if (self.Life % 14 > 7) self.Frame = 8 - self.Frame;
            if (RandomP.Chance(4f * deltaTime))
            {
                var size = ((Sprite)self.Sprite).Size;
                var rpos = new Vector2(RandomP.Random(-size.X / 2, size.X / 2), RandomP.Random(-size.Y / 2, size.Y / 2));
                Pointer.New(MathP.Rotate(rpos, self.Angle) * self.Scale + self.Position, "pointer/cursor", 1, "", new ColorP(RandomP.Random(0f, 1), RandomP.Random(0f, 1), RandomP.Random(0f, 1)));
            }
        }
    }
}
