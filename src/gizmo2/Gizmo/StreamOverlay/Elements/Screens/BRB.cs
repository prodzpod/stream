using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;
using YamlDotNet.Core.Tokens;

namespace Gizmo.StreamOverlay.Elements.Screens
{
    public class BRB : Element
    {
        public override string Sprite => "layout/brbbg";
        public override IHitbox? Hitbox => new AABBHitbox(Game.Room.Camera.XY(), Game.Room.Camera.ZW());
        public override string[] InteractsWith => [nameof(Mouse)];
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            self.Depth = -1;
            StreamOverlay.Prod.Alpha = 0;
            self.Set("fg", Graphic.New(self, "layout/brb"));
            self.Set("rb", Squareish.New(nameof(RaidBoss), new Vector2(960 + 350, 540), Resource.Sprites["other/raidboss"].Size));
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
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
            Commands.Fight.FightingRaidBoss = [];
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
                {  "constitution", 300 * GuyAmount },
                {  "attack", 4 * GuyAmount },
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
            StreamOverlay.Shimeji["prodzpod"] = self;
            self.Set("tilnextmove", 999999f);
            self.Set("tilnextkick", 999999f);
        }

        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            Commands.Fight.FightingRaidBoss = [];
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
