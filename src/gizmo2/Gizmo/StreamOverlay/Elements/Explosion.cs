using Gizmo.Engine.Data;
using Gizmo.Engine.Graphic;

namespace Gizmo.StreamOverlay.Elements
{
    public class Explosion: Element
    {
        public override string Sprite => "other/explosion";
        public override void OnPostInit(ref Instance self)
        {
            base.OnPostInit(ref self);
            self.Playback = .5f;
        }
        public override void OnUpdate(ref Instance self, float deltaTime)
        {
            base.OnUpdate(ref self, deltaTime);
            if (self.Frame >= ((Sprite)self.Sprite).GetSubimageCount()) self.Destroy();
        }
    }
}
