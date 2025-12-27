using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.StreamOverlay.Elements.Gizmos;
using System.Numerics;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class Window : Squareish
    {
        public override string Sprite => "window_" + StreamOverlay.Theme + "/window";
        public override float Drag(Instance i) => .9f;
        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            TaskManager.NumWindows++;
            if (self.Element is not TaskManager && TaskManager.NumWindows >= TaskManager.PopoutLimit)
            {
                if (TaskManager.Instance == null) TaskManager.New(new(960, 540));
                TaskManager.UpdateWindowCount();
            }
            self.Depth = 11;
        }
        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            TaskManager.NumWindows--;
            if (self.Element is not TaskManager)
            {
                if (TaskManager.NumWindows < TaskManager.PopoutLimit) TaskManager.Instance?.Destroy();
                else TaskManager.UpdateWindowCount();
            } 
        }
        public override void OnClick(ref Instance self, Vector2 position)
        {
            base.OnClick(ref self, position);
            var ns = (NineSlice)self.Sprite; var size = self.Get<Vector2>("size");
            if (!((GameElement)self.Element).Immortal && MathP.Between(new Vector2(size.X / 2 - ns.innerRight, -size.Y / 2), self.GetRelativePosition(position), new Vector2(size.X / 2, -size.Y / 2 + ns.innerTop))) self.Destroy();
        }
        public static Instance New(Vector2 pos, string _title, Vector2 contentSize, params IDrawable[] content) =>
            New(nameof(Window), pos, _title, contentSize, false, content);
        public static Instance New(string type, Vector2 pos, string _title, Vector2 contentSize, params IDrawable[] content) =>
            New(type, pos, _title, contentSize, false, content);
        public static Instance New(string type, Vector2 pos, string _title, Vector2 contentSize, bool silence, params IDrawable[] content)
        {
            const float OFFSET = 16;
            Text title = Text.Compile(_title, "arcaoblique", 26, Game.Room.Camera.Z, -Vector2.One);
            NineSlice? ns = Resource.NineSlices["window_" + StreamOverlay.Theme + "/window"];
            float w = MathP.Max(
                title.Size.X + ns.innerLeft + ns.innerRight,
                contentSize.X + ns.innerLeft * 2) + OFFSET * 2;
            float h = ns.innerTop + ns.innerBottom + contentSize.Y + OFFSET;
            Instance i = New(type, pos, new(w, h), [title, .. content]);
            i.Set("title", _title);
            if (!silence) Audio.Play("screen/window");
            var children = i.Get<Instance[]>("children");
            children[0].Position = new(-w / 2 + ns.innerLeft + OFFSET, -h / 2 + ns.innerTop - OFFSET);
            for (var j = 1; j < children.Length; j++) children[j].Position = new(0, ns.innerTop / 2);
            return i;
        }

        public override string Serialize(ref Instance self)
        {
            return WASD.Pack("window", (int)self.Position.X, (int)self.Position.Y, (int)(self.Angle * 256), self.Get<string>("title"), self.Get<string>("content").Replace("\n", "<br>"));
        }

    }
}
