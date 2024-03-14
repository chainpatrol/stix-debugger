import Elk from "elkjs";
import { Edge, MarkerType, Node } from "reactflow";

import { StixBundle } from "./stix";

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "force",
  },
});

export async function convertBundleToGraph(bundle: StixBundle) {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  for (const object of bundle.objects) {
    if (object.type === "relationship") {
      edges.push({
        id: object.id,
        type: "custom",
        source: object.source_ref,
        target: object.target_ref,
        label: object.relationship_type.replace("-", " "),
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "black",
        },
      });
    } else {
      nodes.push({
        id: object.id,
        type: "custom",
        position: { x: 0, y: 0 },
        data: { label: object.name ?? object.id, type: object.type },
      });
    }
  }

  const newGraph = await elk.layout({
    id: "root",
    children: nodes.map((node) => ({
      id: node.id,
      width: 100,
      height: 50,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  });

  for (const node of nodes) {
    const layoutNode = newGraph.children?.find((n) => n.id === node.id);
    if (layoutNode) {
      node.position = {
        x: layoutNode.x ?? node.position.x,
        y: layoutNode.y ?? node.position.y,
      };
    }
  }

  return {
    nodes,
    edges,
  };
}
