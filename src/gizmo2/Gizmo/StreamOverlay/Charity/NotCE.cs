using CheatEngine;
using Gizmo.Engine;
using Gizmo.Engine.Util;
using System.Diagnostics;
using System.Drawing;

namespace Gizmo.StreamOverlay.Charity
{
    public class NotCE
    {
        public static CheatEngineLibrary? CE = null;
        public static string? CurrentPID = null;
        public static TVariableType type = TVariableType.vtDword;
        public static void Init()
        {
            CE = new();
            CE.loadEngine();
            Logger.Info(Procs());
        }
        public static string Procs()
        {
            if (CE == null) { return "CE is not online!"; }
            CE.iGetProcessList(out var strs);
            return "CE Loaded, current processes: \n" + strs;
        }
        public static bool Link(string name)
        {
            if (CE == null) { Logger.Warn("CE is not online!"); return false; }
            CE.iGetProcessList(out var strs);
            var procs = strs.Split('\n').Select(x =>
            {
                var idx = x.IndexOf('-');
                return new string[] { x[..idx], x[(idx + 1)..] };
            });
            var target = procs.FirstOrDefault(x => x[1].ToLower().StartsWith(name.ToLower()));
            if (target != null)
            {
                CurrentPID = target[0];
                CE.iOpenProcess(CurrentPID);
                CE.iInitMemoryScanner(Process.GetCurrentProcess().MainWindowHandle.ToInt32());
                CE.iInitFoundList(type, CE.iGetBinarySize(), false, false, false, false);
                // CE.iConfigScanner(Tscanregionpreference.scanInclude, Tscanregionpreference.scanDontCare, Tscanregionpreference.scanExclude);
                Logger.Info("CE Loaded, Process found: " + target[1]);
                Logger.Info(FirstScan());
            }
            else Logger.Warn("Process not found");
            return target != null;
        }
        public static long addrs = 0;
        public static string[] RandomAddrs = new string[1000];
        public static int RandomIdx = -1;
        public static string FirstScan(bool doFloat = false)
        {
            if (CurrentPID == null) { return "CE is not linked!"; }
            type = doFloat ? TVariableType.vtSingle : TVariableType.vtDword;
            CE.iNewScan();
            CE.iFirstScan(
                TScanOption.soUnknownValue, type, TRoundingType.rtRounded, "", "",
                "$0000000000000000", "$00007fffffffffff", false, false, false, false, TFastScanMethod.fsmAligned, "4");
            addrs = CE.iCountAddressesFound();
            if (addrs == 0) Logger.Warn("Scan failed, please retry");
            else if (RandomIdx == -1)
            {
                Logger.Warn("Addresses Found: " + addrs);
                Between(-1000, 1000);
                Logger.Info("Filling Random Address (0/1000)");
                /*
                for (var i = 0; i < 1000; i++)
                {
                    CE.iGetAddress(RandomP.Random(0, addrs), out var a, out var _);
                    RandomAddrs[i] = a;
                    if (i % 10 == 9) Logger.Info("Filling Random Address (" + (i + 1) + "/1000)");
                }
                */
                Logger.Info("Finished Filling Random Address");
                RandomIdx = 0;
            }
            return "Scan Reset, " + addrs + " addresses found";
        }
        public static string Scan(TScanOption option, string v1, string v2)
        {
            if (CurrentPID == null) { return "CE is not linked!"; }
            if (addrs == 0) return addrs + " addresses found (reset scan via `!scan reset` !)";
            CE.iNextScan(option, TRoundingType.rtRounded, v1, v2, false, false, false, false, false, false, "");
            addrs = CE.iCountAddressesFound();
            if (addrs == 0) return addrs + " addresses found (reset scan via `!scan reset` !)";
            if (addrs <= 10) return addrs + " addresses found (see addresses via `!value list` !)";
            return addrs + " addresses found";
        }
        public static string Between(float v1, float v2)
        {
            var g1 = (type == TVariableType.vtSingle ? v1 : (int)v1).ToString();
            var g2 = (type == TVariableType.vtSingle ? v2 : (int)v2).ToString();
            return Scan(TScanOption.soValueBetween, g1, g2);
        }
        public static string Changed(bool yes) => Scan(yes ? TScanOption.soChanged : TScanOption.soUnchanged, "", "");
        public static string List()
        {
            if (CurrentPID == null) { return "CE is not linked!"; }
            if (addrs == 0) return "no addresses found (reset scan via `!scan reset` !)";
            if (addrs > 10000000) return "too much addresses to show! (`!scan` until 10 million or less addresses remain)";
            string txt = "";
            for (int i = 0; i < Math.Min(addrs, 10); i++)
            {
                CE.iGetAddress(i, out var a, out var value);
                txt += a.ToUpper() + ": `" + value + "` \n";
            }
            return txt;
        }
        public static string Change(int addr, int value)
        {
            if (CurrentPID == null) { return "CE is not linked!"; }
            CE.iSetValue(addr, value.ToString(), false);
            return "address " + addr.ToString("X8").ToUpper() + " changed to " + value + "!";
        }
        public static string ChangeRandom(int number)
        {
            if (CurrentPID == null) { return "CE is not linked!"; }
            for (int i = 0; i < number; i++) Change(Convert.ToInt32(RandomAddrs[RandomIdx + i]), RandomP.Random(int.MaxValue));
            RandomIdx += number;
            return number + " addresses shuffled!";
        }
    }
}
