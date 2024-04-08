using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace NotGMS.Util
{
    public class FileP
    {
        public static string[] FilesInDirectory(string path, string ext = "*") =>
            Directory.GetFiles(path, "*." + ext, SearchOption.AllDirectories);
        public static Dictionary<string, T> ReadAll<T>(string dir, Func<string, T> open, string ext = "*")
        {
            Dictionary<string, T> d = new();
            string bp = Path.GetFullPath(dir);
            if (bp.EndsWith("/")) bp = bp[..^1];
            foreach (var x in FilesInDirectory(dir, ext))
            {
                string k = Path.GetFileName(x)[bp.Length..]; // truncate up to bp
                if (k.EndsWith("/")) k = k[..^1];
                if (!ext.Equals("*")) k = Path.ChangeExtension(k, "");
                d.Add(k, open(x));
            }
            return d;
        }
        public static T ReadJSON<T>(string name) => JsonSerializer.Deserialize<T>(File.ReadAllText(name));
    }
}
