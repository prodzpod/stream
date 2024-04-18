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

COLLECTIONS = list(bpy.data.collections)
OBJECTS = list(bpy.data.objects)
MESHES = list(bpy.data.meshes)

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

def get_center(bbox):
    ret = [0, 0, 0]
    for pos in bbox:
        ret = operateArr(pos, ret, lambda a, b: a + b)
    return [x/len(bbox) for x in ret]

def get_relations(obj):
    ret = dict()
    ret['name'] = obj.name
    if (obj.parent != None and obj.parent.name[0] == '_'):
        ret['parent'] = obj.parent.parent
        ret['pivot'] = list(obj.parent.location)
    else:
        ret['parent'] = obj.parent
        ret['pivot'] = list(obj.location)
    ret['children'] = [x.name[1:] if x.name[0] == '_' else x.name for x in obj.children]
    mas = list()
    for x in ret['children']:
        nobj = find(OBJECTS, lambda y: y.name == x)
        if nobj != None:
            mas.extend(get_relations(nobj))
    mas.append(ret)
    return mas

c_model = find(COLLECTIONS, lambda x: x.name == 'base')
c_deco = find(COLLECTIONS, lambda x: x.name == 'decoration')
c_expr = find(COLLECTIONS, lambda x: x.name == 'expression')

# retrieve start points
o_root = find([x for x in OBJECTS if x.parent == None], lambda x: x.users_collection[0] == c_model)
o_decoration = [x for x in OBJECTS if x.users_collection[0] == c_deco]
o_expression = [x for x in OBJECTS if x.users_collection[0] == c_expr]

# retrieve mesh data
objects = unentry([[x.name, x] for x in OBJECTS])
meshes = unentry([[x.name, x] for x in MESHES])
    
# retrieve pivot point info
relations = dict()
for x in get_relations(o_root):
    relations[x['name']] = x

