using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Windows;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Entities
{
    public class Shimeji : GameElement
    {
        public override string[] InteractsWith => [nameof(Mouse), nameof(Window), nameof(Chat)];
        public override float Mass(Instance i) => 0;
        public override float Drag(Instance i) => .9f;
        public override float Friction(Instance i) => 1;
        public override Vector2 Gravity(Instance i) => Vector2.UnitY * 3000;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 50;
            self.Playback = 0;
            self.Frame = 0;
            self.Set("incombat", false);
            self.Set("tilnextmove", 0f);
            self.Set("tilnextattack", 0f);
            self.Set("jumps", 1f);
        }
        public static float MaxSpeed = 500;
        public override void OnDestroy(ref Instance self)
        {
            StreamOverlay.Shimeji.Remove(self.Get<string>("author"));
            base.OnDestroy(ref self);
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (self.Get<bool>("incombat"))
            {
                // combat code
            }
            else
            {
                var ai = self.Get<Dictionary<string, float>>("ai");
                if (self.Var.ContainsKey("target"))
                {
                    Vector2 target = self.Get<Vector2>("target");
                    self.Speed.X = MathP.Clamp((target.X - self.Position.X) * 5 + MathP.SExp(self.Speed.X - (target.X - self.Position.X) * 5, .01f, deltaTime), -MaxSpeed, MaxSpeed);
                    if (MathP.Abs(self.Speed.X) < 1 || self.Position.X < 8 || self.Position.X > (1920 - 8)) self.Var.Remove("target");
                    if (self.Speed.Y > MetaP.TargetFPS * 2) self.Frame = 3;
                    else self.Frame = (self.Frame + deltaTime * self.Speed.X / 16) % 3;
                    if (MathP.Abs(self.Speed.Y) < MetaP.TargetFPS)
                        self.Rotation = MathP.Lerp(self.Rotation, -self.Angle * 5, .5f);
                }
                else
                {
                    self.Set("tilnextattack", self.Get<float>("tilnextattack") - deltaTime);
                    var t = self.Get<float>("tilnextmove") - deltaTime;
                    if (self.Get<float>("jumps") > 0 && t < 0)
                    {
                        // jump check
                        if (RandomP.Chance(ai["jumpness"]))
                        {
                            self.Set("jumps", self.Get<float>("jumps") - 1);
                            self.Speed.Y = MathP.Lerp(-1600, -6400, ai["jumpheight"]) * RandomP.Random(ai["zebraness"], 1);
                            var s = MathP.Sign(self.Speed.X);
                            if (s == 0) s = RandomP.Chance(.5f) ? 1 : -1;
                            self.Speed.X = s * (4000 * ai["camelness"]);
                        }
                        else
                        {
                            // move check
                            self.Set("target", new Vector2(self.Position.X + ((RandomP.Chance(.5f) ? 1 : -1) * MathP.Lerp(50, 500 * ai["agility"], RandomP.Random(0, 1f))), self.Position.Y));
                            var tick = 1 / ai["dexterity"];
                            self.Set("tilnextmove", RandomP.Random(tick * .1f, tick * (.1f + ai["jokerness"])));
                        }
                    }
                    else self.Set("tilnextmove", t);
                }
            }
        }
        public static float StepAssist = 4;
        public override void OnCollide(ref Instance self, Instance other)
        {
            base.OnCollide(ref self, other);
            if (other?.Element is Mouse) return;
            self.Set("jumps", 1f);
            if (other == null) return;
            if (self.Speed.Y > other.Speed.Y) for (int i = 1; i < StepAssist; i++)
            {
                self.Position.Y -= i;
                if (!HitboxP.Check(self, other))
                {
                    self.Speed.Y = -self.Speed.Y * self.Bounciness - i * MetaP.TargetFPS;
                    return;
                }
                else self.Position.Y += i;
            }
            if (other.Element is Squareish && !other.Get<bool>("pinned") && self.Var.ContainsKey("target") && self.Get<float>("tilnextattack") < 0)
            {
                var ai = self.Get<Dictionary<string, float>>("ai");
                if (!RandomP.Chance(ai["aggression"])) return;
                // push logic
                Vector2 target = self.Get<Vector2>("target");
                float x = target.X - self.Position.X;
                x = MathP.Sign(x) * (500 + MathP.Min(MathP.Abs(x) * MathP.Lerp(3 * ai["luck"], 4, ai["strength"]), 4000));
                float theta = MathP.Atan2(other.Position - self.Position);
                if (MathP.Cos(theta) == 0) return;
                float r = x / MathP.Cos(theta);
                theta = MathP.PosMod(MathP.Lerp(MathP.PosMod(theta - 90, 360) + 90, 270, ai["bisonness"]), 360);
                x = r * MathP.Cos(theta);
                float y = r * MathP.Sin(theta);
                if (x >= 0) other.Speed.X = Math.Max(x, other.Speed.X);
                else other.Speed.X = Math.Min(x, other.Speed.X);
                if (y >= 0) other.Speed.Y = Math.Max(y, other.Speed.Y);
                else other.Speed.Y = Math.Min(y, other.Speed.Y);
                other.Rotation = MathP.Lerp(-r, r, RandomP.Random(0f, 1f));
                Audio.Play("screen/kick");
                self.Set("tilnextattack", .05f / ai["aggression"]);
            }
        }

        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            self.Var.Remove("target");
        }

        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (self.Speed.X < 0) self.Scale.X *= -1;
            base.OnDraw(ref self, deltaTime);
            if (self.Speed.X < 0) self.Scale.X *= -1;
        }

        public static Instance New(Sprite sprite, Vector2 pos, string author, ColorP color)
        {
            var i = Instance.New(nameof(Shimeji), pos);
            i.Sprite = sprite;
            i.Hitbox = new CircleHitbox(MathP.Min(sprite.Size.X, sprite.Size.Y) / 2);
            Text t = Text.Compile(author, "arcaoblique", 26, Vector2.Zero, color);
            var nametagBG = Graphic.New(i, Resource.NineSlices["WHITE"]);
            nametagBG.Set("size", t.Size + Vector2.One * 4);
            var nametag = Graphic.New(i, t);
            nametagBG.Position.X -= 11;
            nametagBG.Position.Y -= sprite.Size.Y / 2 - 13;
            nametagBG.Blend = ColorP.BLACK * .75f;
            nametag.Position.Y -= sprite.Size.Y / 2 - 26;
            return i;
        }

        public override string Serialize(ref Instance self)
        {
            return WASD.Pack("shimeji", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string>("author"), self.Get<string>("color"));
        }
    }
}
