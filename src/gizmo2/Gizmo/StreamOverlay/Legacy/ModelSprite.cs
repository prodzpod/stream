﻿using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;
using Gizmo.StreamOverlay.Elements.Entities;
using ProdModel.Puppet;
using Raylib_CSharp.Images;
using System.Numerics;
using System.Xml.Linq;

namespace ProdModel.Object.Sprite
{
    public class ModelSprite
    {
        public static int Pixels = 4;
        public static int Width = 200;
        public static int Height = 200;
        public static Image image = Image.GenColor(Width, Height, ColorP.TRANSPARENT);
        public static int TriangleRemoved = 0;
        public static bool Busy = false;
        public static bool Ready = false;
        public static string[] accessories = ["earcloud", "skirt_default", "sparkle"];
        public static void DrawTriangles(List<Triangle> triangles)
        {
            /*
            ProdModel.Log("Triangles");
            ProdModel.Log(string.Join("\n", triangles.Select(x => x.ToString())));
            */
            // populate
            float[][] z = new float[Width][];
            for (int i = 0; i < z.Length; i++) z[i] = new float[Height];
            for (int i = 0; i < z.Length; i++) Array.Fill(z[i], float.NegativeInfinity);
            ColorP[][] pixels = new ColorP[Width][];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = new ColorP[Height];
            for (int i = 0; i < pixels.Length; i++) Array.Fill(pixels[i], ColorP.TRANSPARENT);
            // buffer
            for (int i = 0; i < triangles.Count; i++)
            {
                // used to be premature optimization but turned out to be a good call
                Triangle triangle = triangles[i];
                int xa = Math.Clamp((int)MathP.Min(triangle.a.X, triangle.b.X, triangle.c.X), 0, Width);
                int xb = Math.Clamp((int)MathP.Max(triangle.a.X, triangle.b.X, triangle.c.X) + 1, 0, Width);
                int ya = Math.Clamp((int)MathP.Min(triangle.a.Y, triangle.b.Y, triangle.c.Y), 0, Height);
                int yb = Math.Clamp((int)MathP.Max(triangle.a.Y, triangle.b.Y, triangle.c.Y) + 1, 0, Height);
                for (int x = xa; x < xb; x++) for (int y = ya; y < yb; y++)
                {
                    var _z = triangle.ZAt(new Vector2(x, y));
                    if (_z > z[x][y]) { z[x][y] = _z; pixels[x][y] = triangle.color; };
                }
            }
            // outline 
            const float OUTLINE_DEPTH = .1f;
            for (int x = 0; x < Width; x++) for (int y = 0; y < Height; y++)
            {
                if (x > 0 && z[x - 1][y] - z[x][y] > OUTLINE_DEPTH ||
                    x < Width - 1 && z[x + 1][y] - z[x][y] > OUTLINE_DEPTH ||
                    y > 0 && z[x][y - 1] - z[x][y] > OUTLINE_DEPTH ||
                    y < Height - 1 && z[x][y + 1] - z[x][y] > OUTLINE_DEPTH)
                    pixels[x][y] = ColorP.BLACK;
            }
            for (int x = 0; x < Width; x++) for (int y = 0; y < Height; y++)
            {
                // var hsv = pixels[x][y].HSV;
                // var color = ColorP.FromHSV(MathP.PosMod((x + y) * 2f / (Width + Height) * 360f - (15f * Game.Time), 360f), hsv.Y / 2, hsv.Z, pixels[x][y].A / 255f);
                image.DrawPixel(x, y, pixels[x][y] * MathP.Min(1, 6f - 6f * y / Height));
            }
        }
        public static Triangle[] GetTriangles(WorseVRM.Model model) => model.f.Select(x => new Triangle()
        {
            a = model.v[(int)x.X],
            b = model.v[(int)x.Y],
            c = model.v[(int)x.Z],
            color = model.color
        }).ToArray();
        public static Dictionary<string, MatrixP> matrices = [];
        public static void Transform(ref WorseVRM wvrm, string id, MatrixP m, MatrixP invert)
        {
            List<string> names = GetAllChildrenAndItself(wvrm, id);
            if (m != MatrixP.IDENTITY) foreach (string name in names)
            {
                var x = wvrm.model[name]; x.pivot *= m * invert; wvrm.model[name] = x;
                if (!matrices.ContainsKey(name)) matrices[name] = m * invert;
                else matrices[name] = m * matrices[name] * invert;
            }
        }

