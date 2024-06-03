using NotGMS.Util;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace ProdModel.Object.Audio
{
    public class Instrument
    {
        public List<Sample> samples = new();
        public Instrument(params Sample[] samples)
        {
            this.samples = samples.ToList();
            for (var i = 0; i < this.samples.Count; i++) { var s = this.samples[i]; this.samples[i] = s.Init(); }
        }
        public Instrument(Sample.TYPE type, params Sample[] samples)
        {
            this.samples = samples.ToList();
            for (var i = 0; i < this.samples.Count; i++) { var s = this.samples[i]; s.type = type; this.samples[i] = s.Init(); }
        }
        public Sample GetSample(float note) => samples.FindOr(x => MathP.Between(x.min, note, x.max), Sample.NONE);
        public void Play(float time, float pitch = 0, bool cutHead = false, bool cutFeet = false) => GetSample(pitch).Play(time, pitch, cutHead, cutFeet);
        public Vector3 GetDuration(float pitch = 0) { Sample sample = GetSample(pitch); return sample.duration * (float)Math.Pow(2, (pitch - sample.pitch) / 12); }
    }
    public struct Sample
    {
        public float min;
        public float max;
        public float pitch;
        public string path;
        public Vector3 duration;
        public TYPE type;
        public static Sample NONE = new();
        public enum TYPE
        {
            Normal,
            HeadOnly,
            BodyOnly,
            HeadAndBody,
            BodyAndFeet
        };

        public Sample(string path, TYPE type = TYPE.Normal) : this(-60, 60, 0, path, type) { }
        public Sample(float key, string path, TYPE type = TYPE.Normal) : this(key, key, key, path, type) { }
        public Sample(float min, float max, string path, TYPE type = TYPE.Normal) : this(min, max, MathF.Floor(((min + max) / 2f + 6) / 12f) * 12f, path, type) { }
        public Sample(float min, float max, float pitch, string path, TYPE type = TYPE.Normal)
        {
            this.min = min;
            this.max = max;
            this.pitch = pitch;
            this.path = path;
            this.type = type;
        }

        public Sample Init()
        {
            if (type != TYPE.BodyOnly && type != TYPE.BodyAndFeet) duration.X = GetDuration(path + (type == TYPE.HeadOnly ? "" : "_head"));
            if (type != TYPE.HeadOnly) duration.Y = GetDuration(path);
            if (type != TYPE.HeadOnly && type != TYPE.BodyOnly && type != TYPE.HeadAndBody) duration.Z = GetDuration(path + "_feet");
            ProdModel.Log($"Loading {path}: Length {duration.X}/{duration.Y}/{duration.Z}");
            return this;
        }

        public static float GetDuration(string path)
        {
            path = $"audio/instruments/{path}.ogg";
            return Audio.LoadStreamedSound(path).Length / 1000f;
        }

        public async void Play(float time, float pitch = 0, bool cutHead = false, bool cutFeet = false)
        {
            float rpitch = (float)Math.Pow(2, (pitch - this.pitch) / 12.0);
            float remaining = time;
            if ((!cutHead || duration.Y == 0) && duration.X != 0)
            { // play attack
                Audio.Play($"audio/instruments/{path + (duration.Y == 0 ? "" : "_head")}.ogg", rpitch);
                remaining -= duration.X;
                if (duration.Y != 0) await Task.Delay((int)(duration.X * 1000));
            }
            if (duration.Y != 0) // play body
            {
                var body = Audio.Play($"audio/instruments/{path}.ogg", true, rpitch);
                await Task.Delay((int)(remaining * 1000));
                Audio.Stop(body);
            }
            if (!cutFeet && duration.Z != 0) // play release
            {
                Audio.Play($"audio/instruments/{path}_feet.ogg", rpitch);
            }
        }
    }
}
