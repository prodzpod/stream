using Gizmo.Engine;
using Gizmo.Engine.Data;
using Gizmo.Engine.Util;

namespace ProdModel.Gizmo
{
    public class SongHandler
    {
        public static Note[] ParseSong(string path)
        {
            List<Note> song = [];
            foreach (var line in FileP.Slurp(FileP.Path($"@Content/@data/song/{path}.wmid")).Split('\n'))
            {
                var args = line.Trim().Split(";");
                args[0] = "instruments/" + args[0];
                if (!Resource.Instruments.ContainsKey(args[0])) continue;
                try
                {
                    Note ret = new()
                    {
                        instrument = args[0],
                        startTime = MathP.SafeParse(args[1]),
                        duration = MathP.SafeParse(args[2]),
                        pitch = MathP.SafeParse(args[3]) + 60,
                        cutHead = false,
                        cutFeet = false,
                    };
                    if (args.Length > 4) ret.cutHead = args[4] == "t";
                    if (args.Length > 5) ret.cutFeet = args[5] == "t";
                    song.Add(ret);
                }
                catch { continue; }
            }
            song.Sort((a, b) => Math.Sign(a.startTime - b.startTime));
            return [.. song];
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
        public override readonly string ToString() => $"{instrument};{startTime};{duration};{pitch};{(cutHead ? "t" : "f")};{(cutFeet ? "t" : "f")}";
    }
}
