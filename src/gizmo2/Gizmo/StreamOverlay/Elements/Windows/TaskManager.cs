using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.Util;
using Raylib_CSharp.Images;
using Raylib_CSharp.Textures;
using System.Diagnostics;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class TaskManager: Window
    {
        public override bool Immortal => true;
        public static int NumWindows = 0;
        public static int PopoutLimit = 50;
        public static PerformanceCounter CPUCounter;
        public static PerformanceCounter RAMCounter;
        public static int[][] points = [new int[80], new int[80], new int[80], new int[80], new int[345]];
        public static bool DrawReady = false;

        public static Instance? Instance = null;
        public static Image? Graph = null;
        public static ColorP GREEN = new(0, 255, 0);
        public static Instance New(Vector2 pos)
        {
            var l0 = Resource.NineSlices["WHITE"];
            var l1 = Resource.Sprites["window/taskmanager_1"];
            var l2 = Resource.Sprites["window/taskmanager_2"];
            var l3 = Resource.Sprites["window/taskmanager_3"];
            var size = l2.Size;
            Graph = Image.GenColor((int)size.X, (int)size.Y, ColorP.TRANSPARENT);
            var i = New(nameof(TaskManager), pos, size, l0, l1, new Sprite() { Image = Texture2D.LoadFromImage(Graph.Value), Size = size, Subimages = Vector2.One}, l2, l0, l0, l3, l0, l0, l0);
            i.Set("lastUpdate", float.MinValue);
            var children = i.Get<Instance[]>("children");
            children[0].Blend = ColorP.BLACK;
            children[0].Set("size", size);
            children[4].Blend = GREEN;
            children[5].Blend = GREEN;
            foreach (var q in points) Array.Fill(q, -1);
            Audio.Play("screen/error");
            children[7].Position = new Vector2(74, 151) - (size / 2);
            children[8].Position = new Vector2(74, 243) - (size / 2);
            children[9].Position = new Vector2(62, 284) - (size / 2);
            i.Scale = Vector2.One * 2;
            return i;
        }
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            Instance = self;
        }
        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            Instance = null;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            var children = self.Get<Instance[]>("children");
            if (self.Get<float>("lastUpdate") < self.Life - 1)
            {
                // fetch data
                var size = ((Sprite)children[3].Sprite).Size;
                var cpu = CPUCounter.NextValue() / 100f;
                var ram = RAMCounter.NextValue() / (32f * 1024);
                self.Set("lastUpdate", self.Life);
                // bar graph
                children[4].Position = new Vector2(53 + (33 / 2), 99 + 37 * (1 - cpu / 2)) - (size / 2);
                children[4].Set("size", new Vector2(33, 37 * cpu));
                children[5].Position = new Vector2(53 + (33 / 2), 191 + 37 * (1 - ram / 2)) - (size / 2);
                children[5].Set("size", new Vector2(33, 37 * ram));
                children[7].Sprite = Text.Compile(MathP.Floor(cpu * 100) + "'/.", "arcaoblique", 13, Vector2.Zero, GREEN);
                children[8].Sprite = Text.Compile(MathP.Floor(ram * 100) + "'/.", "arcaoblique", 13, Vector2.Zero, GREEN);
                // curve graph
                children[1].Position.X -= 1;
                while (children[1].Position.X <= -12) children[1].Position.X += 12;
                for (int i = 0; i < points.Length; i++)
                {
                    var arr = points[i];
                    var target = i == 4 ? ram : cpu;
                    if (arr.Last() != -1) target = MathP.Average(target, (60 - arr.Last()) / 60f);
                    target += RandomP.Random(-.05f, .05f);
                    arr = [.. arr[1..], (int)MathP.Lerp(60, 0, MathP.Clamp(target, 0, 1))];
                    points[i] = arr;
                }
                DrawReady = false;
                var g = Graph.Value;
                g.ClearBackground(ColorP.TRANSPARENT);
                Vector2[] OFFSETS = [new(140, 95), new(228, 95), new(316, 95), new(404, 95), new(140, 187)];
                for (int i = 0; i < points.Length; i++)
                {
                    var offset = OFFSETS[i];
                    var color = i == 4 ? new ColorP("#0080ff") : GREEN;
                    for (int j = 0; j < points[i].Length - 1; j++)
                    {
                        if (points[i][j] == -1) continue;
                        g.DrawLineV(offset + new Vector2(j, points[i][j]), offset + new Vector2(j + 1, points[i][j + 1]), color);
                        if (i == 4) g.DrawLineV(offset + new Vector2(j, points[i][j] - 1), offset + new Vector2(j + 1, points[i][j + 1] - 1), color);
                    }
                }
                DrawReady = true;
            }
        }

        public override void OnDraw(ref Instance self, float deltaTime)
        {
            if (DrawReady)
            {
                DrawReady = false;
                var children = self.Get<Instance[]>("children");
                ((Sprite)children[2].Sprite).Image = Texture2D.LoadFromImage(Graph.Value);
            }
            base.OnDraw(ref self, deltaTime);
        }

        public static void UpdateWindowCount()
        {
            if (Instance == null) return;
            var children = Instance.Get<Instance[]>("children");
            children[9].Sprite = Text.Compile(NumWindows.ToString(), "arcaoblique", 13, -Vector2.One, ColorP.BLACK);
        }

        public override string Serialize(ref Instance self) => "";
    }
}
