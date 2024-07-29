using Gizmo.Engine.Data;
using System.Numerics;

namespace Gizmo.Engine.Builtin
{
    public class Mouse: Element, Persistent
    {
        public override IHitbox? Hitbox => new PointHitbox();
        public static Vector2 RealPosition;
        public static bool Left;
        public static bool Right;
        public static bool Middle;
        public static bool X;
        public static Vector2 WheelDelta;
        public override float Mass(Instance i) => -1;
    }
}
