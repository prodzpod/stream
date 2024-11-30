using Gizmo.Engine.Builtin;
using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;
using Gizmo.Engine.MIDI;
using Gizmo.Engine.Util;
using Raylib_CSharp.Audio;
using SharpFont;
using System.Reflection;
using System.Text.RegularExpressions;
using static Gizmo.Engine.Data.Font;

namespace Gizmo.Engine
{
    public class Resource
    {
        //
        public static Dictionary<string, Sprite?> Sprites = [];
        public static Dictionary<string, NineSlice?> NineSlices = [];
        public static Dictionary<string, Sprite?> Decorations = [];
        // 
        public static Dictionary<string, Audio?> Audios = [];
        public static Dictionary<string, InstrumentFragment?> InstrumentFragments = [];
        public static Dictionary<string, Instrument?> Instruments = [];
        //
        public static Dictionary<string, FontFragment?> FontFragments = [];
        public static Dictionary<string, Font?> Fonts = [];
        //
        public static Dictionary<string, Shader?> Shaders = [];
        //
        public static Dictionary<string, Element?> Elements = [];
        public static Dictionary<string, Room?> Rooms = [];
        public static Dictionary<string, Timeline?> Timelines = [];
        public static Dictionary<string, Language?> Languages = [];

        public static Library Library = new();

        public static void Init()
        {
            AudioDevice.Init();
            InitImages(LoadWithExtension("Image", "png"));
            InitSounds(LoadWithExtension("Audio", "ogg"), LoadWithExtension("Audio", "instrument.properties"));
            InitFonts([.. LoadWithExtension("Font", "ttf"), .. LoadWithExtension("Font", "otf")], LoadWithExtension("Font", "font.properties"));
            InitShaders(LoadWithExtension("Shader", "vs.glsl"), LoadWithExtension("Shader", "fs.glsl"));
            foreach (var type in Assembly.GetCallingAssembly().GetTypes().Where(x => x.IsSubclassOf(typeof(Element))))
                Elements.Add(type.Name, type.GetConstructor(Type.EmptyTypes).Invoke([]) as Element);
            Logger.Info("Initialized", Elements.Count, "Elements");
            foreach (var type in Assembly.GetCallingAssembly().GetTypes().Where(x => x.IsSubclassOf(typeof(Room))))
                Rooms.Add(type.Name, type.GetConstructor(Type.EmptyTypes).Invoke([]) as Room);
            foreach (var type in Assembly.GetCallingAssembly().GetTypes().Where(x => x.IsSubclassOf(typeof(TextTag))))
                type.GetConstructor(Type.EmptyTypes).Invoke([]);
            Logger.Info("Initialized", Rooms.Count, "Rooms");
            Logger.Info("Finished Auto Loading!");
        }

        public static ResourceKey[] LoadWithExtension(string type, string extension)
        {
            List<ResourceKey> ret = [];
            foreach (var path in FileP.ListFiles([], extension))
            {
                var k = new ResourceKey(path, extension);
                if (ret.Exists(x => x.key == k.key) && k.param.Contains("nineslice") && k.param.Contains("instrument")) Logger.Warn($"Duplicate {type} File: {k}");
                else ret.Add(k);
            }
            return [.. ret];
        }

