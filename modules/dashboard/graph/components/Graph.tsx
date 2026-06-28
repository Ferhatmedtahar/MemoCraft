"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as d3 from "d3";
import {
  BookOpen,
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
    case "flashcard_deck":
      return BookOpen;
    case "folder":
      return Folder;
    default:
      return FileText;
  }
};

export default function KnowledgeGraph() {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<
    d3.SimulationNodeDatum,
    undefined
  > | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showLegend, setShowLegend] = useState(false);

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
        console.log(graphData);
        setNodes(graphData.nodes);
        setLinks(graphData.links);
        setCategories([...graphData.categories]);
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

  // FIXED: Filter data based on category and search
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
                node.category.includes("Atoms")) ||
              (selectedCategory === "Flashcards" &&
                node.category.includes("Flashcards"))))
      );
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      filteredNodes = filteredNodes.filter(
        (node) =>
          node.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (node.content &&
            node.content
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

    // FIXED: Filter links using the correct approach
    // The key fix is to check both source and target as either strings or objects
    const filteredLinks = links.filter((link) => {
      // Handle both string IDs and object references
      const sourceId =
        typeof link.source === "object" && link.source !== null
          ? (link.source as any).id
          : link.source;
      const targetId =
        typeof link.target === "object" && link.target !== null
          ? (link.target as any).id
          : link.target;

      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  };

  // D3 visualization effect
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0 || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 800;

    const { nodes: filteredNodes, links: filteredLinks } = getFilteredData();

    const container = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // FIXED: Create force simulation with proper data cloning
    // Clone the data to avoid D3 mutating the original arrays
    const simulationNodes = filteredNodes.map((d) => ({ ...d }));
    const simulationLinks = filteredLinks.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(simulationNodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d: any) => d.id)
          .distance((d: any) => {
            // Shorter distance for folder-content relationships
            if (d.relationship === "contains") return 60;
            return 100;
          })
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25))
      .force("x", d3.forceX(width / 2).strength(0.08))
      .force("y", d3.forceY(height / 2).strength(0.08));

    simulationRef.current = simulation;

    // TODO color Links
    const link = container
      .append("g")
      .selectAll("line")
      .data(simulationLinks)
      .enter()
      .append("line")
      .attr("stroke", (d: any) => {
        if (d.relationship === "contains") return "#10b981";
        return "#374151";
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => {
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
      .attr("x", (d: KnowledgeNode) => {
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
      .attr("font-size", "11px")
      .attr("fill", "#e5e7eb");

    // FIXED: Mouse events with proper link checking
    let hoverTimeout: NodeJS.Timeout;

    const updateVisualization = (hoveredNodeId: string | null) => {
      if (hoveredNodeId) {
        const connectedNodes = new Set<string>();

        // FIXED: Check links properly whether they're objects or strings
        simulationLinks.forEach((link) => {
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
          .attr("stroke", (d: any) => {
            const sourceId =
              typeof d.source === "object" && d.source !== null
                ? d.source.id
                : d.source;
            const targetId =
              typeof d.target === "object" && d.target !== null
                ? d.target.id
                : d.target;

            if (sourceId === hoveredNodeId || targetId === hoveredNodeId) {
              return d.relationship === "contains" ? "#10b981" : "#3b82f6";
            }
            return "#374151";
          })
          .attr("stroke-width", (d: any) => {
            const sourceId =
              typeof d.source === "object" && d.source !== null
                ? d.source.id
                : d.source;
            const targetId =
              typeof d.target === "object" && d.target !== null
                ? d.target.id
                : d.target;

            if (sourceId === hoveredNodeId || targetId === hoveredNodeId) {
              return d.relationship === "contains" ? 4 : 3;
            }
            return d.relationship === "contains" ? 3 : 1;
          })
          .attr("opacity", (d: any) => {
            const sourceId =
              typeof d.source === "object" && d.source !== null
                ? d.source.id
                : d.source;
            const targetId =
              typeof d.target === "object" && d.target !== null
                ? d.target.id
                : d.target;

            if (sourceId === hoveredNodeId || targetId === hoveredNodeId)
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
          .attr("stroke", (d: any) => {
            if (d.relationship === "contains") return "#10b981";
            return "#374151";
          })
          .attr("stroke-width", (d: any) => {
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
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        setShowTagModal(true);
      });

    // Allow clicking on empty space to clear hover
    svg.on("click", (event) => {
      // Only clear if clicking on the SVG itself, not zooming
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

    // Cleanup function
    return () => {
      clearTimeout(hoverTimeout);
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [selectedCategory, debouncedSearchTerm, nodes, links, loading]);

  // Zoom control functions
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1 / 1.5);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const hoveredNodeData = hoveredNode
    ? nodes.find((n) => n.id === hoveredNode)
    : null;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-primary text-primary-foreground overflow-hidden p-4">
        <div className="max-w-7xl mx-auto ">
          <div className="flex items-center justify-center ">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-foreground mx-auto mb-4"></div>
              <p className="">Loading your knowledge graph...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sidebar text-primary-foreground overflow-hidden p-2 border-2 border-secondary-foreground/90">
      <div className="max-w-7xl mx-auto pt-16">
        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search your knowledge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="hover:cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground hover:text-secondary-foreground/80"
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
                    selectedCategory === category ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 text-sm font-medium transition-all"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Zoom controls */}
            <div className="flex gap-2">
              <div className="flex gap-1 border-2 border-secondary-foreground p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLegend(!showLegend)}
              >
                {showLegend ? "Hide" : "Show"} Legend
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main graph */}
          <div className="lg:col-span-3">
            <div className="bg-primary border-2 border-secondary-foreground overflow-hidden">
              <div className="relative">
                {/*Todo */}
                <svg
                  ref={svgRef}
                  width="100%"
                  height="600"
                  viewBox="0 0 1200 800"
                  className="bg-gray-900/40 h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] block"
                  style={{ touchAction: "manipulation" }}
                />

                {showInstructions && (
                  <div className="absolute top-4 left-4 bg-primary border-2 border-secondary-foreground p-3 text-sm max-w-80">
                    <div className="flex justify-between items-start gap-2">
                      <ul className="space-y-1 text-gray-200">
                        <li>• Hover to highlight connections</li>
                        <li>• Click nodes to view details</li>
                        <li>• Drag to move nodes around</li>
                        <li>• Scroll or pinch to zoom</li>
                      </ul>
                      <button
                        onClick={() => setShowInstructions(false)}
                        className="hover:cursor-pointer p-1 hover:text-secondary-foreground transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Legend */}
            {showLegend && (
              <div className="   bg-primary border-2 border-secondary-foreground  ">
                <div className="p-4 bg-gray-900/40">
                  <h3 className="text-lg font-semibold mb-4">Legend</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-secondary mb-2">
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
                              <span className="text-xs text-secondary">
                                {category}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-secondary mb-2">
                        Connections
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-green-500" />
                          <span className="text-xs text-secondary">
                            Contains (folder/deck → item)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-gray-400" />
                          <span className="text-xs text-secondary">
                            Related content
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-secondary mb-2">
                        Indicators
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-yellow-400" />
                          <span className="text-xs text-secondary">
                            Pinned items
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-red-400" />
                          <span className="text-xs text-secondary">
                            Favorite items
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Node Info */}
            <div className="  bg-primary border-2 border-secondary-foreground ">
              <div className="p-4 bg-gray-900/40">
                <h3 className="text-lg font-semibold mb-4 ">
                  {hoveredNodeData
                    ? `${
                        hoveredNodeData.type.charAt(0).toUpperCase() +
                        hoveredNodeData.type.slice(1)
                      } Info`
                    : "Node Info"}
                </h3>
                <div className="space-y-3">
                  {hoveredNodeData ? (
                    <>
                      <div>
                        <h4 className="font-semibold  mb-1">
                          {hoveredNodeData.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="surface">
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
                          <p className="text-xs text-primary-foreground mb-1">
                            Preview:
                          </p>
                          <p className="text-sm text-primary-foreground line-clamp-3">
                            {hoveredNodeData.content.substring(0, 150)}
                            {hoveredNodeData.content.length > 150 ? "..." : ""}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-primary-foreground">
                        Created:{" "}
                        {new Date(
                          hoveredNodeData.created_at
                        ).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-primary-foreground">
                      Hover over a node to view info
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
