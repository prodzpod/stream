#nullable enable
using Microsoft.Xna.Framework;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ProdModel.Puppet
{
    public struct _WorseVRM
    {
        public string root;
        public List<string> accessories;
        public List<List<string>> expressions;
        public Dictionary<string, Model> model;
        public Dictionary<string, Pose> poses;

        public struct Model
        {
            public List<float> pivot;
            public List<List<float>> v;
            public List<List<float>> f; // what the hell is an optimization
            public List<float> color;
            public List<string> children;
        }

        public struct Pose
        {
            public List<string> accessories;
            public List<string?> expression;
            public float time;
            public Dictionary<string, Dictionary<string, List<float>>> pose; // translate default to -1
        }
    }
    public class WorseVRM
    {
        public string root;
        public List<string> accessories;
        public List<List<string>> expressions;
        public Dictionary<string, Model> model;
        public Dictionary<string, Pose> poses;

        public struct Model
        {
            public string? parent;
            public Vector3 pivot;
            public List<Vector3> v;
            public List<Vector3> f; // what the hell is an optimization
            public Vector4 color;
            public List<string> children;
        }

        public struct Pose
        {
            public List<string> accessories;
            public List<string?> expression;
            public float time;
            public Dictionary<float, Dictionary<string, Vector3>> pose; // translate default to -1
        }

        public WorseVRM(_WorseVRM wvrm)
        {
            root = wvrm.root;
            accessories = wvrm.accessories;
            expressions = wvrm.expressions;
            model = new();
            foreach (string k in wvrm.model.Keys)
            {
                model[k] = new()
                {
                    pivot = new(wvrm.model[k].pivot[0], wvrm.model[k].pivot[1], wvrm.model[k].pivot[2]),
                    v = wvrm.model[k].v.Select(x => new Vector3(x[0], x[1], x[2])).ToList(),
                    f = wvrm.model[k].f.Select(x => new Vector3(x[0], x[1], x[2])).ToList(),
                    color = new(wvrm.model[k].color[0], wvrm.model[k].color[1], wvrm.model[k].color[2], wvrm.model[k].color[3]),
                    children = wvrm.model[k].children
                };
            }
            poses = new();
            foreach (string k in wvrm.poses.Keys)
            {
                poses[k] = new()
                {
                    accessories = wvrm.poses[k].accessories,
                    expression = wvrm.poses[k].expression,
                    time = wvrm.poses[k].time,
                    pose = new()
                };
                foreach (string k2 in wvrm.poses[k].pose.Keys) 
                {
                    float kf = k2.ToLower() == "default" ? -1 : float.Parse(k2);
                    poses[k].pose[kf] = new();
                    foreach (string k3 in wvrm.poses[k].pose[k2].Keys)
                        poses[k].pose[kf][k3] = new(wvrm.poses[k].pose[k2][k3][0], wvrm.poses[k].pose[k2][k3][1], wvrm.poses[k].pose[k2][k3][2]);
                }
            }
            var m = model[root];
            m.parent = null;
            model[root] = m;
            List<string> queue = new() { root };
            while (queue.Count > 0)
            {
                foreach (var k in model[queue[0]].children)
                {
                    queue.Add(k);
                    var c = model[k];
                    c.parent = queue[0];
                    model[k] = c;
                }
                queue.RemoveAt(0);
            }
        }

        public WorseVRM(string path) : this(
            JsonConvert.DeserializeObject<_WorseVRM>(
                File.ReadAllText(ProdModel.ResolvePath(
                    !path.Contains(".") ? path + ".json" : path)))) { }

        public WorseVRM(WorseVRM wvrm) // clone wvrm
        { 
            root = wvrm.root;
            accessories = new(wvrm.accessories);
            expressions = new();
            foreach (var l in wvrm.expressions) expressions.Add(new(l));
            model = new();
            foreach (var k in wvrm.model.Keys) model[k] = new()
            {
                parent = wvrm.model[k].parent,
                pivot = wvrm.model[k].pivot,
                v = new(wvrm.model[k].v),
                f = new(wvrm.model[k].f),
                color = wvrm.model[k].color,
                children = new(wvrm.model[k].children)
            };
            poses = new();
            foreach (var k in wvrm.poses.Keys)
            {
                poses[k] = new()
                {
                    accessories = new(wvrm.poses[k].accessories),
                    expression = new(wvrm.poses[k].expression),
                    time = wvrm.poses[k].time,
                    pose = new()
                };
                foreach (var k2 in wvrm.poses[k].pose.Keys) poses[k].pose[k2] = new(wvrm.poses[k].pose[k2]);
            }
        }
    }
}
