import bpy
import mathutils
from pathlib import Path
import json
import builtins as __builtin__

# blender print dumb

def console_print(*args, **kwargs):
    for a in bpy.context.screen.areas:
        if a.type == 'CONSOLE':
            c = {}
            c['area'] = a
            c['space_data'] = a.spaces.active
            c['region'] = a.regions[-1]
            c['window'] = bpy.context.window
            c['screen'] = bpy.context.screen
            s = " ".join([str(arg) for arg in args])
            for line in s.split("\n"):
                bpy.ops.console.scrollback_append(c, text=line)

def print(*args, **kwargs):
    """Console print() function."""

    console_print(*args, **kwargs) # to py consoles
    __builtin__.print(*args, **kwargs) # to system console
    
# real script starts here

def find(arr, fn):
    return next(iter([x for x in arr if fn(x)]), None)

def unentry(kv):
    ret = dict()
    for x in kv:
        ret[x[0]] = x[1]
    return ret

def operateArr(a, b, fn):
    ret = []
    l = min(len(a), len(b))
    for i in range(l):
        ret.append(fn(a[i], b[i]))
    return ret

def isInt(s):
    try:
        int(s)
        return True
    except ValueError:
        return False 
    
COLLECTIONS = list(bpy.data.collections)
c_model = find(COLLECTIONS, lambda x: x.name == 'base')
c_deco = find(COLLECTIONS, lambda x: x.name == 'decoration')
c_expr = find(COLLECTIONS, lambda x: x.name == 'expression')
objects = unentry([[x.name, x] for x in list(bpy.data.objects)])

base = find(c_model.all_objects.values(), lambda x: x.parent == None)

model = dict()
_to_search = [base]
while (len(_to_search) > 0):
    o = _to_search.pop()
    _to_search += o.children
    if o.name[0] == "_":
        continue
    m = o.data
    model[o.name] = dict()
    model[o.name]["pivot"] = tuple(((o.parent if o.parent != None and o.parent.name[0] == "_" else o).matrix_world @ mathutils.Vector((0.0, 0.0, 0.0, 1.0)))[:3])
    model[o.name]["v"] = [tuple(o.matrix_world @ x.co) for x in m.vertices]
    model[o.name]["f"] = [tuple(t.vertices) for t in m.loop_triangles.values()]
    model[o.name]["color"] = tuple([0, 0, 0, 0]) if len(m.materials) == 0 else tuple(next(n for n in m.materials[0].node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value)
    model[o.name]["children"] = [(x.name[1:] if x.name[0] == "_" else x.name) for x in o.children]

def init(fname, reset=False):
    global base, model, objects
    if not reset and Path(bpy.path.abspath('//' + fname + ".json")).is_file():
        with open(bpy.path.abspath('//' + fname + ".json"), 'r', encoding='utf-8') as f:
            meta = json.loads(f.read())
    else:
        meta = dict()
    meta["root"] = base.name
    meta["accessories"] = [x.name for x in c_deco.all_objects.values()]
    expr = dict()
    for x in c_expr.all_objects.values():
        names = x.name.split("_", 1)
        if isInt(names[0]):
            if names[0] not in expr:
                expr[names[0]] = []
            expr[names[0]].append(names[1])
    i = 0
    meta["expressions"] = []
    while str(i) in expr:
        meta["expressions"].append(expr[str(i)])
        i += 1
    meta["model"] = model
    if reset or "poses" not in meta:
        meta["poses"] = dict()
    if reset or "DEFAULT" not in meta["poses"]: 
        meta["poses"]["DEFAULT"] = dict()
        meta["poses"]["DEFAULT"]["time"] = 0
        meta["poses"]["DEFAULT"]["accessories"] = []
        meta["poses"]["DEFAULT"]["expression"] = [None for x in meta["expressions"]]
    if "pose" not in meta["poses"]["DEFAULT"]:
        meta["poses"]["DEFAULT"]["pose"] = dict()
        meta["poses"]["DEFAULT"]["pose"]["default"] = dict()
    for k in meta["model"]:
        if k not in meta["poses"]["DEFAULT"]["pose"]["default"]:
            meta["poses"]["DEFAULT"]["pose"]["default"][k] = tuple((objects[k] if "_" + k not in objects else objects["_" + k]).rotation_euler)
    return meta

def add_pose(meta, name, time = 0, frame = None, accessory = [], expression = None):
    if expression is None:
        expression = [None for x in meta["expressions"]]
    if name not in meta["poses"]:
        meta["poses"][name] = dict()
        meta["poses"][name]["time"] = time
        meta["poses"][name]["accessories"] = accessory
        meta["poses"][name]["expression"] = expression
        meta["poses"][name]["pose"] = dict()
    if frame is not None and "default" not in meta["poses"][name]["pose"]:
        meta = add_pose(meta, name, time, None, accessory, expression)
    frame = "default" if frame is None else str(frame)
    meta["poses"][name]["pose"][frame] = dict()
    for k in meta["model"]:   
        data = tuple((objects[k] if "_" + k not in objects else objects["_" + k]).rotation_euler)
        if not all(x == meta["poses"]["DEFAULT"]["pose"]["default"][k][i] for i, x in enumerate(data)):
            meta["poses"][name]["pose"][frame][k] = data
    return meta

def set_pose(meta, name, frame = None):
    frame = "default" if frame is None else str(frame)
    if name not in meta["poses"] or frame not in meta["poses"][name]["pose"]:
        return
    for k in meta["model"]:   
        o = objects[k] if "_" + k not in objects else objects["_" + k]
        o.rotation_euler = mathutils.Euler(tuple(meta["poses"]["DEFAULT"]["pose"]["default"][k] if k not in meta["poses"][name]["pose"][frame] else meta["poses"][name]["pose"][frame][k]), 'XYZ')

def save(meta, fname):
    with open(bpy.path.abspath('//' + fname + ".json"), 'w', encoding='utf-8') as f:
        f.write(json.dumps(meta))

# Configs
OUTPUT_FNAME = "model_data"
RESET = True
# Main
meta = init(OUTPUT_FNAME, RESET)
if not RESET:
    meta = add_pose(meta, "IDLE")
    set_pose(meta, "DEFAULT")
save(meta, OUTPUT_FNAME)