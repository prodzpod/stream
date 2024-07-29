using System.Text.RegularExpressions;

namespace Gizmo.Engine.Data
{
    public static class StringP
    {
        public static int NaturalSort(string a, string b)
        {
            string ka = Regex.Replace(a, @"\s+", "").ToLower();
            string kb = Regex.Replace(b, @"\s+", "").ToLower();
            bool targetNumber = false;
            while (true)
            {
                if (ka == kb) break;
                string sa = Regex.Match(ka, targetNumber ? @"^\d+" : @"^\D+").Value;
                string sb = Regex.Match(kb, targetNumber ? @"^\d+" : @"^\D+").Value;
                if (targetNumber)
                {
                    int la = sa.Equals("") ? -1 : int.Parse(sa);
                    int lb = sb.Equals("") ? -1 : int.Parse(sb);
                    if (la - lb != 0) return la - lb;
                }
                else
                {
                    int r = sa.CompareTo(sb);
                    if (r != 0) return r;
                }
                ka = ka[sa.Length..];
                kb = kb[sb.Length..];
            }
            // fallback: naively compare them
            return a.CompareTo(b);
        }

        public static string ToProper(this string s) => s[0..0].ToUpper() + s[1..].ToLower();
        public static string ToProperInvariant(this string s) => s[0..0].ToUpperInvariant() + s[1..].ToLowerInvariant();
        public static string ToTitle(this string s)
        {
            string ret = "";
            bool wsp = true;
            foreach (char cr in s)
            {
                string c = cr.ToString();
                if (wsp) { ret += c.ToUpper(); wsp = false; }
                else ret += c.ToLower();
                if (string.IsNullOrWhiteSpace(c)) wsp = true;
            }
            return ret;
        }
        public static string ToTitleInvariant(this string s)
        {
            string ret = "";
            bool wsp = true;
            foreach (char cr in s)
            {
                string c = cr.ToString();
                if (wsp) { ret += c.ToUpperInvariant(); wsp = false; }
                else ret += c.ToLowerInvariant();
                if (string.IsNullOrWhiteSpace(c)) wsp = true;
            }
            return ret;
        }
        public static string Join<T>(this IEnumerable<T> arr, char s) => string.Join(s, arr);
        public static string Join<T>(this IEnumerable<T> arr, string s) => string.Join(s, arr);
    }
}
