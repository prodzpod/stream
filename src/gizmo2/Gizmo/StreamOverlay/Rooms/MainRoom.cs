using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Entities;

namespace Gizmo.StreamOverlay.Rooms
{
    public class MainRoom: Room
    {
        public override Instance[] InitialInstances => [];
        public static Instance? Making;
        public static Instance? MakingText;
        public static Instance? Phase;
        public static Instance? Chat;

        public const bool COLLAB_MODE = false;

        public override void OnEnter(Room? room)
        {
            base.OnEnter(room);
            // var z = Graphic.New(null, "temp/bg");
            // z.Position = new(960, 540);
            // z.Depth = -100;
            if (!COLLAB_MODE) Graphic.New(null, "layout/bg").Position = new(960, 540);
            Chat = Graphic.New(null, "layout/chat");
            Chat.Position = new(208, 689);
            if (COLLAB_MODE) Chat.Alpha = 0;
            StreamOverlay.Prod = Instance.New(nameof(Prod));
            if (!COLLAB_MODE) Graphic.New(null, "window/status").Position = new(93, 1056);
            if (!COLLAB_MODE) Graphic.New(null, "window/tasks").Position = new(475, 1056);
            Making = Graphic.New(null, Resource.NineSlices["window/making"]);
            if (COLLAB_MODE) Making.Alpha = 0;
            MakingText = Graphic.New(Making, Text.Compile("", "arcaoblique", 26, ColorP.BLACK));
            MakingText.Position = new(Resource.NineSlices["window/making"].innerLeft / 2, 4);
            if (COLLAB_MODE) MakingText.Alpha = 0;
            if (!COLLAB_MODE) Graphic.New(null, "window/phase").Position = new(1836, 1056);
            Phase = Graphic.New(null, Text.Compile("-1", "arcaoblique", 26, ColorP.BLACK));
            Phase.Position = new(1884 + 8, 1056 + 6);
            if (COLLAB_MODE) Phase.Alpha = 0;
            // Graphic.New(null, "temp/bg2").Position = new(960, 540);
        }
    }
}
