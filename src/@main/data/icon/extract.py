import os
FILES = [os.path.join(a, x)[2:] for a, b, c in os.walk(".") for x in c if x.endswith(".png")]
OUTPUT = "icon"

def pack(*args):
    return " ".join([_pack(x) for x in args])

def _pack(arg):
    if type(arg) is list:
        return "[" + " ".join([_pack(x) for x in arg]) + "]"
    if type(arg) is dict:
        return "{" + " ".join([_pack(k) + " " + _pack(arg[k]) for k in arg]) + "}"
    if arg == None or str(arg).strip() == "":
        return "\"\""
    arg = str(arg).strip()
    if "[" in arg or "]" in arg or "{" in arg or "}" in arg or " " in arg or "\t" in arg or "\n" in arg or arg.startswith('"'):
        return "\"" + arg.replace("\"", "\"\"") + "\""
    return arg

ret = dict()
for file in FILES:
    category = file.split("\\")[0]
    name = "/".join(file.split("\\")[1:])[:-len(".png")]
    if name.endswith("_ALT"):
        continue
    hasAlt = file[:-len(".png")] + "_ALT.png" in FILES
    if category == "modifier": # modifier
        if category not in ret:
            ret[category] = dict()
        pos = name.split("/")[-1].split("_")[0]
        ret[category][name] = { "pos": pos, "chance": 0.1, "hasAlt": hasAlt, }
    elif category == "quest":
        if category not in ret:
            ret[category] = dict()
        ret[category][name] = { "condition": "", }
    else: # normal
        if category not in ret:
            ret[category] = []
        ret[category].append(name)
with open("../" + OUTPUT + ".wasd", "w", encoding="utf-8") as f:
    f.write(pack(ret))