# retrieve color
for k in relations:
    if len(meshes[k].materials) == 0:
        relations[k]['color'] = tuple([0, 0, 0, 0])
        continue
    color = tuple(next(n for n in meshes[k].materials[0].node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value)
    relations[k]['color'] = color

# RELATIONS data: describes full mesh with only joints processed, use intermediary here
    
def make_pose(rotations, acc = ['skirt_default'], expr = [None, None, None]):
    ret = dict()
    ret['model'] = rotations
    ret['accessories'] = list(acc)
    ret['expression'] = list(expr) 
    return ret    

# build model pose object
model = dict()
for k in relations:
    model[k] = dict()
    model[k]['pivot'] = relations[k]['pivot']
    model[k]['v'] = [tuple(objects[k].matrix_world @ x.co) for x in meshes[k].vertices]
    model[k]['f'] = [tuple(x.vertices) for x in meshes[k].polygons]
    model[k]['color'] = relations[k]['color']
    model[k]['children'] = relations[k]['children']

def initialize_meta():
    print("Creating Fresh Metafile")
    meta = dict()
    meta['root'] = o_root.name
    meta['accessories'] = list([x.name for x in o_decoration])
    meta['expressions'] = list()
    _idx = 0
    while find(OBJECTS, lambda x: x.users_collection[0] == c_expr and x.name.startswith(str(_idx) + "_")) != None:
        meta['expressions'].append([x.name[2:] for x in OBJECTS if x.users_collection[0] == c_expr and x.name.startswith(str(_idx) + "_")])
        _idx += 1
    meta['model'] = model   
    meta['poses'] = dict()
    meta['poses']['DEFAULT'] = dict()
    meta['poses']['DEFAULT']['time'] = 0
    meta['poses']['DEFAULT']['accessories'] = list(['skirt_default'])
    meta['poses']['DEFAULT']['expression'] = [None for _ in meta['expressions']]
    meta['poses']['DEFAULT']['pose'] = dict()
    meta['poses']['DEFAULT']['pose']['default'] = dict()
    for k in model:
        tk = find(OBJECTS, lambda x: x.name == '_' + k)
        if tk == None:
            tk = find(OBJECTS, lambda x: x.name == k)
        meta['poses']['DEFAULT']['pose']['default'][k] = tuple(tk.rotation_euler)
    return meta
    
def load_meta(path):
    print("Reading Metafile from " + path)
    meta = ""
    with open(bpy.path.abspath('//' + path), 'r', encoding='utf-8') as f:
        meta = json.loads(f.read())
    new_meta = initialize_meta()
    meta['root'] = new_meta['root']
    meta['accessories'] = new_meta['accessories']
    todel = list()
    for k in meta['model']:
        if k not in new_meta['model']:
            print("Removing Outdatad Asset " + k)
            todel.append(k)
    for k in todel:
        del meta['model'][k]
        for model in meta['model']:
            if k in meta['model'][model]['children']:
                meta['model'][model]['children'].remove(k)
        for pose in meta['poses']:
            for pose2 in meta['poses'][pose]['pose']:
                if k in meta['poses'][pose]['pose'][pose2]:
                    del meta['poses'][pose]['pose'][pose2][k]
    return meta

OUTPUT_FNAME = 'model_data.json'
def get_meta():
    print("Fetching Metafile")
    if Path(bpy.path.abspath('//' + OUTPUT_FNAME)).is_file():
        return load_meta(OUTPUT_FNAME)
    else:
        print("No Metafile on Disk, Creating New Metafile")
        return initialize_meta()

def make_new_pose(meta, name, progress, acc=None, expr=None):
    pose = dict()
    pose['accessories'] = acc if acc != None else meta['poses']['DEFAULT']['accessories']
    pose['expression'] = expr if expr != None else meta['poses']['DEFAULT']['expression']
    if 'pose' not in meta['poses'][name]:
        pose['time'] = 0
        pose['pose'] = dict()
    else:
        pose['pose'] = meta['poses'][name]['pose']
    pose['pose'][progress] = dict()
    for k in model:
        tk = find(OBJECTS, lambda x: x.name == '_' + k)
        if tk == None:
            tk = find(OBJECTS, lambda x: x.name == k)
        rotation = tuple(tk.rotation_euler)
        if tuple(meta['poses']['DEFAULT']['pose']['default'][k]) != rotation:
            pose['pose'][progress][k] = tuple([list(tk.rotation_euler)[0] - meta['poses']['DEFAULT']['pose']['default'][k][0], list(tk.rotation_euler)[1] - meta['poses']['DEFAULT']['pose']['default'][k][1], list(tk.rotation_euler)[2] - meta['poses']['DEFAULT']['pose']['default'][k][2]])
    return pose

def reset_and_sync(meta):
    for k in meta['poses']['DEFAULT']['pose']['default']:
        v = meta['poses']['DEFAULT']['pose']['default'][k]
        tk = find(OBJECTS, lambda x: x.name == '_' + k)
        if tk == None:
            tk = find(OBJECTS, lambda x: x.name == k)
        tk.rotation_euler = mathutils.Euler((v[0], v[1], v[2]), 'XYZ')
    new_meta = initialize_meta()
    for k in [x for x in new_meta['model'] if x not in meta['model']]: 
        print("Updating DEFAULT with part " + k)
        meta['model'][k] = new_meta['model'][k]
        parent = find(new_meta['model'], lambda x: k in new_meta['model'][x]['children'])
        meta['model'][parent]['children'].append(k)
        meta['poses']['DEFAULT']['pose']['default'][k] = new_meta['poses']['DEFAULT']['pose']['default'][k]
    return meta

print("\nWorseVRM v1.1 loaded")

RESET = False
meta = initialize_meta() if RESET else get_meta()
print("Metafile Created")

POSENAME = None
PROGRESS = 'default'; # 0 ~ 1 or default
ACCESSORIES = None
EXPRESSION = ["x", "x", None]
if not RESET and POSENAME != None:
    meta['poses'][POSENAME] = make_new_pose(meta, POSENAME, PROGRESS, ACCESSORIES, EXPRESSION)
    print("Created new pose " + POSENAME)
if not RESET and POSENAME == None:
    meta = reset_and_sync(meta)

with open(bpy.path.abspath('//' + OUTPUT_FNAME), 'w', encoding='utf-8') as f:
    f.write(json.dumps(meta))
print("Metafile Written to Disk")

print("Execution Successful\n")