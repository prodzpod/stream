using Gizmo.Engine;
using Gizmo.Engine.Data;
using ProdModel.Object.Sprite;
using System.Numerics;

namespace ProdModel.Puppet
{
    public static class ModelHandler
    {
        public static WorseVRM ModelWVRM;
        public static string Pose = "IDLE";
        public static float Time = 0;
        public static TrackingData TrackingData;
        public static int[] EyeSinceLastOne = { 0, 0 };

        public static Vector3 aEuler = Vector3.Zero;
        public static Vector3 aTranslation = Vector3.Zero;

        public static bool useSecondaryModel = false;
        public static void HandleTracker(string raw)
        {
            TrackingData = new(raw);
            // ProdModel.Log("Model Data Recieved:", TrackingData);
            if (TrackingData.Blink[0] == 1) EyeSinceLastOne[0] = 0; else EyeSinceLastOne[0]++;
            if (TrackingData.Blink[1] == 1) EyeSinceLastOne[1] = 0; else EyeSinceLastOne[1]++;
            if (TrackingData.Blink[0] < 0.75f) EyeSinceLastOne[0] = 10;
            if (TrackingData.Blink[1] < 0.75f) EyeSinceLastOne[1] = 10;
            // if (EyeSinceLastOne[0] >= 10) { TrackingData.Blink[0] = RandomP.Random(0.5f, 1f); TrackingData.Euler += aEuler; if (RandomP.Random() < .01f) aEuler = new Vector3(RandomP.Random(-70f, 70f), RandomP.Random(-70f, 70f), RandomP.Random(-70f, 70f)); }
            // if (EyeSinceLastOne[1] >= 10) { TrackingData.Blink[1] = RandomP.Random(0.5f, 1f); TrackingData.Translation += aTranslation; if (RandomP.Random() < .01f) aTranslation = new Vector3(RandomP.Random(-.4f, .4f), RandomP.Random(-.4f, .4f), RandomP.Random(-.4f, .4f)); }
            ModelSprite.Draw();
        }

        public static string GetExpression(WorseVRM wvrm, int index, string pose, float time)
        {
            // quirky stuff here
            switch (index)
            {
                case 0: // eyes
                case 1:
                    if (EyeSinceLastOne[index] < 10) return "0";
                    if (useSecondaryModel) return TrackingData.Blink[index] > 0.6f ? "1" : "x";
                    if (TrackingData.Blink[index] > 0.9f) return "1";
                    if (TrackingData.Blink[index] > 0.7f) return "3";
                    if (TrackingData.Blink[index] > 0.6f) return "4";
                    return "x";
                case 2: // mouths
                    return TrackingData.Mouth.X < 0 ? "0" : "1";
            }
            return "0";
        }
        public static void SetPose(ref WorseVRM wvrm, string id, ref Vector3 translate, ref Vector3 rotate, ref Vector3 scale)
        {
            // quirky stuff here
            Vector3 rotation = TrackingData.Euler - new Vector3(165, -32, 103 + (2 * TrackingData.Euler.Y / 9f));
            switch (id)
            {
                case "body":
                    translate += (TrackingData.Translation.ZXY() - new Vector3(-3f, 1.5f, 0.3f)) * new Vector3(0.1f, 0.1f, 0.1f);
                    rotate.Y += rotation.Y * 0.3f;
                    rotate.X += rotation.X * 0.75f;
                    if (useSecondaryModel)
                    {
                        translate.Y += .15f;
                        rotate.Z -= .1f;
                    }
                    break;
                case "skirt_default":
                    rotate.Y -= rotation.Y * 0.3f;
                    rotate.X -= rotation.X * 0.75f;
                    break;
                case "ribbon":
                    rotate.Y += rotation.Y * 0.3f;
                    break;
                case "head":
                    rotate.Z += rotation.Z;
                    rotate.Y += rotation.Y * 0.7f;
                    break;
            }
        }

        // ProdModel.Log(string.Join(' ', b.Select(x => ((int)x).ToString("X"))));
    }
}
