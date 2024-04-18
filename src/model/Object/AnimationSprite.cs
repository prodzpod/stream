using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using NotGMS.Util;
using System;
using System.Diagnostics;
using System.Linq;

namespace ProdModel.Object
{
    public class AnimationSprite : ISprite
    {
        public Vector2 FlipDependence = Vector2.One; // whether to flip the image itself upon flip
        public Color Color = Color.White;
        public Object Parent;

        public Texture2D[] Textures;
        public float Speed = 1f;
        public float Frame = 0f;
        public Action<Object, GameTime> Action;

        public AnimationSprite(Object Parent, string Path, int Frames) : this(Parent, Path, Frames, 1f) { }
        public AnimationSprite(Object Parent, string Path, int Frames, float Speed) : this(Parent, CollectionP.Iota(Frames).Select(x => Texture2D.FromFile(ProdModel.Instance._graphics.GraphicsDevice, ProdModel.ResolvePath(Path + (x + 1) + ".png"))).ToArray(), Speed) { }
        public AnimationSprite(Object Parent, Texture2D[] Textures) : this(Parent, Textures, 1f) { }
        public AnimationSprite(Object Parent, Texture2D[] Textures, float Speed)
        {
            this.Textures = Textures;
            this.Speed = Speed;
            this.Parent = Parent;
            Action = (self, time) =>
            {
                Frame += this.Speed * (float)time.ElapsedGameTime.TotalSeconds;
                if (Frame >= this.Textures.Length) OnAnimationLoop();
            };
            Parent.onUpdate += Action;
        }
        public Vector2 GetBoundingBox()
        {
            return new(Textures[0].Width, Textures[0].Height);
        }
        public void Render(Vector4 position, float rotation)
        {
            ProdModel.Instance._spriteBatch.Draw(Textures[(int)MathP.Modp(Frame, Textures.Length)], position.XY(), null, Color, MathP.DegToRad(rotation), GetBoundingBox() / 2, Vector2.One, SpriteEffects.None, 0);
        }

        public event Action<AnimationSprite, Object> onAnimationLoop;
        public void OnAnimationLoop()
        {
            Frame -= Textures.Length;
            onAnimationLoop?.Invoke(this, Parent);
        }

    }
}
