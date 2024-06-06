import * as THREE from "three"
// @ts-ignore
import OctreeCSG from "./csg/OctreeCSG"
import {BufferGeometry} from "three/src/core/BufferGeometry"


type CSGFunction = "union" | "subtract" | "intersect"

/**
 *
 * @param mesh1
 * @param mesh2
 * @param func CSGFunction: "union" | "subtract" | "intersect"
 */
export function calc (mesh1: THREE.Mesh, mesh2: THREE.Mesh, func: CSGFunction):BufferGeometry {
    const mesh1Octree = OctreeCSG.fromMesh(mesh1)
    const mesh2Octree = OctreeCSG.fromMesh(mesh2)

    const resultOctree = OctreeCSG[func](mesh1Octree, mesh2Octree, false)

    return OctreeCSG.toGeometry(resultOctree)
}