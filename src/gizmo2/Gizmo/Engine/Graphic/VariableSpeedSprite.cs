using Gizmo.Engine.Data;
using Raylib_CSharp.Textures;
using System.Numerics;

namespace Gizmo.Engine.Graphic
{
    public class VariableSpeedSprite: Sprite
    {
        public required float[] LoopTime;
        public float FullLoop;
        public static VariableSpeedSprite? Load(Texture2D texture, int width, int height, Dictionary<int, float> loopRange)
        {
            float inc = 0;
            List<float> loopTime = [];
            for (int i = 0; i < width * height; i++)
            {
                if (loopRange.ContainsKey(i)) inc = loopRange[i];
                loopTime.Add(inc);
            }
            return Load(texture, width, height, [..loopTime]);
        }
        public static VariableSpeedSprite? Load(Texture2D texture, int width, int height, float[] loopTime)
        {
            if (width == 0 || height == 0) return null;
            float[] ctime = new float[loopTime.Length];
            for (int i = 0; i < loopTime.Length; i++) ctime[i] = MathP.Sum(loopTime[..(i+1)]);
            return new()
            {
                Image = texture,
                Size = new(texture.Width / width, texture.Height / height),
                Subimages = new(width, height),
                LoopTime = ctime,
                FullLoop = MathP.Sum(loopTime)
            };
        }
        public override Vector2 GetSubimage(float i)
        {
            i = MathP.PosMod(i, FullLoop);
            var ret = LoopTime.ToList().FindIndex(x => i < x);
            return base.GetSubimage(ret);
        }
    }
}
