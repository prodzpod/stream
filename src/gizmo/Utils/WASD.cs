using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace ProdModel.Utils
{
    public static class WASD
    {
        public static string Pack(params object[] strings)
        {
            return string.Join(" ", strings.Select(x =>
            {
                string t = x.ToString().Trim();
                if (string.IsNullOrEmpty(t)) return "\"\"";
                if (!Regex.IsMatch(t, @"\s") && !t.StartsWith("\"")) return t;
                return $"\"{t.Replace("\"", "\"\"")}\"";
            }));
        }

        public static string[] Unpack(string str) 
        { 
            List<string> ret = new();
            bool newWord = true;
            bool parseQuoted = true;
            string currentWord = "";
            for (int i = 0; i < str.Length; i++)
            {
                char c = str[i];
                if (newWord)
                {
                    if (char.IsWhiteSpace(c) || c == '\0') continue;
                    newWord = false;
                    parseQuoted = c == '"';
                    if (!parseQuoted) currentWord += c;
                } 
                else if (!parseQuoted)
                {
                    if (char.IsWhiteSpace(c) || c == '\0')
                    {
                        ret.Add(currentWord);
                        newWord = true;
                        currentWord = "";
                    }
                    else currentWord += c;
                }
                else
                {
                    if (c == '"')
                    {
                        if (i + 1 < str.Length && str[i + 1] == '"')
                        {
                            currentWord += c;
                            i++;
                        }
                        else
                        {
                            ret.Add(currentWord);
                            newWord = true;
                            currentWord = "";
                        }
                    }
                    else currentWord += c;
                }
            }
            if (!newWord) ret.Add(currentWord);
            return ret.ToArray();
        }
    }
}
