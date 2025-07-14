using Gizmo.Engine.Builtin;
using Gizmo.Engine.Graphic;
using System.Numerics;

namespace Gizmo.Engine.Data
{
    public class Element
    {   
        public virtual string Sprite => "";
        public virtual IHitbox? Hitbox => null;
        public virtual string[] InteractsWith => [];
        public virtual float Mass(Instance i) => 1;
        public virtual Vector2 Gravity(Instance i) => Vector2.Zero;
        public virtual float Bounciness(Instance i) => .7f;
        public virtual float Friction(Instance i) => .8f;
        public virtual float Drag(Instance i) => 1;
        public virtual void OnInit(ref Instance self) 
        {
            if (self.Sprite == null && !string.IsNullOrWhiteSpace(Sprite)) 
            {
                if (Resource.NineSlices.TryGetValue(Sprite, out var s1)) self.Sprite = s1;
                else self.Sprite = Resource.Sprites[Sprite]; 
            }
            if (self.Sprite != null && self.Depth == 0)
            {
                if (self.Sprite is Sprite s1) self.Depth = s1.DefaultDepth;
                else if (self.Sprite is NineSlice s2) self.Depth = s2.Sprites[4].DefaultDepth;
            }
            self.Hitbox = Hitbox;
            self.InteractsWith = [..InteractsWith.Select(x => Resource.Elements[x])];
        }
        public virtual void OnPostInit(ref Instance self)
        {
            self.Gravity = Gravity(self);
            self.Mass = Mass(self);
            self.Bounciness = Bounciness(self);
            self.Friction = Friction(self);
            self.Drag = Drag(self);
        }
        public virtual void OnDestroy(ref Instance self) { }
        public virtual void OnUpdate(ref Instance self, float deltaTime) 
        {
            self.Life += deltaTime;
            self.Frame += self.Playback * deltaTime * MetaP.TargetFPS;
            self.Angle %= 360;
            self.Speed = MathP.SExp(self.Speed, self.Drag, deltaTime) + self.Gravity * deltaTime;
            self.Rotation = MathP.SExp(self.Rotation, self.Drag, deltaTime);
        }
        public virtual void OnDraw(ref Instance self, float deltaTime) 
        {
            self.Sprite?.Draw(self);
        }  
        public virtual void OnEvent(ref Instance self, object[] message) { }
        public virtual void OnCollide(ref Instance self, Instance other) { }
    }
    public interface Persistent { }
}
