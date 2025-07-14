using Gizmo.Engine.Data;

namespace Gizmo.Engine.Util
{
    public static class RandomP
    {
        public static Random random = new();
        public static Random randomUnseeded = new();
        public static Random GetRandom(bool seeded) => seeded ? random : randomUnseeded;
        public static Dictionary<int, Random> SeededRandoms = [];
        public static Random GetRandom(int seed)
        {
            if (!SeededRandoms.ContainsKey(seed)) SeededRandoms[seed] = new(seed);
            return SeededRandoms[seed];
        }
        public static Random Reset(int seed) => SeededRandoms[seed] = new(seed);
        public static void Seed(int seed) { random = new(seed); }
        public static bool Chance(double chance, bool seeded = true) => GetRandom(seeded).NextDouble() < chance;
        public static bool Chance(double chance, Random r) => r.NextDouble() < chance;
        public static double Random(bool seeded = true) => Random(0.0, 1.0, seeded);
        public static double Random(double max, bool seeded = true) => Random(0, max, seeded);
        public static double Random(double min, double max, bool seeded = true) => MathP.Lerp(min, max, GetRandom(seeded).NextDouble());
        public static double Random(Random r) => Random(0.0, 1.0, r);
        public static double Random(double max, Random r) => Random(0, max, r);
        public static double Random(double min, double max, Random r) => MathP.Lerp(min, max, r.NextDouble());
        public static float Random(float max, bool seeded = true) => Random(0, max, seeded);
        public static float Random(float min, float max, bool seeded = true) => MathP.Lerp(min, max, GetRandom(seeded).NextSingle());
        public static float Random(float max, Random r) => Random(0, max, r);
        public static float Random(float min, float max, Random r) => MathP.Lerp(min, max, r.NextSingle());
        public static int Random(int max, bool seeded = true) => Random(0, max, seeded);
        public static int Random(int min, int max, bool seeded = true) => MathP.PosMod((int)GetRandom(seeded).NextInt64(), max - min) + min;
        public static int Random(int max, Random r) => Random(0, max, r);
        public static int Random(int min, int max, Random r) => max - min == 0 ? min : (MathP.PosMod((int)r.NextInt64(), max - min) + min);
        public static long Random(long max, bool seeded = true) => Random(0, max, seeded);
        public static long Random(long min, long max, bool seeded = true) => MathP.PosMod((int)GetRandom(seeded).NextInt64(), max - min) + min;
        public static long Random(long max, Random r) => Random(0, max, r);
        public static long Random(long min, long max, Random r) => max - min == 0 ? min : (MathP.PosMod((int)r.NextInt64(), max - min) + min);
        public static T Random<T>(IEnumerable<T> list, bool seeded = true) => list.ElementAt(Random(list.Count(), seeded));
        public static T Random<T>(IEnumerable<T> list, Random r) => list.ElementAt(Random(list.Count(), r));
        public static Dictionary<T, double> ToWeightedList<T>(this IEnumerable<T> list) where T : notnull
        {
            Dictionary<T, double> ret = new();
            foreach (var t in list) ret.Add(t, 1.0);
            return ret;
        }
        public static T Random<T>(IDictionary<T, double> weightedList, bool seeded = true) => Resolve(weightedList, x => Random(x, seeded));
        public static T Random<T>(IDictionary<T, double> weightedList, Random r) => Resolve(weightedList, x => Random(x, r));
        public static T Resolve<T>(IDictionary<T, double> weightedList, Func<double, double> fn)
        {
            double total = 0;
            List<T> keys = new(weightedList.Keys);
            List<double> weights = new();
            foreach (var k in keys)
            {
                total += weightedList[k];
                weights.Add(total);
            }
            double res = fn(total);
            for (int i = 0; i < keys.Count; i++) if (res > weights[i]) return keys[i];
            return keys[0]; // fallback, should not happen
        }
    }
}
