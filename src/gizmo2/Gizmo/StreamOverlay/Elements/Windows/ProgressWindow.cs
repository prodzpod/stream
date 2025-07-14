using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Gizmo.StreamOverlay.Elements.Windows
{
    public class ProgressWindow: Window
    {
        public static Dictionary<string, Instance> ProgressWindows = [];
        public static Instance New(Vector2 pos, string title, string _content, string id)
        {
            NineSlice? nsWindow = Resource.NineSlices["window/window"];
            Sprite? nsProgress = Resource.Sprites["window/progress"];
            float sizeX = nsProgress.Size.X + 256 + Commands.Windows.Window.OFFSET + 8;
            Text content = Text.Compile(_content, "arcaoblique", 26, sizeX, -Vector2.One, ColorP.BLACK);
            Text placeholder = Text.Compile("1", "arcaoblique", 26, sizeX, Vector2.Zero, ColorP.BLACK);
            float sizeY = content.Size.Y + nsProgress.Size.Y + placeholder.Size.Y + Commands.Windows.Window.OFFSET + 8;
            var i = New(nameof(ProgressWindow), pos, title, new(sizeX, sizeY), content, Resource.Sprites["window/progress"], Resource.NineSlices["window/progress_inner"], placeholder);
            i.Set("content", _content);
            i.Set("value", 1f);
            i.Set("maxvalue", 1f);
            var children = i.Get<Instance[]>("children");
            var size = i.Get<Vector2>("size");
            children[1].Position = new(-size.X / 2 + nsWindow.innerLeft + Commands.Windows.Window.OFFSET, -size.Y / 2 + nsWindow.innerTop + Commands.Windows.Window.OFFSET * 1.5f);
            children[4].Position = new(nsProgress.Size.X / 2 + nsWindow.innerLeft + Commands.Windows.Window.OFFSET, nsProgress.Size.Y / 2 + placeholder.Size.Y + Commands.Windows.Window.OFFSET * 2);
            i.Set("id", id);
            ProgressWindows[id] = i;
            return i;
        }
        public static Instance UpdateProgress(string id, string title, string content, float _max, float _value)
        {
            NineSlice? nsWindow = Resource.NineSlices["window/window"];
            Sprite? nsProgress = Resource.Sprites["window/progress"];
            float sizeX = nsProgress.Size.X + 256 + Commands.Windows.Window.OFFSET + 8;
            Instance i;
            if (ProgressWindows.ContainsKey(id)) i = ProgressWindows[id];
            else i = New(Game.Room.Camera.XY(), title, content, id);
            i.Set("value", _value);
            i.Set("maxvalue", _max);
            Text value = Text.Compile(_value.ToString() + "/" + _max.ToString(), "arcaoblique", 26, sizeX, Vector2.Zero, ColorP.BLACK);
            var children = i.Get<Instance[]>("children");
            // reposition & retext
            children[3].Position = new(nsProgress.Size.X * (-0.5f + _value / _max / 2), children[2].Position.Y);
            children[3].Set("size", new Vector2(nsProgress.Size.X * _value / _max, 38));
            children[4].Sprite = value;
            return i;
        }

        public override void OnInit(ref Instance self)
        {
            base.OnInit(ref self);
            self.Depth = 9999;
        }

        public override void OnDestroy(ref Instance self)
        {
            base.OnDestroy(ref self);
            ProgressWindows.Remove(self.Get<string>("id"));
        }
    }
}
