using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;

namespace ProdModel.Object
{
    public class PolygonSprite : ISprite
    {
        public List<Vector2[]> Polygons;
        public float Thickness;
        public Color Stroke;
        public Color Fill;
        public Vector2 FlipDependence = Vector2.Zero; // whether to flip the image itself upon flip
        public Vector2 GetBoundingBox()
        {
            if (Polygons.Count == 0) return Vector2.Zero;
            Vector4 Minmax = new(Polygons[0][0].X, Polygons[0][0].Y, Polygons[0][0].X, Polygons[0][0].Y);
            foreach (var line in Polygons) foreach (var point in line)
            {
                if (point.X < Minmax.X) Minmax.X = point.X;
                if (point.Y < Minmax.Y) Minmax.Y = point.Y;
                if (point.X > Minmax.Z) Minmax.Z = point.X;
                if (point.Y > Minmax.W) Minmax.W = point.Y;
            }
            return new(Minmax.Z - Minmax.X, Minmax.W - Minmax.Y);
        }
        public void Render(Vector4 position, float rotation, float depth)
        {
            throw new NotImplementedException();
        }
    }
}
