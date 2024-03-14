import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  BaseEdge,
  ConnectionMode,
  Controls,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  Handle,
  MiniMap,
  Node,
  NodeProps,
  Position,
  getSmoothStepPath,
  internalsSymbol,
  useEdgesState,
  useNodesState,
  useStore,
} from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function Graph({
  nodes: initialNodes = [],
  edges: initialEdges = [],
}: {
  nodes?: Node[];
  edges?: Edge[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      fitViewOptions={{ padding: 0.1 }}
      connectionMode={ConnectionMode.Loose}>
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
    </ReactFlow>
  );
}

type NodeData = {
  label: string;
  type:
    | "indicator"
    | "malware"
    | "threat-actor"
    | "report"
    | "marking-definition"
    | "campaign"
    | "identity"
    | "course-of-action"
    | "infrastructure"
    | "ipv4-addr"
    | "domain-name"
    | "url"
    | "attack-pattern"
    | "intrusion-set"
    | "tool"
    | "vulnerability"
    | "file"
    | "malware-analysis";
};

function CustomNode({ id, data, selected, dragging }: NodeProps<NodeData>) {
  const { label, color } = (() => {
    switch (data.type) {
      case "indicator":
        return {
          label: "IN",
          color: "#407EFB",
        };
      case "malware":
        return {
          label: "MA",
          color: "#FB5640",
        };
      case "threat-actor":
        return {
          label: "TA",
          color: "#FBBC40",
        };
      case "report":
        return {
          label: "RE",
          color: "#888",
        };
      case "marking-definition":
        return {
          label: "MD",
          color: "#888",
        };
      case "campaign":
        return {
          label: "CA",
          color: "#e54dce",
        };
      case "identity":
        return {
          label: "ID",
          color: "#e54dce",
        };
      case "course-of-action":
        return {
          label: "CO",
          color: "#e54dce",
        };
      case "attack-pattern":
        return {
          label: "AP",
          color: "#e54dce",
        };
      case "infrastructure":
        return {
          label: "IN",
          color: "#25a6b2",
        };
      case "ipv4-addr":
        return {
          label: "IP",
          color: "#25a6b2",
        };
      case "domain-name":
        return {
          label: "DN",
          color: "#25a6b2",
        };
      case "file":
        return {
          label: "FI",
          color: "#25a6b2",
        };
      case "url":
        return {
          label: "UR",
          color: "#25a6b2",
        };
      case "intrusion-set":
        return {
          label: "IS",
          color: "#25a6b2",
        };
      case "tool":
        return {
          label: "TO",
          color: "#25a6b2",
        };
      case "malware-analysis":
        return {
          label: "AN",
          color: "#25a6b2",
        };
      case "vulnerability":
        return {
          label: "VN",
          color: "#FB5640",
        };

      default:
        return {
          label: "??",
          color: "black",
        };
    }
  })();

  return (
    <>
      <div
        id={id}
        style={{
          background: "white",
          color: "black",
          borderRadius: "4px",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: selected ? color : "black",
          textAlign: "center",
          fontSize: "12px",
          padding: "4px 12px 4px 2px",
          fontFamily: "monospace",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "4px",
          opacity: dragging ? 0.5 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}>
        <div
          style={{
            transform: "rotate(-90deg)",
            background: color,
            color: "white",
            padding: "0 4px",
            borderRadius: "2px",
            fontSize: "8px",
          }}>
          {label}
        </div>
        <div>{data.label}</div>
      </div>

      <Handle type="source" position={Position.Top} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Left} id="d" />
    </>
  );
}

function CustomEdge({ id, label, source, target, ...props }: EdgeProps) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
    borderRadius: 16,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        {...props}
        style={{
          stroke: props.selected ? "#407EFB" : "black",
          strokeWidth: 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            padding: "2px 8px",
            fontSize: "10px",
            fontWeight: 500,
            background: props.selected ? "#407EFB" : "black",
            color: "white",
            borderRadius: "2px",
          }}
          className="nodrag nopan">
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

// returns the position (top,right,bottom or right) passed node compared to
function getParams(nodeA: Node, nodeB: Node): [number, number, Position] {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position: Position;

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getHandleCoordsByPosition(nodeA, position);
  return [x, y, position];
}

function getHandleCoordsByPosition(
  node: Node,
  handlePosition: Position,
): [number, number] {
  // all handles are from type source, that's why we use handleBounds.source here
  const handle = node[internalsSymbol]?.handleBounds?.source?.find(
    (h) => h.position === handlePosition,
  );

  if (!handle) {
    return [0, 0];
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
  }

  if (!node.positionAbsolute) {
    return [0, 0];
  }

  const x = node.positionAbsolute.x + handle.x + offsetX;
  const y = node.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

function getNodeCenter(node: Node): {
  x: number;
  y: number;
} {
  if (!node.positionAbsolute) {
    return { x: 0, y: 0 };
  }

  if (!node.width || !node.height) {
    return { x: node.positionAbsolute.x, y: node.positionAbsolute.y };
  }

  return {
    x: node.positionAbsolute.x + node.width / 2,
    y: node.positionAbsolute.y + node.height / 2,
  };
}
// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge

function getEdgeParams(source: Node, target: Node) {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
