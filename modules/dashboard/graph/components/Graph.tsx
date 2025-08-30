// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, } from "@/components/ui/card";
// import {
//   Dialog,

// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { fetchKnowledgeGraphData, KnowledgeNode, KnowledgeLink } from "../data/graph.actions";
// import * as d3 from "d3";
// import { RotateCcw, X, ZoomIn, ZoomOut, FileText, Lightbulb, CreditCard, Folder } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// // Category colors for different content types
// const categoryColors: Record<string, string> = {
//   Notes: "#10b981",
//   Atoms: "#3b82f6",
//   Flashcards: "#8b5cf6",
//   "Uncategorized Notes": "#6b7280",
//   "Uncategorized Atoms": "#94a3b8",
//   Folders: "#f59e0b",
// };

// // Node type icons
// const getNodeIcon = (type: string) => {
//   switch (type) {
//     case "note": return FileText;
//     case "atom": return Lightbulb;
//     case "flashcard": return CreditCard;
//     case "folder": return Folder;
//     default: return FileText;
//   }
// };

// export default function KnowledgeGraph() {
//   const router = useRouter();
//   const svgRef = useRef<SVGSVGElement>(null);
//   const [hoveredNode, setHoveredNode] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showTagModal, setShowTagModal] = useState(false);
//   const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [showLegend, setShowLegend] = useState(true);

//   // Data states
//   const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
//   const [links, setLinks] = useState<KnowledgeLink[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stats, setStats] = useState({
//     totalNotes: 0,
//     totalAtoms: 0,
//     totalFlashcards: 0,
//     totalFolders: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   // Load data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const graphData = await fetchKnowledgeGraphData();
//         setNodes(graphData.nodes);
//         setLinks(graphData.links);
//         setCategories(graphData.categories);
//         setStats(graphData.stats);
//       } catch (error) {
//         console.error("Failed to load knowledge graph data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Debounced search
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // D3 visualization effect
//   useEffect(() => {
//     if (!svgRef.current || nodes.length === 0 || loading) return;

//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = 1200;
//     const height = 800;

//     // Filter data based on category and search
//     const getFilteredData = () => {
//       let filteredNodes = nodes;

//       // Apply category filter
//       if (selectedCategory !== "All") {
//         filteredNodes = nodes.filter(node =>
//           node.category === selectedCategory ||
//           (node.type === "folder" && (
//             (selectedCategory === "Notes" && node.category.includes("Notes")) ||
//             (selectedCategory === "Atoms" && node.category.includes("Atoms"))
//           ))
//         );
//       }

//       // Apply search filter
//       if (debouncedSearchTerm) {
//         filteredNodes = filteredNodes.filter(node =>
//           node.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//           (node.content && node.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
//         );
//       }

//       const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
//       const filteredLinks = links.filter(link =>
//         filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
//       );

//       return { nodes: filteredNodes, links: filteredLinks };
//     };

//     const { nodes: filteredNodes, links: filteredLinks } = getFilteredData();

//     // Create force simulation
//     const simulation = d3
//       .forceSimulation(filteredNodes as d3.SimulationNodeDatum[])
//       .force(
//         "link",
//         d3
//           .forceLink(filteredLinks)
//           .id((d: any) => d.id)
//           .distance(150)
//       )
//       .force("charge", d3.forceManyBody().strength(-500))
//       .force("center", d3.forceCenter(width / 2, height / 2))
//       .force("collision", d3.forceCollide().radius(40));

//     const container = svg.append("g");

//     // Zoom behavior
//     const zoom = d3
//       .zoom<SVGSVGElement, unknown>()
//       .scaleExtent([0.1, 4])
//       .on("zoom", (event) => {
//         container.attr("transform", event.transform);
//       });

//     svg.call(zoom);

//     // Links
//     const link = container
//       .append("g")
//       .selectAll("line")
//       .data(filteredLinks)
//       .enter()
//       .append("line")
//       .attr("stroke", "#374151")
//       .attr("stroke-opacity", 0.6)
//       .attr("stroke-width", 2);

