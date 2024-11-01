﻿using Gizmo.Engine;
using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Entities;

namespace Gizmo.StreamOverlay.Rooms
{
    public class MainRoom: Room
    {
        public override Instance[] InitialInstances => [];
        public static Instance Making;
        public static Instance MakingText;
        public static Instance Phase;

        public override void OnEnter(Room? room)
        {
            base.OnEnter(room);
            /*
            var z = Graphic.New(null, "temp/bg");
            z.Position = new(960, 540);
            z.Depth = -100;
            */
            StreamOverlay.Prod = Instance.New(nameof(Prod));
            Graphic.New(null, "layout/bg").Position = new(960, 540);
            Graphic.New(null, "window/status").Position = new(93, 1056);
            Graphic.New(null, "window/tasks").Position = new(475, 1056);
            Making = Graphic.New(null, Resource.NineSlices["window/making"]);
            MakingText = Graphic.New(Making, Text.Compile("", "arcaoblique", 26, ColorP.BLACK));
            MakingText.Position = new(Resource.NineSlices["window/making"].innerLeft / 2, 4);
            Graphic.New(null, "window/phase").Position = new(1836, 1056);
            Phase = Graphic.New(null, Text.Compile("-1", "arcaoblique", 26, ColorP.BLACK));
            Phase.Position = new(1884 + 8, 1056 + 6);
            // Graphic.New(null, "temp/bg2").Position = new(960, 540);
        }
    }
}
