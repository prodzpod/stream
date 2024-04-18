using Microsoft.Xna.Framework;
using NotGMS.Util;
using ProdModel.Object;
using System.Diagnostics;
using System.Linq;

namespace ProdModel.Gizmo
{
    public class Screens
    {
        public static void AddStartingSoon()
        {
            new Object.Object("startingsoon").AddChild(new ImageSprite("Content/layout/startingsoon")).SetBoundingBoxes(0).SetPosition(0, 0).SetDepth(-1);
        }

        public static void AddBRB()
        {
            var brb = new Object.Object("brb"); brb
                .AddChild(new ImageSprite("Content/layout/brbbg"))
                .AddChild(new ImageSprite("Content/layout/brb"))
                .AddChild(new AnimationSprite(brb, "Content/sprites/raidboss", 9, 0), 350, 0)
                .SetBoundingBoxes(1).SetPosition(0, 0).SetDepth(-1);
            ((AnimationSprite)brb.Children[2].Sprite).onAnimationLoop += (self, parent) =>
            {
                self.Textures = self.Textures.Reverse().ToArray();
                self.Frame = 0;
                self.Speed = 0;
            };
            brb.onUpdate += (self, time) =>
            {
                if (self.Statetime > 10)
                {
                    self.Statetime -= 10;
                    ((AnimationSprite)self.Children[2].Sprite).Speed = 8f;
                }
                Object.Object.Drawable child = self.Children[0];
                child.BoundingBox.Y += ((float)time.ElapsedGameTime.TotalSeconds) * 100;
                if (child.BoundingBox.Y > 32) child.BoundingBox.Y -= 64;
                self.Children[0] = child;
                if (MathP.Random(0f, 1f) < ((float)time.ElapsedGameTime.TotalSeconds) * 4) Chat.AddPointer("click", new(MathP.Random(1058 - 256, 1561 + 256), MathP.Random(1, ProdModel.SCREEN_HEIGHT - 1)), new(MathP.Random(1058, 1561), MathP.Random(254, 825)), new Color(MathP.Random(255), MathP.Random(255), MathP.Random(255)), "");
            };
        }
        public static void AddExplosion()
        {
            var o = new Object.Object("explosion"); o
                .AddChild(new AnimationSprite(o, "Content/sprites/explosion", 17, 20))
                .SetBoundingBoxes(0).SetPosition(-1, -1).SetDepth(120);
            ((AnimationSprite)o.Children[0].Sprite).onAnimationLoop += (self, parent) => parent.OnDestroy();
        }
    }
}
