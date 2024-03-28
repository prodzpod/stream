using Microsoft.Xna.Framework;
using System;

namespace ProdModel.Model
{
    public struct TrackingData
    {
        double Time;
        float[] Blink = new float[2];
        Vector4 Quaternion;
        Vector3 Euler;
        Vector3 Translation;
        Vector3[] Eyebrow = new Vector3[2];
        Vector2 Mouth;

        public TrackingData(string data) : this(Convert.FromBase64String(data)) { }
        public TrackingData(byte[] data)
        {
            Time = BitConverter.ToDouble(data, 0);
            int ptr = 8;
            float single() { float ret = BitConverter.ToSingle(data, ptr); ptr += 4; return ret; }
            Blink[0] = single(); Blink[1] = single();
            Quaternion = new(single(), single(), single(), single());
            Euler = new(single(), single(), single());
            Translation = new(single(), single(), single());
            Eyebrow[0] = new(single(), single(), single());
            Eyebrow[1] = new(single(), single(), single());
            Mouth = new(single(), single());
        }

        public override string ToString()
        {
            return string.Format("{0}: xyz({1}, {2}, {3}) theta({4}, {5}, {6}) eye({7}, {8}, {9}, {10} / {11}, {12}, {13}, {14}) mouth({15}, {16})"
                , Time, Translation.X, Translation.Y, Translation.Z, Euler.X, Euler.Y, Euler.Z
                , Blink[0], Eyebrow[0].X, Eyebrow[0].Y, Eyebrow[0].Z, Blink[1], Eyebrow[1].X, Eyebrow[1].Y, Eyebrow[1].Z
                , Mouth.X, Mouth.Y);
        }
    }
}
