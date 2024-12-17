using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Screens;
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
        public override bool Immortal => true;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 50;
            self.Playback = 0;
            self.Frame = 0;
            self.Set("incombat", false);
            self.Set("tilnextmove", 0f);
            self.Set("tilnextattack", 0f);
            self.Set("tilnextkick", 0f);
            self.Set("jumps", 1f);
            self.Set("forcejump", false);
            self.Set("forcestate", 0);
            self.Set("forcestatetime", 0);
            self.Set("statpoint", 0);
        }
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            var ai = self.Get<Dictionary<string, float>>("ai");
            self.Set("maxhp", ai["constitution"]);
            self.Set("hp", ai["constitution"]);
            self.Set("attack", ai["attack"]);
            self.Set("defense", ai["defense"]);
            self.Set("attackspeed", ai["attackspeed"]);
            self.Set("critchance", ai["critchance"]);
            self.Set("critdamage", ai["critdamage"]);
            var maxhp = Graphic.New(self, Resource.NineSlices["WHITE"]);
            maxhp.Set("size", new Vector2(128, 8));
            maxhp.Position.X -= 11;
            maxhp.Position.Y -= ((Sprite)self.Sprite).Size.Y / 2 - 28;
            maxhp.Blend = ColorP.BLACK * .5f;
            maxhp.Alpha = 0;
            var hp = Graphic.New(self, Resource.NineSlices["WHITE"]);
            hp.Set("size", new Vector2(128, 8));
            hp.Position.X -= 11;
            hp.Position.Y -= ((Sprite)self.Sprite).Size.Y / 2 - 28;
            hp.Blend = new ColorP(0, 255, 0);
            hp.Alpha = 0;
            self.Set("e_maxhp", maxhp);
            self.Set("e_hp", hp);
        }
        public static float MaxSpeed = 500;
        public override void OnDestroy(ref Instance self)
        {
            var _self = self;
            List<Instance> attackers = StreamOverlay.Shimeji.Values.Where(x => x.Get<Instance>("victim") == _self).ToList();
            foreach (var attacker in attackers)
            {
                attacker.Var.Remove("victim");
                attacker.Set("incombat", false);
            }
            if (self.Element is RaidBoss) attackers = attackers[0..1];
            if (attackers.Count > 0)
            {
                Audio.Play("screen/gong");
                foreach (var attacker in attackers)
                {
                    attacker.Set("statpoint", attacker.Get<int>("statpoint") + 1);
                    StreamWebSocket.Send("announce", $"{attacker.Get<string>("author")} has come out Victorious at the valiant fight against {self.Get<string>("author")}, use `!levelup [stat]` to level up");
                }
            }
            var author = self.Get<string>("author");
            StreamOverlay.Shimeji.Remove(author);
            StreamWebSocket.Send("shimejideath", author);
            base.OnDestroy(ref self);
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            var ai = self.Get<Dictionary<string, float>>("ai");
            if (self.Get<bool>("incombat"))
            {
                // combat code
                var t = self.Get<float>("tilnextattack") - deltaTime;
                self.Set("tilnextattack", t);
                var victim = self.Get<Instance>("victim");
                if (t < 0) OnAttack(self, victim);
            }
            self.Set("hp", MathP.Min(self.Get<float>("maxhp"), self.Get<float>("hp") + (deltaTime * ai["appleness"] / 2)));
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
                self.Set("tilnextkick", self.Get<float>("tilnextkick") - deltaTime);
                var t = self.Get<float>("tilnextmove") - deltaTime;
                if (self.Get<float>("jumps") > 0 && t < 0)
                {
                    // jump check
                    if (self.Get<bool>("forcejump") || RandomP.Chance(ai["jumpness"]))
                    {
                        self.Set("forcejump", false);
                        self.Set("jumps", self.Get<float>("jumps") - 1);
                        self.Speed.Y = MathP.Lerp(-1600, -6400, ai["jumpheight"]) * RandomP.Random(ai["zebraness"], 1);
                        var s = MathP.Sign(self.Speed.X);
                        if (s == 0) s = RandomP.Chance(.5f) ? 1 : -1;
                        self.Speed.X = s * (4000 * ai["camelness"]);
                    }
                    else
                    {
                        // move check
                        if (self.Get<bool>("incombat"))
                            self.Set("target", self.Get<Instance>("victim").Position + new Vector2(RandomP.Random(100, -100), RandomP.Random(100, -100)));
                        else self.Set("target", new Vector2(self.Position.X + ((RandomP.Chance(.5f) ? 1 : -1) * MathP.Lerp(50, 500 * ai["agility"], RandomP.Random(0, 1f))), self.Position.Y));
                        var tick = 1 / ai["dexterity"];
                        self.Set("tilnextmove", RandomP.Random(tick * .1f, tick * (.1f + ai["jokerness"])));
                    }
                }
                else self.Set("tilnextmove", t);
            }
            if (self.Get<int>("forcestate") != 0)
            {
                self.Frame = self.Get<int>("forcestate");
                var t = self.Get<float>("forcestatetime") - deltaTime;
                if (t < 0) self.Set("forcestate", 0);
                else self.Set("forcestatetime", t);
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
            if (other.Element is Squareish && !other.Get<bool>("pinned") && !other.Get<bool>("racked") && self.Var.ContainsKey("target") && self.Get<float>("tilnextkick") < 0)
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
                other.Set("kickedby", self);
                other.Set("kickedbytime", 5f);
                if (ai["aggression"] > .05f && RandomP.Chance(ai["aggression"])) other.Destroy();
                Audio.Play("screen/kick");
                self.Set("tilnextkick", .05f / ai["aggression"]);
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
            var e_maxhp = self.Get<Instance>("e_maxhp");
            var e_hp = self.Get<Instance>("e_hp");
            if (self.Get<bool>("incombat"))
            {
                var maxhp = self.Get<float>("maxhp");
                var hp = self.Get<float>("hp");
                e_maxhp.Alpha = 1;
                e_hp.Alpha = 1;
                e_hp.Set("size", new Vector2(256 * hp / maxhp, 8));
                e_hp.Position.X = e_maxhp.Position.X - (128 - (128 * hp / maxhp));
            }
            else
            {
                e_maxhp.Alpha = 0;
                e_hp.Alpha = 0;
            }
        }

        public static void OnAttack(Instance self, Instance victim)
        {
            if (!HitboxP.Check(self, victim)) return;
            var d = Game.DRAW_ORDER.ToList();
            if (self.Element is RaidBoss || d.IndexOf(self) > d.IndexOf(victim)) OnAttackNeverMiss(self, victim);
            else Audio.Play("screen/speak"); // todo: miss sound
            var attackspeed = 1 / self.Get<float>("attackspeed");
            self.Set("tilnextattack", RandomP.Random(attackspeed, attackspeed * 4));
        }

        public static void OnAttackNeverMiss(Instance self, Instance victim)
        {
            var damage = self.Get<float>("attack");
            if (RandomP.Chance(self.Get<float>("critchance")))
                damage *= self.Get<float>("critdamage");
            OnHit(victim, self, RandomP.Random(0, damage), []);
            Audio.Play("screen/kick");
            self.Set("forcestate", 4);
            self.Set("forcestatetime", .25f);
        }

        public static void OnHit(Instance self, Instance attacker, float damage, Dictionary<string, object> special)
        {
            self.Set("incombat", true);
            self.Set("victim", attacker);
            self.Set("target", self.Position);
            self.Set("forcestate", 5);
            self.Set("forcestatetime", .25f);
            var hp = self.Get<float>("hp") - (damage - self.Get<float>("defense"));
            self.Set("hp", hp);
            self.Set("lastattacked", attacker);
            if (hp <= 0) self.Destroy();
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
