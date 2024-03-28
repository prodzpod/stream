#nullable enable
using Microsoft.Xna.Framework;
using System.Collections.Generic;

namespace ProdModel.Model
{
    public struct WorseVRM
    {
        public string prod;
        public List<string> accessories;
        public Dictionary<string, Model> model;
        public Dictionary<string, Pose> poses;

        public struct Model
        {
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
            public Dictionary<string, Vector3> rotation;
        }
    }
}