//     // Node groups
//     const node = container
//       .append("g")
//       .selectAll("g")
//       .data(filteredNodes)
//       .enter()
//       .append("g")
//       .style("cursor", "pointer")
//       .call(
//         d3
//           .drag<SVGGElement, KnowledgeNode>()
//           .on("start", (event, d) => {
//             if (!event.active) simulation.alphaTarget(0.3).restart();
//             d.fx = d.x;
//             d.fy = d.y;
//           })
//           .on("drag", (event, d) => {
//             d.fx = event.x;
//             d.fy = event.y;
//           })
//           .on("end", (event, d) => {
//             if (!event.active) simulation.alphaTarget(0);
//             d.fx = null;
//             d.fy = null;
//           })
//       );

//     // Node circles with different sizes for different types
//     const nodeCircles = node
//       .append("circle")
//       .attr("r", (d: KnowledgeNode) => {
//         switch (d.type) {
//           case "folder": return 18;
//           case "note": return 14;
//           case "atom": return 12;
//           case "flashcard": return 16;
//           default: return 12;
//         }
//       })
//       .attr("fill", (d: KnowledgeNode) => categoryColors[d.category] || "#6b7280")
//       .attr("stroke", (d: KnowledgeNode) => {
//         if (d.is_pinned) return "#fbbf24";
//         if (d.is_favorite) return "#ef4444";
//         return "#1f2937";
//       })
//       .attr("stroke-width", (d: KnowledgeNode) => {
//         if (d.is_pinned || d.is_favorite) return 3;
//         return 2;
//       })
//       .attr("opacity", 0.9);

//     // Node labels
//     const nodeLabels = node
//       .append("text")
//       .text((d: KnowledgeNode) => d.name.length > 20 ? d.name.substring(0, 20) + "..." : d.name)
//       .attr("x", 20)
//       .attr("y", 4)
//       .attr("font-family", "system-ui, sans-serif")
//       .attr("font-size", "11px")
//       .attr("fill", "#e5e7eb");

//     // Mouse events
//     let hoverTimeout: NodeJS.Timeout;

//     const updateVisualization = (hoveredNodeId: string | null) => {
//       if (hoveredNodeId) {
//         const connectedNodes = new Set<string>();
//         filteredLinks.forEach((link) => {
//           if (link.source === hoveredNodeId || link.target === hoveredNodeId) {
//             connectedNodes.add(link.source);
//             connectedNodes.add(link.target);
//           }
//         });

//         nodeCircles
//           .attr("fill", (d: KnowledgeNode) => {
//             if (d.id === hoveredNodeId) return "#3b82f6";
//             if (connectedNodes.has(d.id)) return categoryColors[d.category] || "#6b7280";
//             return "#374151";
//           })
//           .attr("opacity", (d: KnowledgeNode) => {
//             if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return 1;
//             return 0.3;
//           });

//         nodeLabels
//           .attr("fill", (d: KnowledgeNode) => {
//             if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return "#e5e7eb";
//             return "#6b7280";
//           })
//           .attr("opacity", (d: KnowledgeNode) => {
//             if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return 1;
//             return 0.3;
//           });

//         link
//           .attr("stroke", (d: KnowledgeLink) => {
//             if (d.source === hoveredNodeId || d.target === hoveredNodeId) return "#3b82f6";
//             return "#374151";
//           })
//           .attr("stroke-width", (d: KnowledgeLink) => {
//             if (d.source === hoveredNodeId || d.target === hoveredNodeId) return 3;
//             return 1;
//           })
//           .attr("opacity", (d: KnowledgeLink) => {
//             if (d.source === hoveredNodeId || d.target === hoveredNodeId) return 1;
//             return 0.2;
//           });
//       } else {
//         // Reset to default
//         nodeCircles
//           .attr("fill", (d: KnowledgeNode) => categoryColors[d.category] || "#6b7280")
//           .attr("opacity", 0.9);

//         nodeLabels
//           .attr("fill", "#e5e7eb")
//           .attr("opacity", 1);

//         link
//           .attr("stroke", "#374151")
//           .attr("stroke-width", 2)
//           .attr("opacity", 0.6);
//       }
//     };