        public static void InitImages(ResourceKey[] keys)
        {
            foreach (var k in keys)
            {
                string key2 = k.key; int nsoffset = 4;
                var nsx = ""; var nsy = "";
                if (k.param.Length != 0 && k.param.Contains("nineslice"))
                {
                    var param = k.param.Last().ToLowerInvariant();
                    if (param != "nineslice")
                    {
                        if (param.Contains('l')) nsx = "l";
                        else if (param.Contains('r')) nsx = "r";
                        if (param.Contains('b')) nsy = "b";
                        else if (param.Contains('t')) nsy = "t";
                        if (!string.IsNullOrWhiteSpace(nsx) || !string.IsNullOrWhiteSpace(nsy))
                        {
                            key2 = $"{k.key}.{nsy}{nsx}";
                            if (nsy == "t") nsoffset -= 3;
                            if (nsy == "b") nsoffset += 3;
                            if (nsx == "l") nsoffset -= 1;
                            if (nsx == "r") nsoffset += 1;
                        }
                    }
                }
                int width = 1, height = 1;
                var cap1 = k.Capture(@"(\d*)\s*x\s*(\d*)");
                if (cap1.Length != 0) 
                { 
                    if (!string.IsNullOrWhiteSpace(cap1[0])) width = int.Parse(cap1[0]);
                    if (!string.IsNullOrWhiteSpace(cap1[1])) height = int.Parse(cap1[1]); 
                }
                if (Sprites.ContainsKey(key2)) Logger.Warn("Duplicate Sprite:", key2);
                else
                {
                    Sprites.Add(key2, Sprite.Load(k.path, width, height));
                    Logger.Debug("Adding Sprite", key2);
                }
                var cap2 = k.Capture(@"nineslice");
                if (cap2.Length != 0)
                {
                    if (!NineSlices.ContainsKey(k.key)) NineSlices.Add(k.key, new());
                    if (NineSlices[k.key] == null) NineSlices[k.key] = new();
                    var ns = NineSlices[k.key];
                    if (nsoffset % 3 != 1) ns.Loop.X = 1;
                    if (!MathP.Between(3, nsoffset, 5)) ns.Loop.Y = 1;
                    ns.Sprites[nsoffset] = Sprites[key2];
                    NineSlices[k.key] = ns;
                    if (nsx == "" || nsy == "")
                    {
                        var data = Sprites[key2].ToBitmap();
                        if ((nsy != "" || ns.Loop.Y != 1 || data.All(x => x.All(y => x[0] == y))) 
                         && (nsx != "" || ns.Loop.X != 1 || data.All(x => x.All((y, i) => data[0][i] == y)))) 
                            ns.Stretchable[nsoffset] = true;
                    }
                }
                var cap3 = k.Capture(@"(\-?((\d+\.?\d*)|(\d*\.\d+)))");
                if (cap3.Length != 0) Sprites[key2].DefaultDepth = MathP.SafeParse(cap3[0]);
            }
            Logger.Info("Initialized", Sprites.Count, "Sprites");
            Logger.Info("Initialized", NineSlices.Count, "Nine Slices");
        }

        public static void InitSounds(ResourceKey[] keys, ResourceKey[] insts)
        {
            var re = new Regex(@"(attack)|(release)", RegexOptions.IgnoreCase);
            foreach (var k in keys)
            {
                string key2 = k.key; int nsoffset = 1;
                if (k.param.Length != 0)
                {
                    var m = re.Match(k.param.Last());
                    if (m.Success)
                    {
                        string ks = m.Captures[0].Value.ToLowerInvariant();
                        if (ks == "attack") nsoffset = 0;
                        else nsoffset = 2;
                        key2 = $"{k.key}.{ks}";
                    }
                }
                Audios.Add(key2, Audio.Load(k.path));
                var cap1 = k.Capture(@"(\w+)");
                if (cap1.Length != 0 && cap1[0] != "instrument")
                {
                    Audios[key2].Group = cap1[0].ToLowerInvariant();
                }
                var cap2 = k.Capture(@"instrument");
                if ((cap1.Length != 0 && cap1[0] == "instrument") || cap2.Length != 0)
                {
                    if (!InstrumentFragments.ContainsKey(k.key)) InstrumentFragments.Add(k.key, new());
                    var ns = InstrumentFragments[k.key];
                    if (nsoffset == 0) ns.attack = Audios[key2];
                    if (nsoffset == 1) ns.main = Audios[key2];
                    if (nsoffset == 2) ns.release = Audios[key2];
                    InstrumentFragments[k.key] = ns;
                }
            }
            Logger.Info("Initialized", Audios.Count, "Sounds");
            Logger.Info("Initialized", InstrumentFragments.Count, "Instrument Fragments");
            foreach (var k in insts)
            {
                var inst = new Instrument();
                string def = "";
                foreach (var line in FileP.Slurp(k.path).Split('\n'))
                {
                    var idx = line.IndexOf('=');
                    if (idx == -1) continue;
                    var key = line[..idx].ToLowerInvariant().Trim();
                    var value = line[(idx + 1)..].Trim();
                    if (key == "default") { def = value; continue; }
                    var ints = key.Split('.').Select(int.Parse).ToArray();
                    if (ints.Length == 1) inst.AddInstrument(value, ints[0]);
                    else if (ints.Length == 2) inst.AddInstrument(value, ints[0], ints[1]);
                    else inst.AddInstrument(value, ints[0], ints[1], ints[2]);
                }
                if (def != "") inst.AddInstrument(def);
                Instruments.Add(k.key, inst);
            }
            Logger.Info("Initialized", Instruments.Count, "Instruments");
        }

