using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Rooms
{
    public class StartingSoon : Room
    {
        public static Instance?[] Guys = [null, null, null, null, null];
        public override void OnEnter(Room? room)
        {
            base.OnEnter(room);
            Instance t;
            Instance Spawn(string sprite, Vector2 pos, float depth)
            {
                Sprite s = Resource.Sprites[sprite]!;
                var t = Squareish.New(nameof(Squareish), pos, s.Size, s);
                t.Depth = depth; t.Get<Instance[]>("children")![0].Depth = depth;
                return t;
            }
            StreamOverlay.Prod = Instance.New(nameof(Prod));
            StreamOverlay.Prod.Alpha = 0;
            Spawn("forrest/1/beet", new(540+(114/2f), 634+(255/2f)), -10);
            t = Spawn("forrest/1/guy_sitting", new(1219+(111/2f), 639+(258/2f)), -10); t.Blend = new("#A8A8A8");
            t = Spawn("forrest/1/guy_sitting", new(1326+(111/2f), 627+(258/2f)), -10); t.Blend = new("#A8A8A8");
            // persons
            t = Spawn("forrest/1/cat", new(1308+(246/2f), 535+(546/2f)), 0);
            t.onUpdate += d =>
            {
                var big = 1.66f;
                ColorP[] colors = [new("#A7A7A7"), new("#C5C5C5"), new("#DADADA"), new("#EEEEEE"), new("#FFFFFF")];
                float[] ys = [519f+(393/2f), 538f+(390/2f), 551f+(390/2f), 559f+(393/2f), 721f+(654/2f)];
                for (int i = 0; i < 5; i++) if (Guys[i] == null && RandomP.Chance(.01f))
                {
                    var sprite = "guy_" + RandomP.Random(1, 3);
                    var isBig = sprite == "guy_3"; sprite = "forrest/1/" + sprite;
                    var scale = 1f; if (i != 4 && isBig) scale /= big; if (i == 4 && !isBig) scale *= big;
                    var color = colors[i];
                    var spawnFromRight = RandomP.Chance(.5);
                    var t = Spawn(sprite, new(spawnFromRight ? 1920 : 0, ys[i]), i == 4 ? 1 : i - 5);
                    t.Set("i", i); t.Scale = new((spawnFromRight ? -1 : 1) * scale, scale); t.Blend = color;
                    t.Speed = new(RandomP.Random(350, 500 * (spawnFromRight ? -1 : 1)), 0);
                    t.Set("originRight", spawnFromRight); t.Set("phasethrough", true);
                    t.onDestroy += () => { if (Guys[t.Get<int>("i")] == t) Guys[t.Get<int>("i")] = null; return true; };
                    t.Set("originalGravity", Vector2.UnitY * 2000);
                    t.onUpdate += d => {
                        if ((-30 > t.Position.X) || (1950 < t.Position.X)) t.Destroy();
                        if (Guys[t.Get<int>("i")] == t && !t.Var.ContainsKey("originalGravity"))
                        {
                            t.Set("phasethrough", false);
                            Guys[t.Get<int>("i")] = null;
                        }
                        return true;  
                    };
                    Guys[i] = t;
                }
                return true;
            };
            JustChatting.Index = [0, 0];
            MainRoom.COLLAB_MODE = true; // just in case
            StreamWebSocket.Send("forrest", "start");
        }
    }
}
