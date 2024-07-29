namespace Gizmo.Engine.Util
{
    public static class FileP
    {
        public static string Path(params string[] path)
        {
            var fullPath = new List<string> { NotGMS.WorkingDirectory }; fullPath.AddRange(path);
            return System.IO.Path.Combine(fullPath.ToArray());
        }

        public static bool Exists(params string[] path) => File.Exists(Path(path));

        public static string ToAbsolute(this string path)
        {
            if (System.IO.Path.IsPathRooted(path)) return path; return System.IO.Path.GetFullPath(System.IO.Path.Combine(Directory.GetCurrentDirectory(), path));
        }

        public static string[] ListFiles(string path) => ListFiles(path, "");
        public static string[] ListFiles(IEnumerable<string> path) => ListFiles(Path([.. path]), "");
        public static string[] ListFiles(string path, string extension)
        {
            if (!System.IO.Path.IsPathRooted(path)) path = Path(path);
            if (!string.IsNullOrWhiteSpace(extension) && !extension.StartsWith('.')) extension = "." + extension;
            List<string> search = [path];
            List<string> ret = [];
            while (search.Count > 0)
            {
                var target = search[0];
                search.RemoveAt(0);
                ret.AddRange(Directory.GetFiles(target).Where(x => !x.StartsWith('_') && x.EndsWith(extension)));
                search.AddRange(Directory.GetDirectories(target).Where(x => !x.StartsWith('_')));
            }
            return [.. ret];
        }
        public static string[] ListFiles(IEnumerable<string> path, string extension) => ListFiles(Path([.. path]), extension);
        public static string Slurp(string path)
        {
            using StreamReader r = new(path);
            return r.ReadToEnd();
        }
        public static void Write(string path, string text)
        {
            using StreamWriter w = new(path);
            w.Write(text);
            return;
        }
    }
}
