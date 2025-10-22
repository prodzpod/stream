using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Gizmo.StreamOverlay.Elements.Screens;
using Gizmo.StreamOverlay.Elements.Windows;
using Gizmo.StreamOverlay.Rooms;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Entities
{
    public class Shimeji : GameElement
    {
        public override string[] InteractsWith => [nameof(Mouse), nameof(Window), nameof(Chat), nameof(Gift)];
        public override float Mass(Instance i) => 0;
        public override float Drag(Instance i) => .9f;
        public override float Friction(Instance i) => 1;
        public override Vector2 Gravity(Instance i) => Vector2.UnitY * 4000;
        public override bool Immortal => true;
        public static Dictionary<string, float> Guys = [];
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 50;
            self.Playback = 0;
            self.Frame = 0;
            self.Set("jumps", 1f);
            self.Set("forcestate", 0);
            self.Set("forcestatetime", 0);
            self.Set("statpoint", 0);
            self.Set("streak", 0);
            self.Set("meleedamagedealt", 0f);
            self.Set("rangedamagedealt", 0f);
            self.Set("damagetaken", 0f);
            self.Set("timesdodged", 0);
            self.Set("distancewalked", 0f);
            self.Set("timeskicked", 0);
            self.Set("timesjumped", 0);
            self.Set("timespeaced", 0);
            self.Set("timespetted", 0);
            self.Set("grounded", false);
            self.Set("timeairborne", 0f);
            self.Set("timegrounded", 0f);
            self.Set("stun", 0f);
            self.Set("QueuedActions", new List<HookRequest>());
            self.Set("hostiles", new List<Instance>());
            self.Set("previousmovement", "idle"); // "enum" of "idle", "move", "jump", "attack", "kick", "peace"
            self.Set("innocence", true);
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
            self.Set("previousposition", self.Position);
            var maxhp = Graphic.New(self, Resource.NineSlices["WHITE"]);
            maxhp.Set("size", new Vector2(128, 8));
            maxhp.Position.X -= 11;
            maxhp.Position.Y -= ((Sprite)self.Sprite).Size.Y / 2 - 28;
            maxhp.Blend = ColorP.BLACK * (MainRoom.COLLAB_MODE ? 1 : .5f);
            maxhp.Alpha = 0;
            var hp = Graphic.New(self, Resource.NineSlices["WHITE"]);
            hp.Set("size", new Vector2(128, 8));
            hp.Position.X -= 11;
            hp.Position.Y -= ((Sprite)self.Sprite).Size.Y / 2 - 28;
            hp.Blend = new ColorP(0, 255, 0);
            hp.Alpha = 0;
            self.Set("e_maxhp", maxhp);
            self.Set("e_hp", hp);
            Guys[self.Get<string>("author")!] = Game.Time;
            if (StreamOverlay.Shimeji.ContainsKey("prodzpod") && StreamOverlay.Shimeji["prodzpod"].Get<bool>("raidboss") && self.Get<string>("author") != "prodzpod")
            {
                var h = self.Get<List<Instance>>("hostiles"); h.Add(StreamOverlay.Shimeji["prodzpod"]);
                self.Set("hostiles", h);
                self.Set("innocence", false);
            }
        }
        public static float MaxSpeed = 500;
        public override void OnDestroy(ref Instance self)
        {
            var _self = self;
            List<Instance> attackers = StreamOverlay.Shimeji.Values.Where(x => x.Get<List<Instance>>("hostiles").Contains(_self)).ToList();
            foreach (var attacker in attackers) EndCombat(attacker);
            var author = self.Get<string>("author");
            if (attackers.Count > 0)
            {
                if (self.Element is RaidBoss) attackers = attackers[0..1];
                Audio.Play("screen/gong");
                foreach (var attacker in attackers)
                {
                    attacker.Set("statpoint", attacker.Get<int>("statpoint") + 1);
                    if (attacker.Element is RaidBoss)
                    {
                        StreamWebSocket.Send("announce", $"{author} has been defeated by the hands of the Raid Boss, you may !guy and fight again if you arent !autorespawn yet");
                        StreamWebSocket.Send("updatehistory", attacker.Get<string>("author"), "raidbossdeaths", 1);
                    }
                    else
                    {
                        StreamWebSocket.Send("announce", $"{attacker.Get<string>("author")} has come out Victorious at the valiant fight against {self.Get<string>("author")}, use `!levelup [stat]` to level up");
                        self.Set("streak", self.Get<int>("streak") + 1);
                        StreamWebSocket.Send("updatehistory", attacker.Get<string>("author"), "maxstreak", attacker.Get<int>("streak"));
                        StreamWebSocket.Send("updatehistory", attacker.Get<string>("author"), "wins", 1);
                        if (self.Element is RaidBoss) StreamWebSocket.Send("updatehistory", attacker.Get<string>("author"), "raidbosswins", 1);
                    }
                }
            }
            if (!attackers.Any(x => x.Element is RaidBoss)) StreamWebSocket.Send("updatehistory", author, "losses", 1);
            EndCombat(self);
            StreamOverlay.Shimeji.Remove(author);
            if (!self.Var.ContainsKey("forcenorespawn")) Task.Run(async () =>
            {
                await Task.Delay(2500);
                StreamWebSocket.Send("shimejideath", author);
            });
            // Guys.Remove(self.Get<string>("author")!);
            base.OnDestroy(ref self);
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            self.Set("hostiles", self.Get<List<Instance>>("hostiles").Where(x => !x.Destroyed).ToList());
            if (self.Get<float>("stun") > 0)
            {
                self.Set("stun", self.Get<float>("stun") - deltaTime);
                return;
            }
            var QueuedActions = self.Get<List<HookRequest>>("QueuedActions");
            if (self.Var.ContainsKey("idle"))
            {
                self.Set("idle", self.Get<float>("idle") - deltaTime);
                if (self.Get<float>("idle") <= 0) { self.Var.Remove("idle"); QueuedActions.RemoveAt(0); }
            }
            if (QueuedActions.Count == 0) QueuedActions.Add(new HookRequest(self, "idle"));
            var ai = self.Get<Dictionary<string, float>>("ai");
            if (QueuedActions.Count > 0 && QueuedActions[0].Completed)
            {
                if (QueuedActions[0].State != "")
                {
                    var _data = WASD.Unpack(QueuedActions[0].State)[1] ?? "";
                    string[] data = (_data is not string ? "" : _data as string).Split(" ");
                    switch (data[0])
                    {
                        case "idle":
                            {
                                if (data.Length <= 1 || !float.TryParse(data[1], out float res)) res = 1000;
                                res = MathP.Clamp(res, 0, float.MaxValue);
                                self.Set("idle", res / 1000f);
                                break;
                            }
                        case "move":
                            {
                                if (data.Length <= 1 || !float.TryParse(data[1], out float res)) res = 1920 - self.Position.X;
                                res = MathP.Clamp(res, 0, 1920);
                                self.Set("targetX", res);
                                break;
                            }
                        case "jump":
                            {
                                if (data.Length <= 1 || !float.TryParse(data[1], out float res1)) res1 = self.Position.X;
                                if (data.Length <= 2 || !float.TryParse(data[2], out float res2)) res2 = 0;
                                res1 = MathP.Clamp(res1, 0, 1920);
                                res2 = MathP.Clamp(res2, 0, 1080);
                                self.Set("forcejump", true); self.Set("target", new Vector2(res1, res2));
                                break;
                            }
                        case "attack":
                            {
                                var _self = self;
                                foreach (var guy in Game.INSTANCES.Where(x => x != _self && x.Element is Shimeji).Where(x => HitboxP.Check(x, _self)))
                                {
                                    if (StreamOverlay.Shimeji.ContainsKey("prodzpod") && StreamOverlay.Shimeji["prodzpod"].Get<bool>("raidboss"))
                                        if (!self.Get<bool>("raidboss") && !self.Get<List<Instance>>("hostiles").Contains(guy)) continue;
                                    if (guy.Get<bool>("innocence") && !self.Get<List<Instance>>("hostiles").Contains(guy)) continue;
                                    TryAttack(self, guy);
                                }
                                var attackspeed = 1 / self.Get<float>("attackspeed");
                                self.Set("idle", RandomP.Random(attackspeed, attackspeed * 4));
                                break;
                            }
                        case "kick":
                            {
                                if (data.Length <= 1 || !float.TryParse(data[1], out float res1)) res1 = MathP.PosMod(self.Angle + 90, 360) > 180 ? 0 : 1920;
                                if (data.Length <= 2 || !float.TryParse(data[2], out float res2)) res2 = MathP.PosMod(self.Angle, 360) > 180 ? 1080 : 0;
                                res1 = MathP.Clamp(res1, 0, 1920);
                                res2 = MathP.Clamp(res2, 0, 1080);
                                var _self = self;
                                foreach (var window in Game.INSTANCES.Where(x => (x.Element is Window || x.Element is Chat || x.Element is Gift) && !x.Get<bool>("pinned") && !x.Get<bool>("racked") && x.Element is not SongWindow))
                                    TryKick(self, window, new Vector2(res1, res2));
                                self.Set("idle", .05f / ai["aggression"]);
                                break;
                            }
                        case "war":
                            {
                                var hostiles = self.Get<List<Instance>>("hostiles");
                                var _self = self;
                                foreach (var guy in Game.INSTANCES.Where(x => x != _self && x.Element is Shimeji).Where(x => HitboxP.Check(x, _self)))
                                    if (!hostiles.Contains(guy)) hostiles.Add(guy);
                                self.Set("hostiles", hostiles);
                                self.Set("innocence", false);
                                StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timesattacked", 1);
                                // TODO: add warning
                                self.Set("idle", 0.1f);
                                break;
                            }
                        case "peace":
                            {
                                var hostiles = self.Get<List<Instance>>("hostiles");
                                foreach (var guy in hostiles)
                                {
                                    var _QueuedActions = guy.Get<List<HookRequest>>("QueuedActions");
                                    _QueuedActions.Add(new HookRequest(guy, "peaced"));
                                }
                                hostiles.Clear();
                                self.Set("hostiles", hostiles);
                                EndCombat(self);
                                self.Set("idle", 0.1f);
                                break;
                            }
                        case "chat":
                            {
                                self.Set("idle", 0.1f);
                                break;
                            }
                        default:
                            {
                                Logger.Error("invalid output from user code: " + WASD.Pack(data[0]));
                                self.Set("idle", 1f);
                                break;
                            }
                    }
                    QueuedActions[0].Completed = false;
                    self.Set("previousmovement", data[0]);
                }
            }
            self.Set("QueuedActions", QueuedActions);
            if (self.Var.ContainsKey("targetX")) // move is active
            {
                float targetX = self.Get<float>("targetX");
                self.Speed.X = MathP.Clamp((targetX - self.Position.X) * 5 + MathP.SExp(self.Speed.X - (targetX - self.Position.X) * 5, .01f, deltaTime), -MaxSpeed, MaxSpeed);
                if (MathP.Abs(self.Speed.X) < 1 || self.Position.X < 8 || self.Position.X > (1920 - 8))
                {
                    self.Var.Remove("targetX");
                    QueuedActions.RemoveAt(0);
                }
                if (self.Speed.Y > MetaP.TargetFPS * 2) self.Frame = 3;
                if (self.Get<bool>("grounded")) self.Set("timegrounded", self.Get<float>("timegrounded") + deltaTime);
                else self.Set("timeairborne", self.Get<float>("timeairborne") + deltaTime);
                if (Math.Abs(self.Speed.Y) > MetaP.TargetFPS * 2) self.Set("grounded", false);
                else self.Frame = (self.Frame + deltaTime * self.Speed.X / 16) % 3;
                if (MathP.Abs(self.Speed.Y) < MetaP.TargetFPS)
                    self.Rotation = MathP.Lerp(self.Rotation, -self.Angle * 5, .5f);
            }
            if (self.Var.ContainsKey("forcejump")) // jump is active
            {
                if (self.Get<bool>("forcejump"))
                {
                    Vector2 target = self.Get<Vector2>("target");
                    self.Set("timesjumped", self.Get<int>("timesjumped") + 1);
                    self.Set("forcejump", false);
                    self.Set("jumps", self.Get<float>("jumps") - 1);
                    self.Speed.Y = MathP.Lerp(-800, -4000, (self.Position.Y - target.Y) / 1080);
                    self.Speed.X = 4000 * (target.X - self.Position.X) / 960;
                }
                if (self.Get<bool>("grounded"))
                {
                    self.Var.Remove("forcejump");
                    self.Var.Remove("target");
                    QueuedActions.RemoveAt(0);
                }
            }
            if (Math.Abs(self.Speed.Y) > MetaP.TargetFPS * 2) self.Set("grounded", false);
            if (self.Var.ContainsKey("incombatfor"))
                self.Set("incombatfor", self.Get<float>("incombatfor") + deltaTime);
            self.Set("hp", MathP.Min(self.Get<float>("maxhp"), self.Get<float>("hp") + (deltaTime * ai["appleness"] / 2)));
            self.Set("distancewalked", self.Get<float>("distancewalked") + Math.Abs(self.Get<Vector2>("previousposition").X - self.Position.X));
            self.Set("previousposition", self.Position);
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
            if (other == null) 
            {
                if (self.Position.Y > Game.Room.Camera.Y) self.Set("grounded", true);
                return;
            }
            /*
            if (self.Speed.Y > other.Speed.Y) for (int i = 1; i < StepAssist; i++)
            {
                self.Position.Y -= i;
                if (!HitboxP.Check(self, other))
                {
                    self.Speed.Y = -self.Speed.Y * self.Bounciness - i * MetaP.TargetFPS;
                    self.Set("grounded", true);
                    return;
                }
                else self.Position.Y += i;
            }
            */
        }

        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            self.Var.Remove("target");
            if (StreamOverlay.ClickedInstance != self) self.Set("stun", .5f);
        }

        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (self.Speed.X < 0) self.Scale.X *= -1;
            base.OnDraw(ref self, deltaTime);
            if (self.Speed.X < 0) self.Scale.X *= -1;
            var e_maxhp = self.Get<Instance>("e_maxhp");
            var e_hp = self.Get<Instance>("e_hp");
            if (self.Get<List<Instance>>("hostiles").Count > 0 || self.Element is RaidBoss)
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
        public static void TryKick(Instance self, Instance other, Vector2 target)
        {
            if (!HitboxP.Check(self, other)) return;
            var ai = self.Get<Dictionary<string, float>>("ai");
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
            if (ai["aggression"] > .05f && RandomP.Chance(ai["aggression"]) && other.Element is not SongWindow && other.Element is not DrawWindow) other.Destroy();
            else self.Set("timeskicked", self.Get<int>("timeskicked") + 1);
            Audio.Play("screen/kick");
        }
        public static void TryAttack(Instance self, Instance victim)
        {
            self.Set("innocence", false);
            var d = Game.DRAW_ORDER.ToList();
            if (self.Element is RaidBoss || d.IndexOf(self) > d.IndexOf(victim))
                self.Set("meleedamagedealt", self.Get<float>("meleedamagedealt") + OnAttackNeverMiss(self, victim));
            else
            {
                Audio.Play("screen/speak"); // todo: miss sound
                victim.Set("timesdodged", victim.Get<int>("timesdodged") + 1);
            }
        }

        public static float OnAttackNeverMiss(Instance self, Instance victim)
        {
            var damage = self.Get<float>("attack");
            if (RandomP.Chance(self.Get<float>("critchance")))
                damage *= self.Get<float>("critdamage");
            damage = RandomP.Random(0, damage);
            OnHit(victim, self, damage, []);
            Audio.Play("screen/kick");
            self.Set("forcestate", 4);
            self.Set("forcestatetime", .25f);
            return damage;
        }

        public static void OnHit(Instance self, Instance attacker, float damage, Dictionary<string, object> special)
        {
            if (!self.Var.ContainsKey("incombatfor"))
            {
                StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timesattackedupon", 1);
                self.Set("incombatfor", 0f);
            }
            var hostiles = self.Get<List<Instance>>("hostiles");
            if (!hostiles.Contains(attacker))
            {
                hostiles.Add(attacker);
                self.Set("hostiles", hostiles);
                self.Set("innocence", false);
            }
            var QueuedActions = self.Get<List<HookRequest>>("QueuedActions");
            QueuedActions.Add(new HookRequest(self, "attacked", [new object?[] { "damage", damage }]));
            self.Set("QueuedActions", QueuedActions);
            Damage(self, damage, special);
        }

        public static void Damage(Instance self, float damage, Dictionary<string, object> special)
        {
            var damageReal = Math.Max(1, damage - self.Get<float>("defense"));
            self.Set("damagetaken", self.Get<float>("damagetaken") + damageReal);
            self.Set("forcestate", 5);
            self.Set("forcestatetime", .25f);
            var hp = self.Get<float>("hp") - damageReal;
            self.Set("hp", hp);
            if (hp <= 0) self.Destroy();
        }

        public static void EndCombat(Instance guy)
        {
            if (!guy.Destroyed && guy.Get<List<Instance>>("hostiles").Count > 0) return; // dont do anything yet
            StreamWebSocket.Send("updatehistory", guy.Get<string>("author"), "meleedamagedealt", guy.Get<float>("meleedamagedealt"));
            StreamWebSocket.Send("updatehistory", guy.Get<string>("author"), "rangedamagedealt", guy.Get<float>("rangedamagedealt"));
            StreamWebSocket.Send("updatehistory", guy.Get<string>("author"), "damagetaken", guy.Get<float>("damagetaken"));
            StreamWebSocket.Send("updatehistory", guy.Get<string>("author"), "timesdodged", guy.Get<int>("timesdodged"));
            StreamWebSocket.Send("updatehistory", guy.Get<string>("author"), "averagedps", (guy.Get<float>("meleedamagedealt") + guy.Get<float>("rangedamagedealt")) / guy.Get<float>("incombatfor"));
            guy.Set("meleedamagedealt", 0f);
            guy.Set("rangedamagedealt", 0f);
            guy.Set("damagetaken", 0f);
            guy.Set("timesdodged", 0);
            guy.Set("incombatfor", 0f);
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
            nametagBG.Blend = ColorP.BLACK * (MainRoom.COLLAB_MODE ? 1 : .75f);
            nametag.Position.Y -= sprite.Size.Y / 2 - 26;
            return i;
        }

        public override string Serialize(ref Instance self)
        {
            StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "distancewalked", self.Get<float>("distancewalked"));
            StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timeskicked", self.Get<int>("timeskicked"));
            StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timesjumped", self.Get<int>("timesjumped"));
            StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timespetted", self.Get<int>("timespetted"));
            StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timeairborne", self.Get<float>("timeairborne"));
            StreamWebSocket.Send("updatehistory", self.Get<string>("author"), "timegrounded", self.Get<float>("timegrounded"));
            self.Set("distancewalked", 0f);
            self.Set("timeskicked", 0);
            self.Set("timesjumped", 0);
            self.Set("timespetted", 0);
            self.Set("timeairborne", 0f);
            self.Set("timegrounded", 0f);
            return WASD.Pack("shimeji", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string>("author"));
        }

        public class HookRequest(string State, bool Completed)
        {
            public string State = State;
            public bool Completed = Completed;

            public HookRequest(Instance self, string state, object?[] extra): this(state, false)
            {
                static object?[]? VecToArr(Vector2? v) => v != null ? [v.Value.X, v.Value.Y] : null;
                var f = this;
                var windows = Game.INSTANCES.Where(x => (x.Element is Window || x.Element is Chat || x.Element is Gift) && !x.Get<bool>("pinned") && !x.Get<bool>("racked") && x.Element is not SongWindow);
                var guys = Game.INSTANCES.Where(x => x != self && x.Element is Shimeji);
                StreamWebSocket.Send("callhook", self.Get<string>("author"), state, extra.Concat([
                    // physics
                    new object?[] { "position", VecToArr(self.Position) },
                    new object?[] { "speed", VecToArr(self.Speed) },
                    new object?[] { "angle", self.Angle },
                    new object?[] { "rotation", self.Rotation },
                    new object?[] { "grounded", self.Get<bool>("grounded") },
                    // body
                    new object?[] { "hp", self.Get<float>("hp") },
                    new object?[] { "maxhp", self.Get<float>("maxhp") },
                    new object?[] { "attack", self.Get<float>("attack") },
                    new object?[] { "critchance", self.Get<float>("critchance") },
                    // brain
                    new object?[] { "previousmovement", self.Get<string>("previousmovement") },
                    // war
                    new object?[] { "incombat", self.Get<List<Instance>>("hostiles").Count > 0 },
                    new object?[] { "nearesthostile", VecToArr(self.Get<List<Instance>>("hostiles").MinBy(x => MathP.Dist(x.Position, self.Position))?.Position) },
                    new object?[] { "nearestguy", VecToArr(guys.MinBy(x => MathP.Dist(x.Position, self.Position))?.Position) },
                    new object?[] { "nearestwindow", VecToArr(windows.MinBy(x => MathP.Dist(x.Position, self.Position))?.Position) },
                    new object?[] { "hostilenearme", self.Get<List<Instance>>("hostiles").Where(x => HitboxP.Check(x, self)).Count() },
                    new object?[] { "guynearme", guys.Where(x => HitboxP.Check(x, self)).Count() },
                    new object?[] { "windownearme", windows.Where(x => HitboxP.Check(x, self)).Count() },
                ]).ToArray(), (object?[] data) =>
                {
                    f.State = (data != null) ? WASD.Pack(data) : "";
                    f.Completed = true;
                });
            }
            public HookRequest(Instance self, string state) : this(self, state, []) { }
        }
    }
}
