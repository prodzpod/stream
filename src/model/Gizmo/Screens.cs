using ProdModel.Object;

namespace ProdModel.Gizmo
{
    public class Screens
    {
        public static void AddStartingSoon()
        {
            new Object.Object("startingsoon").AddChild(new ImageSprite("Content/layout/startingsoon")).SetBoundingBoxes(0).SetPosition(0, 0).SetDepth(-1);
        }

        public static void AddBRB()
        {

        }
    }
}
