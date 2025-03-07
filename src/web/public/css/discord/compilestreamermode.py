import sys
import re
fname = sys.argv[1]
txt = ""
args = dict()
varsmode = False
with open(fname + ".ccss", "r", encoding="utf8") as f:
    for line in f.readlines():
        if varsmode:
            if line.startswith("*/"):
                args[name] = value
                print("Value Saved", name, value)
                varsmode = False
            else:
                idx = line.find("//")
                if idx == -1:
                    idx = len(line)
                line = line[:idx].strip()
                if line != "":
                    value.append(line)
        elif line.startswith("/*@"):
            name = line[3:].strip()
            value = list()
            varsmode = True
        elif "@$" in line:
            caps = re.findall(r"\@\$\w+\$[^\$]+\$", line)
            while len(caps) > 0:
                entry = caps[0][2:].split("$")
                line = line.replace(caps[0], entry[1].join(args[entry[0]]))
                print("Value Replaced", caps[0])
                caps = re.findall(r"\@\$\w+\$[^\$]+\$", line)
        txt += line
print("Writing")
with open(fname + ".css", "w", encoding="utf8") as f:
    f.write(txt)
print("Done")