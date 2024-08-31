using Gizmo.Engine;
using Gizmo.Engine.Data;
using Raylib_CSharp.Rendering;
using System.Numerics;

namespace Gizmo.StreamOverlay
{
    public class GraphicsP
    {
        public static void DrawThickLine(Vector2 a, Vector2 b, ColorP color, float thickness)
        {
            Graphics.DrawCircleV(a, thickness / 2, color);
            var pos = (a + b) / 2;
            var size = new Vector2(MathP.Dist(a, b), thickness);
            Graphics.DrawRectanglePro(new(pos.X, pos.Y, size.X, size.Y), size / 2, MathP.Atan2(b - a), color);
            Graphics.DrawCircleV(b, thickness / 2, color);
        }
    }
}