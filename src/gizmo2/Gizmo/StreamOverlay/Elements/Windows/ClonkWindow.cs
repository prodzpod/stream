using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class ClonkWindow : Window
    {
        public override bool Immortal => true;
        public static Instance? Instance = null;
        public static List<Instance> Letters = [];
        public static int WINDOW_WIDTH = 400;
        public static int WINDOW_HEIGHT = 400;
        public static int CHARACTER_WIDTH = 128;
        public static int CHARACTER_HEIGHT = 64;
        public static int GRANULARITY = 2;
        public override void OnInit(ref Instance self)
        {
            self.Depth = -1;
            base.OnInit(ref self);
            self.Depth = -1;
        }
        public override void OnDestroy(ref Instance self)
        {
            Instance = null;
            base.OnDestroy(ref self);
        }
        public static void Tracker(string raw)
        {
            if (Instance == null)
            {
                Instance = New(nameof(ClonkWindow), new(960, 540), "Male Cam", new(WINDOW_WIDTH, WINDOW_HEIGHT), Resource.NineSlices["WHITE"]);
                var bg = Instance.Get<Instance[]>("children")[1];
                bg.Set("size", new Vector2(WINDOW_WIDTH, WINDOW_HEIGHT));
                bg.Blend = new ColorP("#222222");
            }
            int width = 0, height = 0;
            int mode = 1, ptr = 0; ColorP color = ColorP.BLACK;
            foreach (var l in Letters) l.Destroy();
            Letters.Clear();
            List<Vector2> chars = [];
            while (ptr < raw.Length)
            {
                if (raw[ptr] == '\x01') mode = 1;
                else if (raw[ptr] == '\x02') mode = 2;
                else if (raw[ptr] == '\x03') mode = 3;
                ptr++;
                int idx1 = raw.IndexOf('\x01', ptr); if (idx1 < 0) idx1 = raw.Length;
                int idx2 = raw.IndexOf('\x02', ptr); if (idx2 < 0) idx2 = raw.Length;
                int idx3 = raw.IndexOf('\x03', ptr); if (idx3 < 0) idx3 = raw.Length;
                int idx = MathP.Min(idx1, idx2, idx3);
                if (mode == 2) idx = ptr + 6;
                string sub = raw[ptr..idx];
                if (idx == raw.Length) break;
                ptr = idx;
                switch (mode)
                {
                    case 1:
                        int amt = int.Parse(sub);
                        width += amt;
                        height += width / CHARACTER_WIDTH;
                        width %= CHARACTER_WIDTH;
                        break;
                    case 2:
                        color = new(sub);
                        mode = 3;
                        ptr--;
                        break;
                    case 3:
                        foreach (char c in sub)
                        {
                            string s = c.ToString();
                            Vector2 pos = new(MathP.Floor((float)width / GRANULARITY), MathP.Floor((float)height / GRANULARITY));
                            if (!string.IsNullOrWhiteSpace(s) && !chars.Contains(pos))
                            {
                                var g = Graphic.New(Instance, Text.Compile(s, "iosevka", 16, color));
                                g.Position = new(
                                    MathP.Lerp(-WINDOW_WIDTH / 2, WINDOW_WIDTH / 2, pos.X * GRANULARITY / CHARACTER_WIDTH), 
                                    MathP.Lerp(-WINDOW_HEIGHT / 2, WINDOW_HEIGHT / 2, pos.Y * GRANULARITY / CHARACTER_HEIGHT) + (Resource.NineSlices["window_" + StreamOverlay.Theme + "/window"].innerTop / 2));
                                Letters.Add(g);
                                chars.Add(pos);
                            }
                            width++;
                            if (width == CHARACTER_WIDTH) { width = 0; height++; }
                        }
                        break;
                }
            }
        }
        public override string Serialize(ref Instance self) => "";
    }
}
