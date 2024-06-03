using ProdModel.Object.Audio;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ProdModel.Gizmo
{
    public class SongHandler
    {
        public static Dictionary<string, Instrument> Instruments;
        public static void Init()
        {
            Instruments = new()
            {
                { "sine", new(Sample.TYPE.BodyOnly, new Sample("sine")) },
                { "tri", new(Sample.TYPE.BodyOnly, new Sample("tri")) },
                { "sq12", new(Sample.TYPE.BodyOnly, new Sample("sq12")) },
                { "sq25", new(Sample.TYPE.BodyOnly, new Sample("sq25")) },
                { "sq37", new(Sample.TYPE.BodyOnly, new Sample("sq37")) },
                { "sq50", new(Sample.TYPE.BodyOnly, new Sample("sq50")) },
                { "drum", new(Sample.TYPE.HeadOnly, new Sample(0, "kick"), new Sample(2, "clap"), new Sample(4, "hat"), new Sample(5, "crash")) },
            };
            ProdModel.Log("Loaded Instruments: " + string.Join(", ", Instruments.Keys));
        }
        public static Note[] ParseSong(string path)
        {
            // read score file
            string score = File.ReadAllText(ProdModel.ResolvePath($"../@main/data/song/{path}.wmid"));
            // parse score
            var _song = score.Trim().Split("\n").Select(x =>
            {
                var args = x.Split(";");
                Note ret = new()
                {
                    instrument = args[0],
                    startTime = float.Parse(args[1]),
                    duration = float.Parse(args[2]),
                    pitch = float.Parse(args[3]),
                    cutHead = false,
                    cutFeet = false,
                };
                if (args.Length > 4) ret.cutHead = args[4] == "t";
                if (args.Length > 5) ret.cutFeet = args[5] == "t";
                return ret;
            }).ToList();
            _song.Sort((a, b) => Math.Sign(a.startTime - b.startTime));
            return _song.ToArray();
        }
        public bool Stop = false;
        public async void PlaySong(Note[] song)
        {
            int progress = 0; float seek = 0;
            while (progress < song.Length)
            {
                if (song[progress].startTime > 0) await Task.Delay((int)((song[progress].startTime - seek) * 1000));
                if (Stop) break;
                seek = song[progress].startTime;
                while (progress < song.Length && song[progress].startTime == seek)
                {
                    if (Instruments.TryGetValue(song[progress].instrument, out var instrument))
                        instrument.Play(song[progress].duration, song[progress].pitch, song[progress].cutHead, song[progress].cutFeet);
                    progress++;
                }
            }
        }
    }
    public struct Note
    {
        public string instrument;
        public float startTime;
        public float duration;
        public float pitch;
        public bool cutHead;
        public bool cutFeet;
        public override string ToString() => $"{instrument};{startTime};{duration};{pitch};{(cutHead ? "t" : "f")};{(cutFeet ? "t" : "f")}";
    }
}