        public static List<string> GetAllChildrenAndItself(WorseVRM wvrm, string id)
        {
            if (!wvrm.model.ContainsKey(id)) return [];
            List<string> ret = [id];
            List<string> queue = [id];
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
        public static async void Draw() => await Task.Run(() =>
        {
            if (!Raylib_CSharp.Windowing.Window.IsReady()) return;
            if (Busy) { if (!Ready) Logger.Warn("Model Drawing is overloading!"); return; }
            Busy = true;
            // clear board
            // Prod.Prod3D.Image?.Unload();
            image.ClearBackground(ColorP.TRANSPARENT);
            WorseVRM wvrm = new(ModelHandler.ModelWVRM);
            string pose = wvrm.poses.ContainsKey(ModelHandler.Pose) ? ModelHandler.Pose : "DEFAULT";
            foreach (var k in wvrm.accessories.Except(accessories).Except(wvrm.poses[pose].accessories))
                foreach (var c in GetAllChildrenAndItself(wvrm, k))
                    wvrm.model.Remove(c);
            List<string> expressions = wvrm.poses[pose].expression.Select((x, i) => x ?? ModelHandler.GetExpression(wvrm, i, pose, ModelHandler.Time)).ToList();
            for (var i = 0; i < wvrm.expressions.Count; i++)
            {
                foreach (var k in wvrm.expressions[i]) if (k != expressions[i])
                    foreach (var c in GetAllChildrenAndItself(wvrm, i + "_" + k))
                        wvrm.model.Remove(c);
            }

            // get pose objects to reference
            float prevPose = -1;
            float nextPose = -1;
            float lerpPose = 0;
            if (wvrm.poses[pose].time > 0)
            {
                float perc = Game.Time % wvrm.poses[pose].time / wvrm.poses[pose].time;
                var _tempPrev = wvrm.poses[pose].pose.Keys.Where(x => x <= perc);
                prevPose = !_tempPrev.Any() ? -1 : _tempPrev.Max();
                var _tempNext = wvrm.poses[pose].pose.Keys.Where(x => x > perc);
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
            List<string> queue = [wvrm.root];
            matrices.Clear();
            // Logger.Log("-------------------");
            while (queue.Count > 0)
            {
                if (wvrm.model.ContainsKey(queue[0]))
                {
                    Vector3 rotateA = Vector3.Zero;
                    Vector3 rotateB = Vector3.Zero;
                    MatrixP target = MatrixP.IDENTITY;
                    if (wvrm.poses[pose].pose[prevPose].TryGetValue(queue[0], out rotateA)
                        || wvrm.poses[pose].pose[nextPose].TryGetValue(queue[0], out rotateB)) 
                        target = MatrixP.InverseRotateAround(wvrm.poses["DEFAULT"].pose[-1][queue[0]].Map(MathP.RadToDeg), wvrm.model[queue[0]].pivot);
                    Vector3 translate = Vector3.Zero;
                    Vector3 rotate = MathP.Lerp(rotateA, rotateB, lerpPose).Map(MathP.RadToDeg);
                    Vector3 scale = Vector3.One;
                    ModelHandler.SetPose(ref wvrm, queue[0], ref translate, ref rotate, ref scale);
                    if (queue[0] == "hand_right") rotate.X *= -1; // TODO: eh...
                    Transform(ref wvrm, queue[0], MatrixP.Translate(wvrm.model[queue[0]].pivot)
                        * MatrixP.Translate(translate)
                        * MatrixP.Scale(scale)
                        * MatrixP.Rotate(rotate)
                        * MatrixP.Translate(-wvrm.model[queue[0]].pivot), target);
                    // Logger.Log("Pre:", wvrm.model["hand_right"].pivot, wvrm.model["hand_right"].v[0], wvrm.model["hand_right"].v[0] * matrices["hand_right"]);
                    queue.AddRange(wvrm.model[queue[0]].children);
                }
                queue.RemoveAt(0);
            }
            foreach (var k in matrices) if (matrices.ContainsKey(k.Key)) {
                var m = wvrm.model[k.Key];
                // if (k.Key == "hand_right") Logger.Log("Transform: ", k.Key, m.v[0], m.v[0] * matrices[k.Key]);
                m.v = m.v.Select(x => x *= matrices[k.Key]).ToList();
                wvrm.model[k.Key] = m;
            }
            // project from [-1, 1]^3 to [0, Width][0, Height][-1, 1], also bump camera up a little
            foreach (var k in wvrm.model.Keys)
            {
                var model = wvrm.model[k];
                model.v = model.v.Select(x =>
                {
                    x.X = x.X * Width / 2 + Width / 2;
                    x.Y = -(x.Y * Height / 2) + Height * 0.75f;
                    return x;
                }).ToList();
                wvrm.model[k] = model;
            }

            // draw triangles
            List<Triangle> triangles = [];
            foreach (var k in wvrm.model.Keys) triangles.AddRange(GetTriangles(wvrm.model[k]));
            if (TriangleRemoved >= triangles.Count)
            {
                TriangleRemoved = 0;
                Prod.Is2D = true;
            }
            else if (TriangleRemoved > 0) // something about yates
            {
                Triangle[] trisArr = triangles.ToArray();
                for (int i = trisArr.Length - 1; i > 0; i--)
                {
                    int k = RandomP.Random(0, i);
                    (trisArr[i], trisArr[k]) = (trisArr[k], trisArr[i]);
                }
                triangles = [.. trisArr[0..(triangles.Count - TriangleRemoved)]];
            }
            DrawTriangles(triangles);
            Ready = true;
        });
    }

    public struct Triangle
    {
        public Vector3 a;
        public Vector3 b;
        public Vector3 c;
        public ColorP color;
        public override readonly string ToString()
        {
            return string.Format("Triangle ({9}) [{0}, {1}, {2}], [{3}, {4}, {5}], [{6}, {7}, {8}]", a.X, a.Y, a.Z, b.X, b.Y, b.Z, c.X, c.Y, c.Z, color);
        }

        public readonly float ZAt(Vector2 position)
        {
            Vector2 o = a.XY();
            Vector2 pxy = position - o;
            Vector2 uxy = b.XY() - o;
            Vector2 vxy = c.XY() - o;
            if (uxy.X == 0 && uxy.Y == 0 || vxy.X == 0 && vxy.Y == 0 || uxy.X == 0 && vxy.X == 0 || uxy.Y == 0 && vxy.Y == 0) return float.NegativeInfinity;
            // float fu = Vector2.Distance(uxy, Vector2.Zero);
            // float fv = Vector2.Distance(vxy, Vector2.Zero);
            float qx = vxy.X == 0 ? pxy.X / uxy.X : (pxy.X * vxy.Y / vxy.X - pxy.Y) / (uxy.X * vxy.Y / vxy.X - uxy.Y);
            float qy = uxy.Y == 0 ? pxy.Y / vxy.Y : (pxy.Y * uxy.X / uxy.Y - pxy.X) / (vxy.Y * uxy.X / uxy.Y - vxy.X);
            if (MathP.Between(0, qx, 1) &&
                MathP.Between(0, qy, 1) &&
                MathP.Between(0, qx + qy, 1))
                return (1 - qx - qy) * a.Z + qx * b.Z + qy * c.Z;
            return float.NegativeInfinity;
        }
    }
}