        public static void InitFonts(ResourceKey[] keys, ResourceKey[] props)
        {
            foreach (var k in keys) { FontFragments.Add(k.key, FontFragment.Load(k.path)); }
            Logger.Info("Initialized", FontFragments.Count, "Font Fragments");
            var re = new Regex(@"^((regular)|(bold)|(italic)|(both))\=", RegexOptions.IgnoreCase);
            foreach (var k in props)
            {
                var font = new Font();
                foreach (var line in FileP.Slurp(k.path).Split('\n').Where(x => re.IsMatch(x))) {
                    var idx = line.IndexOf('=');
                    var cat = line[..idx].Trim().ToLowerInvariant();
                    FontFragment[] fonts = [.. line[(idx + 1)..].Split(',').Select(x => x.Trim()).Where(x =>
                    {
                        if (FontFragments.ContainsKey(x)) return true;
                        Logger.Warn("Font Fragment does not exist:", x);
                        return false;
                    }).Select(x => FontFragments[x])];
                    if (cat == "regular") font._font[Style.REGULAR] = fonts;
                    else if (cat == "bold") font._font[Style.BOLD] = fonts;
                    else if (cat == "italic") font._font[Style.ITALIC] = fonts;
                    else if (cat == "both") font._font[Style.BOTH] = fonts;
                }
                // backup strategy: if font type is not present, replace with the closest style instead
                bool exists(Style style) => font._font.ContainsKey(style) && font._font[style].Length != 0;
                void backup(Style style, params Style[] styles) {
                    if (exists(style)) return;
                    foreach (var backup in styles) if (exists(backup)) {
                        font._font[style] = font._font[backup];
                        return;
                    }
                }
                backup(Style.REGULAR, Style.BOLD, Style.ITALIC, Style.BOTH);
                backup(Style.BOLD, Style.BOTH, Style.REGULAR, Style.ITALIC);
                backup(Style.BOTH, Style.ITALIC, Style.BOLD, Style.REGULAR);
                backup(Style.ITALIC, Style.REGULAR, Style.BOTH, Style.BOLD);
                Fonts.Add(k.key, font);
            }
            Logger.Info("Initialized", Fonts.Count, "Fonts");
        }

        public static void InitShaders(ResourceKey[] vs, ResourceKey[] fs)
        {
            Dictionary<string, KeyValuePair<string, string>> temp = [];
            foreach (var k in vs)
            {
                if (!temp.ContainsKey(k.key)) temp.Add(k.key, new(Shader.DEFAULT_VS, Shader.DEFAULT_FS));
                temp[k.key] = new(FileP.Slurp(k.path), temp[k.key].Value);
            }
            foreach (var k in fs)
            {
                if (!temp.ContainsKey(k.key)) temp.Add(k.key, new(Shader.DEFAULT_VS, Shader.DEFAULT_FS));
                temp[k.key] = new(temp[k.key].Key, FileP.Slurp(k.path));
            }
            foreach (var s in temp) Shaders.Add(s.Key, new(s.Value.Key, s.Value.Value));
            Logger.Info("Initialized", Shaders.Count, "Shaders");
        }

        public static void Dispose()
        {
            foreach (var k in Shaders.Values) k?._shader.Unload();
            foreach (var k in FontFragments.Values) k?.font.Unload();
            foreach (var k in Sprites.Values) k?.Image?.Unload();
            foreach (var k in Audios.Values) k?.Sound.Unload();
        }
    }
    public struct ResourceKey
    {
        public string path;
        public string key;
        public string[] param;
        public ResourceKey(string path, string extension)
        {
            this.path = path;
            if (!Path.IsPathRooted(path)) path = FileP.Path(path);
            if (!string.IsNullOrWhiteSpace(extension) && !extension.StartsWith('.')) extension = "." + extension;
            path = path[(FileP.Path([]).Length + 1)..(path.Length - extension.Length)];
            if (path.Contains('@'))
            {
                path = path[(path.LastIndexOf('@') + 1)..];
                if (path.Contains('\\')) path = path[(path.IndexOf('\\') + 1)..];
            }
            var kp = path.Replace('\\', '/').Split('.');
            key = kp[0];
            param = kp[1..];
        }
        public string[] Capture(string re)
        {
            if (param.Length == 0) return [];
            var match = new Regex(re, RegexOptions.IgnoreCase).Match(param[0]);
            if (!match.Success) return [];
            param = param[1..];
            string[] res = [.. match.Groups.Values.Select(x => x.Value).Skip(1)];
            if (res.Length == 0) return [""];
            return res;
        }
        public override readonly string ToString() => key;
    }
}
