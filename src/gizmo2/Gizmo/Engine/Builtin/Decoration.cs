using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Raylib_CSharp.Rendering;
using Raylib_CSharp.Textures;
using Raylib_CSharp.Transformations;
using System.Numerics;

namespace Gizmo.Engine.Builtin
{
    public class Decoration : Element
    {
        public override void OnUpdate(ref Instance self, float deltaTime) { }
        public override void OnDraw(ref Instance self, float deltaTime)
        {
            int[][] frames = self.Get<int[][]>("frames");
            if (frames == default) return;
            var sprite = self.Sprite as Sprite;
            for (int y = 0; y < frames.Length; y++) for (int x = 0; x < frames[y].Length; x++)
            {
                var frame = frames[x][y];
                if (frame < 0) continue;
                Vector2 source = sprite.Size * sprite.GetSubimage(frame);
                Vector2 target = sprite.Size * self.Scale * new Vector2(x, y) + self.Position;
                Graphics.DrawTexturePro((Texture2D)sprite.Image, new Rectangle(source.X, source.Y, sprite.Size.X, sprite.Size.Y), new Rectangle(target.X, target.Y, sprite.Size.X * self.Scale.X, sprite.Size.Y * self.Scale.Y), Vector2.Zero, 0, self.Blend * self.Alpha);
            }
        }
        public static Instance New(string spr, params int[][] frames) => New(Resource.Sprites[spr], Vector2.Zero, frames);
        public static Instance New(Sprite spr, params int[][] frames) => New(spr, Vector2.Zero, frames);
        public static Instance New(string spr, Vector2 pos, params int[][] frames) => New(Resource.Sprites[spr], pos, frames);
        public static Instance New(Sprite spr, Vector2 pos, params int[][] frames)
        {
            var ret = Instance.New(nameof(Decoration), pos);
            ret.Sprite = spr;
            ret.Depth = spr.DefaultDepth;
            ret.Set("frames", frames);
            return ret;
        }
    }
}
