namespace ProdModel.Model
{
    public static class Model
    {
        public static void HandleTracker(string raw)
        {
            raw = raw.Trim('\0');
            TrackingData data = new(raw);
            ProdModel.Log("Model Data Recieved:", data);
            // ProdModel.Log(b.Length, string.Join(' ', b.Select(x => ((int)x).ToString("X"))));
        }
    }
}
