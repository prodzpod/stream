using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using ProdModel.Utils;
using System;
using System.Diagnostics;
using System.Linq;

namespace ProdModel.Object
{
    public class NineSliceSprite : ISprite
    {
        public Texture2D[] Textures = new Texture2D[9];
        public Vector2 Tile = Vector2.One;
        public Vector2 FlipDependence = Vector2.Zero; // whether to flip the image itself upon flip
        public NineSliceSprite(string Path, bool TileX, bool TileY) : this(Path, new(TileX ? 1 : 0, TileY ? 1 : 0)) { }
        public NineSliceSprite(string Path, Vector2 tile)
        {
            string[] fnames = new string[9];
            Array.Fill(fnames, Path + '_');
            Tile = tile;
            if (Tile.Y > 0)
            {
                fnames[0] += 't';
                fnames[1] += 't';
                fnames[2] += 't';
                fnames[3] += 'm';
                fnames[4] += 'm';
                fnames[5] += 'm';
                fnames[6] += 'b';
                fnames[7] += 'b';
                fnames[8] += 'b';
            }
            if (Tile.X > 0)
            {
                fnames[0] += 'l';
                fnames[1] += 'c';
                fnames[2] += 'r';
                fnames[3] += 'l';
                fnames[4] += 'c';
                fnames[5] += 'r';
                fnames[6] += 'l';
                fnames[7] += 'c';
                fnames[8] += 'r';
            }
            Textures = fnames.Select(x => Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath(x + ".png"))).ToArray();
        }
        public Vector2 GetBoundingBox()
        {
            return new(
                Tile.X > 0 ? (Textures[3].Width + Textures[4].Width + Textures[5].Width) : Textures[4].Width,
                Tile.Y > 0 ? (Textures[1].Height + Textures[4].Height + Textures[7].Height) : Textures[4].Height);
        }
        public void Render(Vector4 position, float rotation, float depth)
        {
            Vector4 size = new(-(position.Z / 2), +(position.Z / 2), -(position.W / 2), +(position.W / 2));
            Vector4 middle = new(size.X, size.Y, size.Z, size.W);
            if (Tile.X > 0)
            {
                middle.X += Textures[3].Width;
                middle.Y -= Textures[5].Width;
            }
            if (Tile.Y > 0)
            {
                middle.Z += Textures[1].Height;
                middle.W -= Textures[7].Height;
            }
            size += new Vector4(position.X, position.X, position.Y, position.Y);
            middle += new Vector4(position.X, position.X, position.Y, position.Y);
            if (Tile.X != 0 && Tile.Y != 0)
            {
                Draw(Textures[0], new(size.X, middle.X, size.Z, middle.Z), position.XY(), rotation, depth);
                Draw(Textures[2], new(middle.Y, size.Y, size.Z, middle.Z), position.XY(), rotation, depth);
                Draw(Textures[6], new(size.X, middle.X, middle.W, size.W), position.XY(), rotation, depth);
                Draw(Textures[8], new(middle.Y, size.Y, middle.W, size.W), position.XY(), rotation, depth);
            }
            if (Tile.X != 0)
            {
                Draw(Textures[3], new(size.X, middle.X, middle.Z, middle.W), position.XY(), rotation, depth);
                Draw(Textures[5], new(middle.Y, size.Y, middle.Z, middle.W), position.XY(), rotation, depth);
            }
            if (Tile.Y != 0)
            {
                Draw(Textures[1], new(middle.X, middle.Y, size.Z, middle.Z), position.XY(), rotation, depth);
                Draw(Textures[7], new(middle.X, middle.Y, middle.W, size.W), position.XY(), rotation, depth);
            }
            Draw(Textures[4], new(middle.X, middle.Y, middle.Z, middle.W), position.XY(), rotation, depth);
        }
        public static void Draw(Texture2D texture, Vector4 lrtb, Vector2 center, float rotation, float depth) => Draw(texture, new Vector2(lrtb.X + lrtb.Y, lrtb.Z + lrtb.W) / 2, new Vector2(lrtb.Y - lrtb.X, lrtb.W - lrtb.Z), center, rotation, depth);
        public static void Draw(Texture2D texture, Vector2 position, Vector2 size, Vector2 center, float rotation, float depth)
        {
            if (size.X == 0 || size.Y == 0) return;
            var imageSize = new Vector2(texture.Width, texture.Height);
            ProdModel.Instance._spriteBatch.Draw(texture, position, null, Color.White, rotation, imageSize / 2, size / imageSize, SpriteEffects.None, depth);
        }

        public Vector2 ImageSize(int idx) => new(Textures[idx].Width, Textures[idx].Height);
    }
}