//     node
//       .on("mouseenter", (event, d) => {
//         clearTimeout(hoverTimeout);
//         setHoveredNode(d.id);
//         updateVisualization(d.id);
//       })
//       .on("mouseleave", () => {
//         hoverTimeout = setTimeout(() => {
//           setHoveredNode(null);
//           updateVisualization(null);
//         }, 100);
//       })
//       .on("click", (event, d) => {
//         event.stopPropagation();
//         setSelectedNode(d);
//         setShowTagModal(true);
//       });

//     svg.on("click", () => {
//       clearTimeout(hoverTimeout);
//       setHoveredNode(null);
//       updateVisualization(null);
//     });

//     simulation.on("tick", () => {
//       link
//         .attr("x1", (d: any) => d.source.x)
//         .attr("y1", (d: any) => d.source.y)
//         .attr("x2", (d: any) => d.target.x)
//         .attr("y2", (d: any) => d.target.y);

//       node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
//     });

//     // Store zoom functions
//     const zoomIn = () => svg.transition().call(zoom.scaleBy, 1.5);
//     const zoomOut = () => svg.transition().call(zoom.scaleBy, 1 / 1.5);
//     const resetZoom = () => svg.transition().call(zoom.transform, d3.zoomIdentity);
//     (svg.node() as any).__zoomIn = zoomIn;
//     (svg.node() as any).__zoomOut = zoomOut;
//     (svg.node() as any).__resetZoom = resetZoom;

//     return () => clearTimeout(hoverTimeout);
//   }, [selectedCategory, debouncedSearchTerm, nodes, links, loading]);

//   const handleZoomIn = () => {
//     const svg = svgRef.current;
//     if (svg && (svg as any).__zoomIn) (svg as any).__zoomIn();
//   };

//   const handleZoomOut = () => {
//     const svg = svgRef.current;
//     if (svg && (svg as any).__zoomOut) (svg as any).__zoomOut();
//   };

//   const handleResetZoom = () => {
//     const svg = svgRef.current;
//     if (svg && (svg as any).__resetZoom) (svg as any).__resetZoom();
//   };

//   const hoveredNodeData = hoveredNode ? nodes.find((n) => n.id === hoveredNode) : null;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white overflow-hidden p-4">
//         <div className="max-w-7xl mx-auto pt-16">
//           <div className="flex items-center justify-center h-96">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-400">Loading your knowledge graph...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as d3 from "d3";
import {
  CreditCard,
  FileText,
  Folder,
  Lightbulb,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  fetchKnowledgeGraphData,
  KnowledgeLink,
  KnowledgeNode,
} from "../data/graph.actions";

// Category colors for different content types
const categoryColors: Record<string, string> = {
  Notes: "#10b981",
  Atoms: "#3b82f6",
  Flashcards: "#8b5cf6",
  "Uncategorized Notes": "#6b7280",
  "Uncategorized Atoms": "#94a3b8",
  Folders: "#f59e0b",
};

// Node type icons
const getNodeIcon = (type: string) => {
  switch (type) {
    case "note":
      return FileText;
    case "atom":
      return Lightbulb;
    case "flashcard":
      return CreditCard;
    case "folder":
      return Folder;
    default:
      return FileText;
  }
};

