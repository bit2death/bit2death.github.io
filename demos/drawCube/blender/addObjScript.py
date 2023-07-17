import bpy

# ONLY USE THIS FOR TRIS, QUADS DON'T WORK

current_obj = bpy.context.active_object  
verts_local = [v.co for v in current_obj.data.vertices.values()]
verts_world = [current_obj.matrix_world @ v_local for v_local in verts_local]

text = "[[\n"
for i, vert in enumerate(verts_world):
    text = text + "\n" + ("[{v[0]}, {v[1]}, {v[2]}],".format(i=i, v=vert))
text = text.rstrip(text[-1]) + "\n], \n["

for i, face in enumerate(current_obj.data.polygons):
    verts_indices = face.vertices[:]
    text = text + "\n" + ("{v_i},".format(i=i, v_i=verts_indices)).replace("(", "[").replace(")", "]")
text = text.rstrip(text[-1]) + "\n]]"
print(text)
f = open("C:\tmp\coords.json", "x")
f.write(text)
f.close()