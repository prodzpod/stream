using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;

namespace ProdModel.Utils
{
    public static class JSOND
    {
        // copy stackoverflow GO
        public static void Deserialize(Dictionary<string, object> result)
        {
            foreach (var keyValuePair in result.ToArray())
            {
                var jarray = keyValuePair.Value as JArray;
                if (jarray != null)
                {
                    var dictionaries = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(jarray.ToString());
                    result[keyValuePair.Key] = dictionaries;
                    foreach (var dictionary in dictionaries) Deserialize(dictionary);
                }
                else
                {
                    var jobject = keyValuePair.Value as JObject;
                    if (jobject != null)
                    {
                        var dictionary = JsonConvert.DeserializeObject<Dictionary<string, object>>(jobject.ToString());
                        result[keyValuePair.Key] = dictionary;
                        Deserialize(dictionary);
                    }
                }
            }
        }
    }
}
