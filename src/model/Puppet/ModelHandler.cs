using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using NotGMS.Util;
using ProdModel.Object;
using System.Collections.Generic;
using System.Diagnostics;

namespace ProdModel.Puppet
{
    public static class ModelHandler
    {
        public static WorseVRM ModelWVRM;
        public static string Pose = "IDLE";
        public static float Time = 0;
        public static TrackingData TrackingData;
        public static void HandleTracker(string raw)
        {
            TrackingData = new(raw);
            // ProdModel.Log("Model Data Recieved:", TrackingData);
            if (ModelSprite.ShowModel) ModelSprite.Draw();
        }

        public static string GetExpression(WorseVRM wvrm, int index, string pose, float time)
        {
            // quirky stuff here
            switch (index)
            {
                case 0: // eyes
                case 1:
                    if (TrackingData.Blink[index] == 1) return "0";
                    if (TrackingData.Blink[index] > 0.9f) return "2";
                    if (TrackingData.Blink[index] > 0.7f) return "4";
                    if (TrackingData.Blink[index] > 0.5f) return "5";
                    return "6";
                case 2: // mouths
                    return TrackingData.Mouth.Y > 0 ? "0" : "1";
            }
            return "0";
        }

        public static void SetPose(ref WorseVRM wvrm, string id, ref Vector3 translate, ref Vector3 rotate)
        {
            // quirky stuff here
            switch (id)
            {
                case "body":
                    translate += (TrackingData.Translation.ZXY() - new Vector3(-3f, 0.3f, 0.3f)) * new Vector3(0.1f, 0.1f, 0.1f);
                    rotate.Z += MathP.DegToRad(TrackingData.Euler.Z - 100);
                    break;
                case "head":
                    rotate.X += MathP.DegToRad(TrackingData.Euler.X + 200);
                    rotate.Y += MathP.DegToRad(TrackingData.Euler.Y + 30);
                    break;
            }
        }

        public static List<Texture2D> Explosions = new();
        public static List<Texture2D> Prod2D = new();
        public static void InitTextures()
        {
            for (int i = 1; i <= 17; i++) Explosions.Add(Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath("Content/sprites/explosion" + i + ".png")));
            for (int i = 1; i <= 5; i++) Prod2D.Add(Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath("Content/sprites/prod" + i + ".png")));
        }

        public static void AddExplosion()
        {
            var prod = Object.Object.OBJECTS.Find(x => x.Name == "_prod");
            var o = new Object.Object("explosion")
                .AddChild(new ImageSprite(Explosions[0]))
                .SetBoundingBoxes(0).SetPosition(-1, -1).SetDepth(120);
            o.onUpdate += (self, time) =>
            {
                var frame = self.Statetime / 0.05f;
                if (frame >= 17) self.OnDestroy();
                else ((ImageSprite)self.Children[0].Sprite).Texture = Explosions[(int)frame];
            };
        }

        // Debug.WriteLine(string.Join(' ', b.Select(x => ((int)x).ToString("X"))));
    }
}