export default function KnowledgeGraph() {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  // Data states
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [links, setLinks] = useState<KnowledgeLink[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalAtoms: 0,
    totalFlashcards: 0,
    totalFolders: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const graphData = await fetchKnowledgeGraphData();
        setNodes(graphData.nodes);
        setLinks(graphData.links);
        setCategories(graphData.categories);
        setStats(graphData.stats);
      } catch (error) {
        console.error("Failed to load knowledge graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // D3 visualization effect
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0 || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 800;

    // Filter data based on category and search
    const getFilteredData = () => {
      let filteredNodes = nodes;

      // Apply category filter
      if (selectedCategory !== "All") {
        filteredNodes = nodes.filter(
          (node) =>
            node.category === selectedCategory ||
            (node.type === "folder" &&
              ((selectedCategory === "Notes" &&
                node.category.includes("Notes")) ||
                (selectedCategory === "Atoms" &&
                  node.category.includes("Atoms"))))
        );
      }

      // Apply search filter
      if (debouncedSearchTerm) {
        filteredNodes = filteredNodes.filter(
          (node) =>
            node.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            (node.content &&
              node.content
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()))
        );
      }

      const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
      const filteredLinks = links.filter(
        (link) =>
          filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
      );

      return { nodes: filteredNodes, links: filteredLinks };
    };

    const { nodes: filteredNodes, links: filteredLinks } = getFilteredData();

    // Create force simulation
    const simulation = d3
      .forceSimulation(filteredNodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(filteredLinks)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    const container = svg.append("g");

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Links
    const link = container
      .append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#374151")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Node groups
    const node = container
      .append("g")
      .selectAll("g")
      .data(filteredNodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, KnowledgeNode>()
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

    // Node circles with different sizes for different types
    const nodeCircles = node
      .append("circle")
      .attr("r", (d: KnowledgeNode) => {
        switch (d.type) {
          case "folder":
            return 18;
          case "note":
            return 14;
          case "atom":
            return 12;
          case "flashcard":
            return 16;
          default:
            return 12;
        }
      })
      .attr(
        "fill",
        (d: KnowledgeNode) => categoryColors[d.category] || "#6b7280"
      )
      .attr("stroke", (d: KnowledgeNode) => {
        if (d.is_pinned) return "#fbbf24";
        if (d.is_favorite) return "#ef4444";
        return "#1f2937";
      })
      .attr("stroke-width", (d: KnowledgeNode) => {
        if (d.is_pinned || d.is_favorite) return 3;
        return 2;
      })
      .attr("opacity", 0.9);

    // Node labels
    const nodeLabels = node
      .append("text")
      .text((d: KnowledgeNode) =>
        d.name.length > 20 ? d.name.substring(0, 20) + "..." : d.name
      )
      .attr("x", 20)
      .attr("y", 4)
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "#e5e7eb");

    // Mouse events
    let hoverTimeout: NodeJS.Timeout;

    const updateVisualization = (hoveredNodeId: string | null) => {
      if (hoveredNodeId) {
        const connectedNodes = new Set<string>();
        filteredLinks.forEach((link) => {
          if (link.source === hoveredNodeId || link.target === hoveredNodeId) {
            connectedNodes.add(link.source);
            connectedNodes.add(link.target);
          }
        });

        nodeCircles
          .attr("fill", (d: KnowledgeNode) => {
            if (d.id === hoveredNodeId) return "#3b82f6";
            if (connectedNodes.has(d.id))
              return categoryColors[d.category] || "#6b7280";
            return "#374151";
          })
          .attr("opacity", (d: KnowledgeNode) => {
            if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return 1;
            return 0.3;
          });

        nodeLabels
          .attr("fill", (d: KnowledgeNode) => {
            if (d.id === hoveredNodeId || connectedNodes.has(d.id))
              return "#e5e7eb";
            return "#6b7280";
          })
          .attr("opacity", (d: KnowledgeNode) => {
            if (d.id === hoveredNodeId || connectedNodes.has(d.id)) return 1;
            return 0.3;
          });

        link
          .attr("stroke", (d: KnowledgeLink) => {
            if (d.source === hoveredNodeId || d.target === hoveredNodeId)
              return "#3b82f6";
            return "#374151";
          })
          .attr("stroke-width", (d: KnowledgeLink) => {
            if (d.source === hoveredNodeId || d.target === hoveredNodeId)
              return 3;
            return 1;
          })
          .attr("opacity", (d: KnowledgeLink) => {
            if (d.source === hoveredNodeId || d.target === hoveredNodeId)
              return 1;
            return 0.2;
          });
      } else {
        // Reset to default
        nodeCircles
          .attr(
            "fill",
            (d: KnowledgeNode) => categoryColors[d.category] || "#6b7280"
          )
          .attr("opacity", 0.9);

        nodeLabels.attr("fill", "#e5e7eb").attr("opacity", 1);

        link
          .attr("stroke", "#374151")
          .attr("stroke-width", 2)
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
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        setShowTagModal(true);
      });

    svg.on("click", () => {
      clearTimeout(hoverTimeout);
      setHoveredNode(null);
      updateVisualization(null);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Store zoom functions
    const zoomIn = () => svg.transition().call(zoom.scaleBy, 1.5);
    const zoomOut = () => svg.transition().call(zoom.scaleBy, 1 / 1.5);
    const resetZoom = () =>
      svg.transition().call(zoom.transform, d3.zoomIdentity);
    (svg.node() as any).__zoomIn = zoomIn;
    (svg.node() as any).__zoomOut = zoomOut;
    (svg.node() as any).__resetZoom = resetZoom;

    return () => clearTimeout(hoverTimeout);
  }, [selectedCategory, debouncedSearchTerm, nodes, links, loading]);

  const handleZoomIn = () => {
    const svg = svgRef.current;
    if (svg && (svg as any).__zoomIn) (svg as any).__zoomIn();
  };

  const handleZoomOut = () => {
    const svg = svgRef.current;
    if (svg && (svg as any).__zoomOut) (svg as any).__zoomOut();
  };

  const handleResetZoom = () => {
    const svg = svgRef.current;
    if (svg && (svg as any).__resetZoom) (svg as any).__resetZoom();
  };

  const hoveredNodeData = hoveredNode
    ? nodes.find((n) => n.id === hoveredNode)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden p-4">
        <div className="max-w-7xl mx-auto pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your knowledge graph...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden p-4">
      <div className="max-w-7xl mx-auto pt-16">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-center lg:text-left">
            Knowledge Graph
            <span className="ml-2 inline-block rounded-full border border-blue-500 px-2 py-0.5 text-xs font-medium text-blue-200 align-middle">
              Beta
            </span>
          </h1>
          <p className="text-gray-300 text-center lg:text-left">
            Visualize connections between your notes, atoms, and flashcards
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search your knowledge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-base px-4 pr-10 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category filters and controls */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 rounded-lg text-sm font-medium transition-all
                    ${
                      selectedCategory === category
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700"
                    }
                  `}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Zoom controls */}
            <div className="flex gap-2">
              <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLegend(!showLegend)}
                className="text-gray-300 border-gray-600"
              >
                {showLegend ? "Hide" : "Show"} Legend
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main graph */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700">
              <Card.Content className="p-0">
                <div className="relative overflow-hidden rounded-lg">
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="600"
                    viewBox="0 0 1200 800"
                    className="bg-gray-900/50 h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
                    style={{ touchAction: "manipulation" }}
                  />

                  {showInstructions && (
                    <div className="absolute top-4 left-4 bg-gray-800/90 border border-gray-600 rounded-xl p-3 text-sm max-w-80">
                      <div className="flex justify-between items-start gap-2">
                        <ul className="space-y-1 text-gray-200">
                          <li>• Hover to highlight connections</li>
                          <li>• Click nodes to view details</li>
                          <li>• Drag to move nodes around</li>
                          <li>• Scroll or pinch to zoom</li>
                        </ul>
                        <button
                          onClick={() => setShowInstructions(false)}
                          className="text-gray-400 hover:text-gray-200 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Legend */}
            {showLegend && (
              <Card className="bg-gray-800 border-gray-700">
                <Card.Header>
                  <Card.Title className="text-lg">Legend</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-2">
                      Node Types
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-300">Folders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-300">Notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-300">Atoms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-300">
                          Flashcards
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-2">
                      Categories
                    </p>
                    <div className="space-y-2">
                      {Object.entries(categoryColors).map(
                        ([category, color]) => (
                          <div
                            key={category}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-300">
                              {category}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-200 mb-2">
                      Indicators
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-yellow-400" />
                        <span className="text-xs text-gray-300">
                          Pinned items
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-red-400" />
                        <span className="text-xs text-gray-300">
                          Favorite items
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )}

            {/* Node Info */}
            <Card className="bg-gray-800 border-gray-700">
              <Card.Header>
                <Card.Title className="text-lg">
                  {hoveredNodeData
                    ? `${
                        hoveredNodeData.type.charAt(0).toUpperCase() +
                        hoveredNodeData.type.slice(1)
                      } Info`
                    : "Node Info"}
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                {hoveredNodeData ? (
                  <>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {hoveredNodeData.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge
                          variant="default"
                          style={{
                            backgroundColor:
                              (categoryColors[hoveredNodeData.category] ||
                                "#6b7280") + "20",
                            color:
                              categoryColors[hoveredNodeData.category] ||
                              "#6b7280",
                            border: `1px solid ${
                              categoryColors[hoveredNodeData.category] ||
                              "#6b7280"
                            }40`,
                          }}
                        >
                          {hoveredNodeData.category}
                        </Badge>
                        {hoveredNodeData.is_pinned && (
                          <Badge
                            variant="outline"
                            className="text-yellow-400 border-yellow-400"
                          >
                            Pinned
                          </Badge>
                        )}
                        {hoveredNodeData.is_favorite && (
                          <Badge
                            variant="outline"
                            className="text-red-400 border-red-400"
                          >
                            Favorite
                          </Badge>
                        )}
                      </div>
                    </div>

                    {hoveredNodeData.content && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Preview:</p>
                        <p className="text-sm text-gray-300 line-clamp-3">
                          {hoveredNodeData.content.substring(0, 150)}
                          {hoveredNodeData.content.length > 150 ? "..." : ""}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(
                        hoveredNodeData.created_at
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-blue-300">
                      Click to view details
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Hover over a node to see details</p>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <Card.Header>
                <Card.Title className="text-lg">Your Knowledge</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {stats.totalNotes}
                    </div>
                    <div className="text-xs text-gray-400">Notes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {stats.totalAtoms}
                    </div>
                    <div className="text-xs text-gray-400">Atoms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {stats.totalFlashcards}
                    </div>
                    <div className="text-xs text-gray-400">Flashcards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {stats.totalFolders}
                    </div>
                    <div className="text-xs text-gray-400">Folders</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Total Connections:</span>
                    <span>{links.length}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Detail Modal */}
        <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
          <Dialog.Content className="bg-gray-800 border-gray-600 text-white max-w-2xl max-h-[80vh] overflow-hidden">
            <Dialog.Header>
              <Dialog.Title className="flex items-center gap-2">
                {selectedNode && (
                  <>
                    {React.createElement(getNodeIcon(selectedNode.type), {
                      className: "w-5 h-5",
                    })}
                    {selectedNode.name}
                  </>
                )}
              </Dialog.Title>
            </Dialog.Header>

            {selectedNode && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    style={{
                      backgroundColor:
                        (categoryColors[selectedNode.category] || "#6b7280") +
                        "20",
                      color: categoryColors[selectedNode.category] || "#6b7280",
                    }}
                  >
                    {selectedNode.category}
                  </Badge>
                  <Badge variant="outline">{selectedNode.type}</Badge>
                  {selectedNode.is_pinned && (
                    <Badge
                      variant="outline"
                      className="text-yellow-400 border-yellow-400"
                    >
                      Pinned
                    </Badge>
                  )}
                  {selectedNode.is_favorite && (
                    <Badge
                      variant="outline"
                      className="text-red-400 border-red-400"
                    >
                      Favorite
                    </Badge>
                  )}
                </div>

                {selectedNode.content && (
                  <div>
                    <h4 className="font-semibold mb-2">Content:</h4>
                    <div className="bg-gray-900 rounded-lg p-3 text-sm text-gray-300 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {selectedNode.content}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-400">
                  <p>
                    Created:{" "}
                    {new Date(selectedNode.created_at).toLocaleString()}
                  </p>
                  <p>ID: {selectedNode.id}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      // Navigate based on type
                      if (selectedNode.type === "note") {
                        router.push(`/notes/${selectedNode.id}`);
                      } else if (selectedNode.type === "atom") {
                        router.push(`/atoms/${selectedNode.id}`);
                      } else if (selectedNode.type === "flashcard") {
                        router.push(`/flashcards/${selectedNode.id}`);
                      } else if (selectedNode.type === "folder") {
                        router.push(`/folders/${selectedNode.id}`);
                      }
                      setShowTagModal(false);
                    }}
                    className="flex-1"
                  >
                    Open {selectedNode.type}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTagModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog>
      </div>
    </div>
  );
}
