using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using System.Numerics;

namespace Gizmo.Engine.Graphic
{
    public class NineSlice : IDrawable
    {
        public Sprite?[] Sprites = new Sprite?[9];
        public bool[] Stretchable = new bool[9];
        public Vector2 Loop = Vector2.Zero;
        public float innerLeft => Sprites[3]?.Size.X ?? 0;
        public float innerRight => Sprites[5]?.Size.X ?? 0;
        public float innerTop => Sprites[1]?.Size.Y ?? 0;
        public float innerBottom => Sprites[7]?.Size.Y ?? 0;
        public NineSlice() { Array.Fill(Sprites, null); Array.Fill(Stretchable, false); }
        public void Draw(Instance i)
        {
            var _scale = i.Scale;
            Vector2 size = i.Get<Vector2>("size");
            if (size.X == 0 || size.Y == 0) return;
            if (size.X < 0) _scale.X *= -1;
            if (size.Y < 0) _scale.Y *= -1;
            size = MathP.Abs(size);
            Vector2 lastSize = i.Get<Vector2>("_lastSize");
            List<DrawInfo>? previousDraw = i.Get<List<DrawInfo>>("_toDraw");
            List<DrawInfo> toDraw;
            void AddInfo(int ID, float x, float y, float szx, float szy, int fx = 0, int fy = 0)
            {
                Sprite? sprite = Sprites[ID];
                if (sprite == null) return;
                Random r = RandomP.GetRandom(i.ID);
                if (fx == 1 && RandomP.Random(2, r) == 1) szx *= -1;
                if (fy == 1 && RandomP.Random(2, r) == 1) szy *= -1;
                var rotate = false;
                if (fx == 1 && fy == 1 && sprite.Size.X == sprite.Size.Y) rotate = RandomP.Chance(.5, r);
                toDraw.Add(new()
                {
                    Sprite = sprite,
                    Subimage = RandomP.Random((int)sprite.Subimages.X * (int)sprite.Subimages.Y, r),
                    Position = new(x, y),
                    Size = new(szx / sprite.Size.X, szy / sprite.Size.Y),
                    Rotate = rotate ? 90 : 0
                });
            }
            if (size == lastSize && previousDraw != null) toDraw = previousDraw;
            else // build toDraw
            {
                RandomP.Reset(i.ID);
                toDraw = [];

                float outerLeft = -size.X / 2;
                float outerRight = size.X / 2;
                float outerTop = -size.Y / 2;
                float outerBottom = size.Y / 2;
                if (Loop == Vector2.One)
                {
                    AddInfo(0, outerLeft + innerLeft / 2, outerTop + innerTop / 2, innerLeft, innerTop);
                    AddInfo(2, outerRight - innerRight / 2, outerTop + innerTop / 2, innerRight, innerTop);
                    AddInfo(6, outerLeft + innerLeft / 2, outerBottom - innerBottom / 2, innerLeft, innerBottom);
                    AddInfo(8, outerRight - innerRight / 2, outerBottom - innerBottom / 2, innerRight, innerBottom);
                }
                if (Loop.X == 1)
                {
                    float top = outerTop + innerTop;
                    float bottom = outerBottom - innerBottom;
                    float y = (top + bottom) / 2;
                    float left = outerLeft + innerLeft / 2;
                    float right = outerRight - innerRight / 2;
                    if (bottom - top > 0)
                    {
                        if (Stretchable[3]) AddInfo(3, left, y, innerLeft, bottom - top);
                        else
                        {
                            float h = bottom - top;
                            var height = Sprites[3].Size.Y;
                            for (; h > height; h -= height)
                                AddInfo(3, left, top + h - height / 2, innerLeft, height, 0, 1);
                            AddInfo(3, left, top + h - height / 2, innerLeft, h, 0, 1);
                        }
                        if (Stretchable[5]) AddInfo(5, right, y, innerRight, bottom - top);
                        else
                        {
                            float h = bottom - top;
                            var height = Sprites[5].Size.Y;
                            for (; h > height; h -= height)
                                AddInfo(5, right, top + h - height / 2, innerRight, height, 0, 1);
                            AddInfo(5, right, top + h - height / 2, innerRight, h, 0, 1);
                        }
                    }
                }
                if (Loop.Y == 1)
                {
                    float left = outerLeft + innerLeft;
                    float right = outerRight - innerRight;
                    float x = (left + right) / 2;
                    float top = outerTop + innerTop / 2;
                    float bottom = outerBottom - innerBottom / 2;
                    if (right - left > 0)
                    {
                        if (Stretchable[1]) AddInfo(1, x, top, right - left, innerTop);
                        else
                        {
                            float w = right - left;
                            var width = Sprites[1].Size.X;
                            for (; w > width; w -= width)
                                AddInfo(1, left + w - width / 2, top / 2, width, innerTop, 1, 0);
                            AddInfo(1, left + w - width / 2, top / 2, w, innerTop, 1, 0);
                        }
                        if (Stretchable[7]) AddInfo(7, x, bottom, right - left, innerBottom);
                        else
                        {
                            float w = right - left;
                            var width = Sprites[7].Size.X;
                            for (; w > width; w -= width)
                                AddInfo(7, left + w - width / 2, bottom / 2, width, innerBottom, 1, 0);
                            AddInfo(7, left + w - width / 2, bottom / 2, w, innerBottom, 1, 0);
                        }
                    }
                }
                {
                    float left = outerLeft + innerLeft;
                    float right = outerRight - innerRight;
                    float top = outerTop + innerTop;
                    float bottom = outerBottom - innerBottom;
                    float x = (left + right) / 2;
                    float y = (top + bottom) / 2;
                    if (bottom - top > 0 && right - left > 0)
                    {
                        if (Stretchable[4]) AddInfo(4, x, y, right - left, bottom - top);
                        else
                        {
                            float w = right - left;
                            var width = Sprites[4].Size.X;
                            float h = bottom - top;
                            var height = Sprites[4].Size.Y;
                            for (; w > width; w -= width)
                            {
                                h = bottom - top;
                                for (; h > height; h -= height)
                                    AddInfo(4, left + w - width / 2, top + h - height / 2, width, height, 1, 1);
                                AddInfo(4, left + w - width / 2, top + h - height / 2, width, h, 1, 1);
                            }
                            h = bottom - top;
                            for (; h > height; h -= height)
                                AddInfo(4, left + w - width / 2, top + h - height / 2, w, height, 1, 1);
                            AddInfo(4, left + w - width / 2, top + h - height / 2, w, h, 1, 1);
                        }
                    }
                }
                i.Set("_toDraw", toDraw);
                i.Set("_lastSize", size);
            }
            // resolve toDraw
            foreach (var info in toDraw)
            {
                Vector2 pos = i.Position + MathP.Rotate(info.Position * i.Scale, i.Angle);
                Vector2 sz = info.Size * i.Scale;
                info.Sprite.Draw(info.Subimage, pos, sz, i.Angle + info.Rotate, i.Blend * i.Alpha);
            }
        }
        public class DrawInfo
        {
            public Sprite Sprite;
            public int Subimage;
            public Vector2 Position;
            public Vector2 Size;
            public int Rotate;
        }
    }
}
