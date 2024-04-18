using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using NotGMS.Util;
using ProdModel.Gizmo;
using ProdModel.Puppet;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace ProdModel.Object
{
    public class ModelSprite : ISprite
    {
        public const int Pixels = 4;
        public const int Width = 200;
        public const int Height = 200;
        public static Graphics graphic;
        public static int TriangleRemoved = 0;

        public static bool ShowModel = true;
        public static Bitmap image;
        public static Texture2D Texture = null;
        public static Dictionary<Vector4, System.Drawing.Color> Palette = new()
        {

        }; // set custom palette here
        public static void Init()
        {
            image = new Bitmap(Width, Height);
            graphic = Graphics.FromImage(image);
        }

        public static void DrawTriangles(List<Triangle> triangles)
        {
            /*
            Debug.WriteLine("Triangles");
            Debug.WriteLine(string.Join("\n", triangles.Select(x => x.ToString())));
            */
            // populate
            Vector4 trans = new(255, 0, 255, 0);
            Vector4 black = new(0, 0, 0, 255);
            float[][] z = new float[Width][];
            for (int i = 0; i < z.Length; i++) z[i] = new float[Height];
            for (int i = 0; i < z.Length; i++) Array.Fill(z[i], float.NegativeInfinity);
            Vector4[][] pixels = new Vector4[Width][];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = new Vector4[Height];
            for (int i = 0; i < pixels.Length; i++) Array.Fill(pixels[i], trans);
            // buffer
            for (int i = 0; i < triangles.Count; i++)
            {
                // used to be premature optimization but turned out to be a good call
                Triangle triangle = triangles[i];
                int xa = Math.Clamp((int)MathP.Min(triangle.a.X, triangle.b.X, triangle.c.X) , 0, Width);
                int xb = Math.Clamp((int)MathP.Max(triangle.a.X, triangle.b.X, triangle.c.X) + 1, 0, Width);
                int ya = Math.Clamp((int)MathP.Min(triangle.a.Y, triangle.b.Y, triangle.c.Y) , 0, Height);
                int yb = Math.Clamp((int)MathP.Max(triangle.a.Y, triangle.b.Y, triangle.c.Y) + 1, 0, Height);
                for (int x = xa; x < xb; x++) for (int y = ya; y < yb; y++)
                {
                    var _z = triangle.ZAt(new Vector2(x, y));
                    if (_z > z[x][y]) { z[x][y] = _z; pixels[x][y] = triangle.color; };
                }
            }
            // outline 
            const float OUTLINE_DEPTH = .15f;
            for (int x = 0; x < Width; x++) for (int y = 0; y < Height; y++) {
                if (((x > 0)            && (z[x - 1][y] - z[x][y] > OUTLINE_DEPTH)) ||
                    ((x < (Width - 1))  && (z[x + 1][y] - z[x][y] > OUTLINE_DEPTH)) ||
                    ((y > 0)            && (z[x][y - 1] - z[x][y] > OUTLINE_DEPTH)) ||
                    ((y < (Height - 1)) && (z[x][y + 1] - z[x][y] > OUTLINE_DEPTH))) 
                        pixels[x][y] = black;
            }
            for (int x = 0; x < Width; x++) for (int y = 0; y < Height; y++) {
                if (!Palette.ContainsKey(pixels[x][y])) Palette[pixels[x][y]] = System.Drawing.Color.FromArgb((int)pixels[x][y].W, (int)pixels[x][y].X, (int)pixels[x][y].Y, (int)pixels[x][y].Z);
                image.SetPixel(x, y, Palette[pixels[x][y]]);
            }
        }
        public static Triangle[] GetTriangles(WorseVRM.Model model) => model.f.Select(x => new Triangle()
            {
                a = model.v[(int)x.X],
                b = model.v[(int)x.Y],
                c = model.v[(int)x.Z],
                color = model.color
            }).ToArray();

        public static void Transform(ref WorseVRM wvrm, string id, Vector3 translate, Vector3 _rotate)
        {
            List<string> names = GetAllChildrenAndItself(wvrm, id);
            Vector3 rotate = CollectionP.Map(_rotate, MathP.RadToDeg).ZYX();
            if (translate != Vector3.Zero) foreach (string name in names)
            {
                var m = wvrm.model[name];
                m.pivot += translate;
                m.v = m.v.Select(x => x + translate).ToList();
                wvrm.model[name] = m;
            }
            Vector3 pivot = wvrm.model[id].pivot;
            if (rotate != Vector3.Zero) foreach (string name in names)
            {
                var m = wvrm.model[name];
                m.pivot = MathP.Rotate(m.pivot, pivot, rotate);
                m.v = m.v.Select(x => MathP.Rotate(x, pivot, rotate)).ToList();
                wvrm.model[name] = m;
            }
        }

        public static List<string> GetAllChildrenAndItself(WorseVRM wvrm, string id)
        {
            if (!wvrm.model.ContainsKey(id)) return new();
            List<string> ret = new() { id };
            List<string> queue = new() { id };
            while (queue.Count > 0)
            {
                if (!wvrm.model.ContainsKey(queue[0])) ret.Remove(queue[0]);
                else
                {
                    ret.AddRange(wvrm.model[queue[0]].children);
                    queue.AddRange(wvrm.model[queue[0]].children);
                }
                queue.RemoveAt(0);
            }
            return ret;
        }

        public static void Draw()
        {
            // clear board
            Texture?.Dispose();
            graphic.Clear(System.Drawing.Color.Magenta);
            WorseVRM wvrm = new(ModelHandler.ModelWVRM);

            // exclude non-participating accessories and expressions
            foreach (var k in wvrm.accessories.Except(wvrm.poses[ModelHandler.Pose].accessories))
                foreach (var c in GetAllChildrenAndItself(wvrm, k))
                    wvrm.model.Remove(c);
            List<string> expressions = wvrm.poses[ModelHandler.Pose].expression.Select((x, i) => x ?? ModelHandler.GetExpression(wvrm, i, ModelHandler.Pose, ModelHandler.Time)).ToList();
            for (var i = 0; i < wvrm.expressions.Count; i++)
            {
                wvrm.expressions[i].Remove(expressions[i]);
                foreach (var k in wvrm.expressions[i])
                    foreach (var c in GetAllChildrenAndItself(wvrm, i + "_" + k))
                        wvrm.model.Remove(c);
            }

            // get pose objects to reference
            float prevPose = -1;
            float nextPose = -1;
            float lerpPose = 0;
            if (wvrm.poses[ModelHandler.Pose].time > 0)
            {
                float perc = ModelHandler.Time % wvrm.poses[ModelHandler.Pose].time / wvrm.poses[ModelHandler.Pose].time;
                var _tempPrev = wvrm.poses[ModelHandler.Pose].pose.Keys.Where(x => x <= perc);
                prevPose = !_tempPrev.Any() ? -1 : _tempPrev.Max();
                var _tempNext = wvrm.poses[ModelHandler.Pose].pose.Keys.Where(x => x > perc);
                nextPose = !_tempNext.Any() ? -1 : _tempNext.Min();
                var xp = prevPose == -1 ? 0 : prevPose;
                var xn = nextPose == -1 ? 1 : nextPose;
                if (prevPose != nextPose)
                {
                    var p = (perc - xp) / (xn - xp);
                    lerpPose = EaseP.OutSine()(0, 1, p);
                }
            }

            // ** R E C U R S I V E ** T R A N S F O R M A T I O N **
            List<string> queue = new() { wvrm.root };
            while (queue.Count > 0)
            {
                if (wvrm.model.ContainsKey(queue[0]))
                {
                    Vector3 transform = Vector3.Zero;
                    Vector3 rotateA = Vector3.Zero;
                    Vector3 rotateB = Vector3.Zero;
                    wvrm.poses[ModelHandler.Pose].pose[prevPose].TryGetValue(queue[0], out rotateA);
                    wvrm.poses[ModelHandler.Pose].pose[nextPose].TryGetValue(queue[0], out rotateB);
                    Vector3 rotate = MathP.Lerp(rotateA, rotateB, lerpPose);
                    ModelHandler.SetPose(ref wvrm, queue[0], ref transform, ref rotate);
                    Transform(ref wvrm, queue[0], transform, rotate);
                    queue.AddRange(wvrm.model[queue[0]].children);
                }
                queue.RemoveAt(0);
            }

            // project from [-1, 1]^3 to [0, Width][0, Height][-1, 1], also bump camera up a little
            foreach (var k in wvrm.model.Keys)
            {
                var model = wvrm.model[k];
                model.color *= 255;
                model.v = model.v.Select(x =>
                {
                    x.X = (x.X * Width / 2) + (Width / 2);
                    x.Y = -(x.Y * Height / 2) + (Height * 0.75f);
                    return x;
                }).ToList();
                wvrm.model[k] = model;
            }

            // draw triangles
            List<Triangle> triangles = new();
            foreach (var k in wvrm.model.Keys) triangles.AddRange(GetTriangles(wvrm.model[k]));
            if (TriangleRemoved >= triangles.Count)
            {
                TriangleRemoved = 0;
                Object.OBJECTS.Find(x => x.Name == "_prod").SetState("CALM");
                Screens.AddExplosion();
            }
            else if (TriangleRemoved > 0) // something about yates
            {
                Triangle[] trisArr = triangles.ToArray();
                for (int i = trisArr.Length - 1; i > 0; i--)
                {
                    int k = MathP.Random(0, i);
                    (trisArr[i], trisArr[k]) = (trisArr[k], trisArr[i]);
                }
                triangles = trisArr[0..(triangles.Count - TriangleRemoved)].ToList();
            }
            DrawTriangles(triangles);

            // render onto spritebatch
            var ms = new MemoryStream();
            image.Save(ms, ImageFormat.Png);
            Texture = Texture2D.FromStream(ProdModel.Instance._graphics.GraphicsDevice, ms);
        }
        public void Render(Vector4 position, float rotation)
        {
            if (!ShowModel) return;
            // Draw(); // test: on prod only call when redraw is needed
            if (Texture != null) ProdModel.Instance._spriteBatch.Draw(Texture, position.XY(), null, Microsoft.Xna.Framework.Color.White, 0, new Vector2(Texture.Width, Texture.Height) / 2, Pixels, SpriteEffects.None, 0);
        }

        public Vector2 GetBoundingBox()
        {
            return Vector2.Zero;
        }
    }

    public struct Triangle
    {
        public Vector3 a;
        public Vector3 b;
        public Vector3 c;
        public Vector4 color;
        public override string ToString()
        {
            return string.Format("Triangle ({9}) [{0}, {1}, {2}], [{3}, {4}, {5}], [{6}, {7}, {8}]", a.X, a.Y, a.Z, b.X, b.Y, b.Z, c.X, c.Y, c.Z, ColorP.Hex(color));
        }

        public float ZAt(Vector2 position)
        {
            Vector2 o = a.XY();
            Vector2 pxy = position - o;
            Vector2 uxy = b.XY() - o;
            Vector2 vxy = c.XY() - o;
            if ((uxy.X == 0 && uxy.Y == 0) || (vxy.X == 0 && vxy.Y == 0) || (uxy.X == 0 && vxy.X == 0) || (uxy.Y == 0 && vxy.Y == 0)) return float.NegativeInfinity;
            // float fu = Vector2.Distance(uxy, Vector2.Zero);
            // float fv = Vector2.Distance(vxy, Vector2.Zero);
            float qx = vxy.X == 0 ? (pxy.X / uxy.X) : ((pxy.X * vxy.Y / vxy.X - pxy.Y) / (uxy.X * vxy.Y / vxy.X - uxy.Y));
            float qy = uxy.Y == 0 ? (pxy.Y / vxy.Y) : ((pxy.Y * uxy.X / uxy.Y - pxy.X) / (vxy.Y * uxy.X / uxy.Y - vxy.X));
            if (MathP.Between(0, qx, 1) && 
                MathP.Between(0, qy, 1) && 
                MathP.Between(0, qx + qy, 1)) 
                return (1 - qx - qy) * a.Z + (qx * b.Z) + (qy * c.Z);
            return float.NegativeInfinity;
        }
    }
}
