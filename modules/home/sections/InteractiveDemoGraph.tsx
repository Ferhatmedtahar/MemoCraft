"use client";
import { useEffect, useRef, useState } from "react";

import * as d3 from "d3";

interface DemoNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  category: string;
  content: string;
  created_at: string;
  is_pinned: boolean;
  is_favorite: boolean;
}

interface DemoLink {
  source: string;
  target: string;
  relationship: string;
}

// Category colors for different content types
const categoryColors: Record<string, string> = {
  Notes: "#10b981",
  Atoms: "#3b82f6",
  Flashcards: "#8b5cf6",
  "Uncategorized Notes": "#6b7280",
  "Uncategorized Atoms": "#94a3b8",
  Folders: "#f59e0b",
};

// Demo data
const demoNodes = [
  {
    id: "1",
    name: "Machine Learning",
    type: "folder",
    category: "Folders",
    content: "",
    created_at: "2024-01-01",
    is_pinned: true,
    is_favorite: false,
  },
  {
    id: "2",
    name: "Neural Networks",
    type: "note",
    category: "Notes",
    content: "Deep learning fundamentals and architectures...",
    created_at: "2024-01-02",
    is_pinned: false,
    is_favorite: true,
  },
  {
    id: "3",
    name: "Backpropagation",
    type: "atom",
    category: "Atoms",
    content: "The algorithm for training neural networks...",
    created_at: "2024-01-03",
    is_pinned: false,
    is_favorite: false,
  },
  {
    id: "4",
    name: "Gradient Descent",
    type: "flashcard",
    category: "Flashcards",
    content: "Q: What is gradient descent? A: An optimization algorithm...",
    created_at: "2024-01-04",
    is_pinned: false,
    is_favorite: false,
  },
  {
    id: "5",
    name: "Python Programming",
    type: "folder",
    category: "Folders",
    content: "",
    created_at: "2024-01-05",
    is_pinned: false,
    is_favorite: false,
  },
  {
    id: "6",
    name: "Data Structures",
    type: "note",
    category: "Notes",
    content: "Arrays, linked lists, trees, and graphs...",
    created_at: "2024-01-06",
    is_pinned: false,
    is_favorite: false,
  },
  {
    id: "7",
    name: "Binary Search",
    type: "atom",
    category: "Atoms",
    content: "Efficient searching algorithm for sorted arrays...",
    created_at: "2024-01-07",
    is_pinned: false,
    is_favorite: true,
  },
  {
    id: "8",
    name: "Time Complexity",
    type: "flashcard",
    category: "Flashcards",
    content: "Q: What is O(log n)? A: Logarithmic time complexity...",
    created_at: "2024-01-08",
    is_pinned: false,
    is_favorite: false,
  },
  {
    id: "9",
    name: "Algorithms",
    type: "note",
    category: "Notes",
    content: "Sorting, searching, and optimization algorithms...",
    created_at: "2024-01-09",
    is_pinned: true,
    is_favorite: false,
  },
  {
    id: "10",
    name: "Recursion",
    type: "atom",
    category: "Atoms",
    content: "Function that calls itself to solve problems...",
    created_at: "2024-01-10",
    is_pinned: false,
    is_favorite: false,
  },
  {
    id: "11",
    name: "Dynamic Programming",
    type: "note",
    category: "Notes",
    content: "Optimization technique using memoization...",
    created_at: "2024-01-11",
    is_pinned: false,
    is_favorite: true,
  },
  {
    id: "12",
    name: "Fibonacci",
    type: "flashcard",
    category: "Flashcards",
    content: "Q: F(n) = ? A: F(n-1) + F(n-2)",
    created_at: "2024-01-12",
    is_pinned: false,
    is_favorite: false,
  },
];

const demoLinks = [
  { source: "1", target: "2", relationship: "contains" },
  { source: "1", target: "3", relationship: "contains" },
  { source: "2", target: "3", relationship: "related" },
  { source: "3", target: "4", relationship: "related" },
  { source: "5", target: "6", relationship: "contains" },
  { source: "5", target: "9", relationship: "contains" },
  { source: "6", target: "7", relationship: "related" },
  { source: "7", target: "8", relationship: "related" },
  { source: "9", target: "10", relationship: "related" },
  { source: "9", target: "11", relationship: "related" },
  { source: "10", target: "11", relationship: "related" },
  { source: "11", target: "12", relationship: "related" },
  { source: "2", target: "9", relationship: "related" },
];

function InteractiveDemoGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<DemoNode, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;

    // Create container group for zoom/pan
    const container = svg.append("g");

    // Setup zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Clone the data to avoid D3 mutating the original arrays
    const simulationNodes = demoNodes.map((d) => ({ ...d })) as DemoNode[];
    const simulationLinks = demoLinks.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(simulationNodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d: any) => d.id)
          .distance((d) => {
            if (d.relationship === "contains") return 80;
            return 120;
          })
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    simulationRef.current = simulation as any;

    // Links
    const link = container
      .append("g")
      .selectAll("line")
      .data(simulationLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        if (d.relationship === "contains") return "#10b981";
        return "#374151";
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => {
        if (d.relationship === "contains") return 3;
        return 2;
      });

    // Node groups
    const node = container
      .append("g")
      .selectAll("g")
      .data(simulationNodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, DemoNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    const nodeCircles = node
      .append("circle")
      .attr("r", (d) => {
        switch (d.type) {
          case "folder":
            return 18;
          case "flashcard_deck":
            return 16;
          case "note":
            return 14;
          case "flashcard":
            return 10;
          case "atom":
            return 12;
          default:
            return 12;
        }
      })
      .attr("fill", (d) => categoryColors[d.category] || "#6b7280")
      .attr("stroke", (d) => {
        if (d.is_pinned) return "#fbbf24";
        if (d.is_favorite) return "#ef4444";
        return "#1f2937";
      })
      .attr("stroke-width", (d) => {
        if (d.is_pinned || d.is_favorite) return 3;
        return 2;
      })
      .attr("opacity", 0.9);

    // Node labels
    const nodeLabels = node
      .append("text")
      .text((d) =>
        d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name
      )
      .attr("x", (d) => {
        switch (d.type) {
          case "folder":
            return 22;
          case "flashcard_deck":
            return 20;
          case "note":
            return 18;
          case "flashcard":
            return 14;
          case "atom":
            return 16;
          default:
            return 16;
        }
      })
      .attr("y", 4)
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "14px");

    // Mouse events
    let hoverTimeout: NodeJS.Timeout;

    const updateVisualization = (hoveredNodeId: string | null) => {
      if (hoveredNodeId) {
        const connectedNodes = new Set();

        simulationLinks.forEach((link: any) => {
          const sourceId =
            typeof link.source === "object" && link.source !== null
              ? (link.source as any).id
              : link.source;
          const targetId =
            typeof link.target === "object" && link.target !== null
              ? (link.target as any).id
              : link.target;

          if (sourceId === hoveredNodeId || targetId === hoveredNodeId) {
            connectedNodes.add(sourceId);
            connectedNodes.add(targetId);
          }
        });

        nodeCircles
          .attr("fill", (d) => {
            if (d.id === hoveredNodeId) return "#3b82f6";
            if (connectedNodes.has(d.id))
              return categoryColors[d.category] || "#6b7280";
            return "#374151";
          })
          .attr("opacity", (d) => {
            if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return 1;
            return 0.3;
          });

        nodeLabels
          .attr("fill", (d) => {
            if (d.id === hoveredNodeId || connectedNodes.has(d.id))
              return "#e5e7eb";
            return "#6b7280";
          })
          .attr("opacity", (d) => {
            if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return 1;
            return 0.3;
          });

        link
          .attr("stroke", (d: any) => {
            const sourceId =
              typeof d.source === "object" && d.source !== null
                ? (d.source as any).id
                : d.source;
            const targetId =
              typeof d.target === "object" && d.target !== null
                ? (d.target as any).id
                : d.target;

            if (sourceId === hoveredNodeId || targetId === hoveredNodeId) {
              return d.relationship === "contains" ? "#10b981" : "#3b82f6";
            }
            return "#374151";
          })
          .attr("stroke-width", (d: any) => {
            const sourceId =
              typeof d.source === "object" && d.source !== null
                ? (d.source as any).id
                : d.source;
            const targetId =
              typeof d.target === "object" && d.target !== null
                ? (d.target as any).id
                : d.target;

            if (sourceId === hoveredNodeId || targetId === hoveredNodeId) {
              return d.relationship === "contains" ? 4 : 3;
            }
            return d.relationship === "contains" ? 3 : 1;
          })
          .attr("opacity", (d: any) => {
            const sourceId =
              typeof d.source === "object" && d.source !== null
                ? (d.source as any).id
                : d.source;
            const targetId =
              typeof d.target === "object" && d.target !== null
                ? (d.target as any).id
                : d.target;

            if (sourceId === hoveredNodeId || targetId === hoveredNodeId)
              return 1;
            return 0.2;
          });
      } else {
        // Reset to default
        nodeCircles
          .attr("fill", (d) => categoryColors[d.category] || "#6b7280")
          .attr("opacity", 0.9);

        nodeLabels.attr("fill", "#e5e7eb").attr("opacity", 1);

        link
          .attr("stroke", (d) => {
            if (d.relationship === "contains") return "#10b981";
            return "#374151";
          })
          .attr("stroke-width", (d) => {
            if (d.relationship === "contains") return 3;
            return 2;
          })
          .attr("opacity", 0.6);
      }
    };

    node
      .on("mouseenter", (event, d) => {
        clearTimeout(hoverTimeout);
        setHoveredNode(d.id);
        updateVisualization(d.id);
      })
      .on("mouseleave", () => {
        hoverTimeout = setTimeout(() => {
          setHoveredNode(null);
          updateVisualization(null);
        }, 100);
      });

    svg.on("click", (event) => {
      if (event.target === svg.node()) {
        clearTimeout(hoverTimeout);
        setHoveredNode(null);
        updateVisualization(null);
      }
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Auto-animate the graph initially
    setTimeout(() => {
      simulation.alpha(0.3).restart();
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(hoverTimeout);
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="mb-8">
      <div className="bg-card border border-border  p-4 shadow-xl">
        <div className="bg-secondary border border-border  overflow-hidden ">
          <svg
            ref={svgRef}
            width="100%"
            height="400"
            viewBox="0 0 800 400"
            className="block "
            style={{ touchAction: "manipulation" }}
          />
        </div>
      </div>
    </div>
  );
}

export default InteractiveDemoGraph;
