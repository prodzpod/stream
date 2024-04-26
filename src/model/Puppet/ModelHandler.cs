using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using NotGMS.Util;
using ProdModel.Object.Sprite;
using System.Collections.Generic;

namespace ProdModel.Puppet
{
    public static class ModelHandler
    {
        public static WorseVRM ModelWVRM;
        public static string Pose = "IDLE";
        public static float Time = 0;
        public static TrackingData TrackingData;
        public static int[] EyeSinceLastOne = { 0, 0 };
        public static void HandleTracker(string raw)
        {
            TrackingData = new(raw);
            // ProdModel.Log("Model Data Recieved:", TrackingData);
            if (TrackingData.Blink[0] == 1) EyeSinceLastOne[0] = 0; else EyeSinceLastOne[0]++;
            if (TrackingData.Blink[1] == 1) EyeSinceLastOne[1] = 0; else EyeSinceLastOne[1]++;
            if (TrackingData.Blink[0] < 0.75f) EyeSinceLastOne[0] = 10;
            if (TrackingData.Blink[1] < 0.75f) EyeSinceLastOne[1] = 10;
            if (ModelSprite.ShowModel) ModelSprite.Draw();
        }

        public static string GetExpression(WorseVRM wvrm, int index, string pose, float time)
        {
            // quirky stuff here
            switch (index)
            {
                case 0: // eyes
                case 1:
                    if (EyeSinceLastOne[index] < 10) return "0";
                    if (TrackingData.Blink[index] > 0.95f) return "1";
                    if (TrackingData.Blink[index] > 0.85f) return "3";
                    if (TrackingData.Blink[index] > 0.6f) return "4";
                    return "x";
                case 2: // mouths
                    return TrackingData.Mouth.X < 0 ? "0" : "1";
            }
            return "0";
        }

        public static void SetPose(ref WorseVRM wvrm, string id, ref Vector3 translate, ref Vector3 rotate)
        {
            // quirky stuff here
            Vector3 rotation = TrackingData.Euler - new Vector3(165, -32, 103 + (2 * TrackingData.Euler.Y / 9f));
            switch (id)
            {
                case "body":
                    translate += (TrackingData.Translation.ZXY() - new Vector3(-3f, 1.5f, 0.3f)) * new Vector3(0.1f, 0.1f, 0.1f);
                    rotate.Y += MathP.DegToRad(rotation.Y * 0.3f);
                    rotate.Z += MathP.DegToRad(rotation.Z * 0.75f);
                    break;
                case "ribbon":
                    rotate.Y += MathP.DegToRad(rotation.Y * 0.3f);
                    break;
                case "head":
                    rotate.X += MathP.DegToRad(rotation.X);
                    rotate.Y += MathP.DegToRad(rotation.Y * 0.7f);
                    break;
            }
        }

        public static List<Texture2D> Prod2D = new();
        public static void InitTextures()
        {
            for (int i = 1; i <= 5; i++) Prod2D.Add(Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath("Content/sprites/prod" + i + ".png")));
        }

        // Debug.WriteLine(string.Join(' ', b.Select(x => ((int)x).ToString("X"))));
    }
}
