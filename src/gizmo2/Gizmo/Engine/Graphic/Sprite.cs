using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using PInvoke;
using Raylib_CSharp.Rendering;
using Raylib_CSharp.Textures;
using System.Numerics;

namespace Gizmo.Engine.Graphic
{
    public class Sprite : IDrawable
    {
        public Texture2D? Image;
        public Vector2 Size;
        public Vector2 Subimages;
        public float DefaultDepth = 0;
        public static Sprite? Load(string path, int width, int height)
        {
            var image = Texture2D.Load(path);
            return new() {
                Image = image,
                Size = new(image.Width / width, image.Height / height),
                Subimages = new(width, height),
            };
        }
        public virtual int GetSubimageCount() => ((int)Subimages.X * (int)Subimages.Y);
        public virtual Vector2 GetSubimage(float i) => GetSubimage((int)i);
        public virtual Vector2 GetSubimage(int i) => new(i % Subimages.X, (int)(i / Subimages.X) % Subimages.Y);
        public Vector4 GetRectangle(int i) => GetRectangle(GetSubimage(i));
        public Vector4 GetRectangle(int x, int y) => GetRectangle(new Vector2(x, y));
        public virtual Vector4 GetRectangle(Vector2 v)
        {
            v.X = v.X % Subimages.X;
            v.Y = v.Y % Subimages.Y;
            return new(v.X * Size.X, v.Y * Size.Y, Size.X, Size.Y);
        }

        public void Draw(Instance i) => Draw(i.Frame, i.Position, i.Scale, i.Angle, i.Blend * i.Alpha);
        public void Draw(float frame, Vector2 _pos, Vector2 _size, float angle, ColorP color)
        {
            if (Image == null || !TryCameraWarp(_pos, _size * Size, angle, out Vector4 data)) return;
            var frameOffset = Size * GetSubimage(frame);
            Raylib_CSharp.Transformations.Rectangle source = new(frameOffset.X, frameOffset.Y, Size.X, Size.Y);
            Raylib_CSharp.Transformations.Rectangle target = new(data.X, data.Y, data.Z, data.W);
            if (target.Width < 0) { source.Width *= -1; target.Width *= -1; }
            if (target.Height < 0) { source.Height *= -1; target.Height *= -1; }
            Graphics.DrawTexturePro((Texture2D)Image, source, target, new Vector2(target.Width / 2, target.Height / 2), angle, color);
        }

        public static bool TryCameraWarp(Vector2 position, Vector2 scale, out Vector4 ret) => TryCameraWarp(position, scale, 0, out ret);
        public static bool TryCameraWarp(Vector2 position, Vector2 scale, float angle, out Vector4 ret)
        {
            ret = default;
            if (Game.Room == null) return false;
            Vector2 cameraPosition = Game.Room.Camera.XY();
            Vector2 cameraScale = Game.Room.Camera.ZW();
            position += cameraPosition - (Game.Resolution / 2);
            if (!IsInFrame(new(cameraPosition.X, cameraPosition.Y, cameraScale.X, cameraScale.Y), position, scale, angle)) return false;
            Vector2 resMultiplier = Game.Resolution / cameraScale;
            position *= resMultiplier; 
            scale *= resMultiplier;
            ret = new Vector4(position.X, position.Y, scale.X, scale.Y);
            return true;
        }

        public static bool IsInFrame(Vector4 bound, Vector2 pos, Vector2 scale, float angle = 0)
            => HitboxP.Check(new AABBHitbox(bound.XY(), bound.ZW()), new RectangleHitbox(pos, scale, angle));

        public ColorP[][] ToBitmap()
        {
            if (Image == null) return [];
            Raylib_CSharp.Images.Image i = Raylib_CSharp.Images.Image.LoadFromTexture((Texture2D)Image);
            List<ColorP[]> ret = [];
            for (int x = 0; x < i.Width; x++)
            {
                List<ColorP> row = [];
                for (int y = 0; y < i.Height; y++) row.Add(new(i.GetColor(x, y)));
                ret.Add([..row]);
            }
            i.Unload();
            return [..ret];
        }

        public static Sprite FromBitmap(ColorP[][] data)
        {
            int width = data.Length; int height = data[0].Length;
            Raylib_CSharp.Images.Image i = Raylib_CSharp.Images.Image.GenColor(width, height, ColorP.TRANSPARENT);
            for (int x = 0; x < i.Width; x++) for (int y = 0; y < i.Height; y++)
                i.DrawPixel(x, y, data[x][y]);
            Texture2D t = Texture2D.LoadFromImage(i);
            i.Unload();
            return new Sprite()
            {
                Image = t,
                Size = new(width, height),
                Subimages = Vector2.One
            };
        }
    }
}
