using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Entities;
using Gizmo.StreamOverlay.Elements.Gizmos;
using Raylib_CSharp;

namespace Gizmo.StreamOverlay.Rooms
{
    public class MainRoom: Room
    {
        public override Instance[] InitialInstances => [];
        public static Instance? Making;
        public static Instance? MakingText;
        public static Instance? Phase;
        public static List<Instance> BGS = [];
        public static Instance? Chat;

        public static bool COLLAB_MODE = false;
        public static bool LALA_MODE = false;

        public override void OnEnter(Room? room)
        {
            base.OnEnter(room);
            // var z = Graphic.New(null, "temp/bg");
            // z.Position = new(960, 540);
            // z.Depth = -100;
            var bg = Graphic.New(null, "layout/bg_" + StreamOverlay.Theme);
            bg.Position = new(960, 540);
            BGS.Add(bg);
            if (COLLAB_MODE) bg.Alpha = 0;
            Chat = Squareish.New(nameof(Squareish), new(208, 689), new(408, 686), Resource.Sprites["layout/chat_" + StreamOverlay.Theme]);
            Chat.onUpdate += delta =>
            {
                Chat.Angle = 0;
                return true;
            };
            if (COLLAB_MODE) Chat.Alpha = 0;
            StreamOverlay.Prod = Instance.New(nameof(Prod));
            if (!COLLAB_MODE)
            {
                var z1 = Graphic.New(null, "window_" + StreamOverlay.Theme + "/status" + (LALA_MODE ? "_lala" : ""));
                BGS.Add(z1);
                z1.Position = new(93 + (LALA_MODE ? 36 : 0), 1056);
                var z2 = Graphic.New(null, "window_" + StreamOverlay.Theme + "/tasks" + (LALA_MODE ? "_lala" : ""));
                BGS.Add(z2);
                z2.Position = new(475 + (LALA_MODE ? 71 : 0), 1056);
            }
            Making = Graphic.New(null, Resource.NineSlices["window_" + StreamOverlay.Theme + "/making"]);
            BGS.Add(Making);
            if (COLLAB_MODE) Making.Alpha = 0;
            MakingText = Graphic.New(Making, Text.Compile("", "arcaoblique", 26, StreamOverlay.DefaultTextColor));
            MakingText.Position = new(Resource.NineSlices["window_" + StreamOverlay.Theme + "/making"].innerLeft / 2, 4);
            BGS.Add(MakingText);
            if (COLLAB_MODE) MakingText.Alpha = 0;
            if (!COLLAB_MODE) {
                var z = Graphic.New(null, "window_" + StreamOverlay.Theme + "/phase");
                z.Position = new(1836, 1056);
                BGS.Add(z);
            }
            Phase = Graphic.New(null, Text.Compile("-1", "arcaoblique", 26, StreamOverlay.DefaultTextColor));
            Phase.Position = new(1884 + 8, 1056 + 6);
            BGS.Add(Phase);
            if (COLLAB_MODE) Phase.Alpha = 0;
            // Graphic.New(null, "temp/bg2").Position = new(960, 540);
        }
    }
}
