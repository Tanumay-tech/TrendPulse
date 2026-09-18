import React, { useState, useEffect } from 'react';
import {
  Network,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
  Tag,
  CircleDot,
  CheckCircle2,
  Table,
  Search,
  ArrowRight,
  Filter,
  BarChart2,
  Eye,
} from 'lucide-react';
import { TopicCluster, ClusterNode } from '../types';
import { TermTooltip } from './TermTooltip';

export type ClusterSubTab = 'projection' | 'catalog' | 'tokens';

interface ClusterAnalyticsViewProps {
  clusters: TopicCluster[];
  initialSubTab?: ClusterSubTab;
  onSubTabChange?: (tab: ClusterSubTab) => void;
}

export const ClusterAnalyticsView: React.FC<ClusterAnalyticsViewProps> = ({
  clusters,
  initialSubTab = 'projection',
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<ClusterSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setInternalSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const activeSubTab = internalSubTab;

  const handleSubTabChange = (tab: ClusterSubTab) => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  const [selectedClusterId, setSelectedClusterId] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<ClusterNode | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');

  const selectedCluster = clusters.find((c) => c.clusterId === selectedClusterId) || clusters[0];

  const allNodes = clusters.flatMap((c) => c.nodes);
  const filteredNodes = allNodes.filter(
    (n) =>
      (selectedClusterId === 'all' || n.clusterId === selectedClusterId) &&
      (sentimentFilter === 'all' || n.sentiment === sentimentFilter)
  );

  const searchedTokens = allNodes.filter((n) => {
    const matchesSearch = n.label.toLowerCase().includes(tokenSearchQuery.toLowerCase());
    const matchesCluster = selectedClusterId === 'all' || n.clusterId === selectedClusterId;
    const matchesSentiment = sentimentFilter === 'all' || n.sentiment === sentimentFilter;
    return matchesSearch && matchesCluster && matchesSentiment;
  });

  const subTabs = [
    {
      id: 'projection' as const,
      label: '2D Latent Vector Projection',
      badge: 'Interactive Map',
      icon: CircleDot,
      description: 'Dimensionality-reduced vector topology & spatial distribution',
    },
    {
      id: 'catalog' as const,
      label: 'Semantic Clusters Catalog',
      badge: `${clusters.length} Clusters`,
      icon: Layers,
      description: 'Cohesion scores, theme narratives & centroid anchors',
    },
    {
      id: 'tokens' as const,
      label: 'Entity Token Matrix',
      badge: `${allNodes.length} Nodes`,
      icon: Table,
      description: 'Searchable database of vectorized tokens & velocities',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Cluster Filter Strip */}
      <div className="rounded-xl border border-[#DDD7CE] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECE7DF] border border-[#DDD7CE] text-[#8A7F73] shrink-0">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#24201D]">
                  <TermTooltip termKey="unsupervisedClustering">Unsupervised Semantic Clustering</TermTooltip> & Entity Topology
                </h2>
                <span className="rounded-full bg-[#ECE7DF] px-2 py-0.5 text-[10px] font-mono text-[#5A524A] border border-[#DDD7CE]">
                  <TermTooltip termKey="kmeans">k-means</TermTooltip> & <TermTooltip termKey="tsneProjection">t-SNE</TermTooltip>
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#786E64]">
                Vector representations of multi-platform social posts grouped by semantic affinity.
              </p>
            </div>
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-1.5 rounded-lg bg-[#ECE7DF] border border-[#DDD7CE] p-1">
            {(['all', 'positive', 'neutral', 'negative'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`rounded px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                  sentimentFilter === s
                    ? 'bg-white text-[#24201D] font-bold shadow-sm'
                    : 'text-[#786E64] hover:text-[#24201D]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#DDD7CE]">
          <span className="text-[11px] font-mono text-[#786E64] uppercase mr-1">Cluster Focus:</span>
          <button
            onClick={() => setSelectedClusterId('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
              selectedClusterId === 'all'
                ? 'border-[#8A7F73] bg-[#8A7F73] text-white font-bold shadow-sm'
                : 'border-[#DDD7CE] bg-[#FAF8F5] text-[#5A524A] hover:bg-white'
            }`}
          >
            All Clusters ({clusters.length})
          </button>
          {clusters.map((c) => (
            <button
              key={c.clusterId}
              onClick={() => setSelectedClusterId(c.clusterId)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
                selectedClusterId === c.clusterId
                  ? 'border-[#8A7F73] bg-[#8A7F73] text-white font-bold shadow-sm'
                  : 'border-[#DDD7CE] bg-[#FAF8F5] text-[#5A524A] hover:bg-white'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.themeColor }}
              />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="rounded-xl border border-[#DDD7CE] bg-[#ECE7DF] p-1.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`cluster-subtab-${tab.id}`}
                  onClick={() => handleSubTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-[#24201D] font-bold border border-[#DDD7CE] shadow-sm'
                      : 'text-[#5A524A] hover:bg-white/60 hover:text-[#24201D]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#8A7F73]' : 'text-[#786E64]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`rounded border px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive
                        ? 'bg-[#ECE7DF] text-[#5A524A] border-[#DDD7CE]'
                        : 'bg-white/70 text-[#786E64] border-[#DDD7CE]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#786E64] pr-2">
            <span className="text-[11px] font-mono">
              {subTabs.find((t) => t.id === activeSubTab)?.description}
            </span>
          </div>
        </div>
      </div>

      {/* ================= SUB-TAB 1: 2D VECTOR PROJECTION ================= */}
      {activeSubTab === 'projection' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-sky-400" />
                  <span>Interactive 2D <TermTooltip termKey="latentSpace">Latent Vector Projection</TermTooltip> Canvas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any entity node to inspect sub-topic velocity and sentiment score.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                <TermTooltip termKey="cosineSimilarity">Cosine Coordinate Space: 100x100</TermTooltip>
              </span>
            </div>

            {/* Interactive Vector Space Canvas */}
            <div className="relative mt-4 h-[440px] w-full rounded-xl border border-slate-800/90 bg-[#0d131f] overflow-hidden shadow-inner">
              {/* Background Latent Grid */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#64748b 1px, #0d131f 1px)',
                  backgroundSize: '28px 28px',
                  backgroundPosition: '0 0, 14px 14px',
                }}
              />

              {/* Cluster Centroid Halos */}
              {clusters
                .filter((c) => selectedClusterId === 'all' || c.clusterId === selectedClusterId)
                .map((c) => (
                  <div
                    key={`halo-${c.clusterId}`}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-all duration-500"
                    style={{
                      left: `${c.centroid.x}%`,
                      top: `${c.centroid.y}%`,
                      width: '210px',
                      height: '210px',
                      borderColor: `${c.themeColor}30`,
                      backgroundColor: `${c.themeColor}08`,
                    }}
                  >
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-[#101724] border px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider"
                      style={{ color: c.themeColor, borderColor: `${c.themeColor}40` }}
                    >
                      CENTROID: {c.name.split(' ')[0]}
                    </span>
                  </div>
                ))}

              {/* Entity Nodes */}
              {filteredNodes.map((node) => {
                const cluster = clusters.find((c) => c.clusterId === node.clusterId);
                const isSelected = selectedNode?.id === node.id;
                const nodeColor =
                  node.sentiment === 'positive'
                    ? '#10b981'
                    : node.sentiment === 'negative'
                    ? '#f43f5e'
                    : cluster?.themeColor || '#94a3b8';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-125 z-10"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                    }}
                  >
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all shadow-md ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-125' : ''
                      }`}
                      style={{
                        width: `${Math.max(26, node.weight)}px`,
                        height: `${Math.max(26, node.weight)}px`,
                        backgroundColor: `${nodeColor}28`,
                        border: `2px solid ${nodeColor}`,
                      }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: nodeColor }}
                      />
                    </div>

                    {/* Node Hover Tooltip Pill */}
                    <div className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#101724] border border-slate-700/80 px-2 py-0.5 text-[10px] font-bold text-white shadow-xl opacity-90 group-hover:opacity-100 z-20">
                      {node.label}
                      <span className="ml-1.5 font-mono text-emerald-400">+{node.growthRate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Canvas Legend */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  Positive Sentiment
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                  Neutral Sentiment
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
                  Negative Sentiment
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                <TermTooltip termKey="volumeWeight">Radius size = post volume weight</TermTooltip>
              </span>
            </div>
          </div>

          {/* Selected Node Inspector Drawer/Card */}
          {selectedNode ? (
            <div className="rounded-xl border border-sky-800/60 bg-[#131d2e] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-100">{selectedNode.label}</h4>
                      <span className="rounded bg-sky-950/80 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-800/60">
                        Node Selected
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Parent Cluster: {clusters.find((c) => c.clusterId === selectedNode.clusterId)?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#101724] border border-slate-800/80 px-3 py-1.5 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      <TermTooltip termKey="growthVelocity">Growth</TermTooltip>
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      +{selectedNode.growthRate}%
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#101724] border border-slate-800/80 px-3 py-1.5 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      <TermTooltip termKey="sentimentPolarity">Sentiment</TermTooltip>
                    </span>
                    <span className="font-mono font-bold text-sky-300 text-sm">
                      {selectedNode.sentiment.toUpperCase()} ({selectedNode.sentimentScore.toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800/80 bg-[#121824]/60 p-4 text-center text-xs text-slate-400">
              Tip: Click any node on the vector projection above to inspect real-time growth velocity and sentiment metrics.
            </div>
          )}

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">
              <TermTooltip termKey="cosineSimilarity">Latent projection calculated via cosine distance.</TermTooltip>
            </span>
            <button
              onClick={() => handleSubTabChange('catalog')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Next: View Semantic Clusters Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: CLUSTERS CATALOG ================= */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {clusters.map((cluster) => (
              <div
                key={cluster.clusterId}
                className="rounded-xl border border-slate-800/90 bg-[#131926] p-5 space-y-4 hover:border-slate-700/80 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: cluster.themeColor }}
                    />
                    <h3 className="text-base font-bold text-slate-100">{cluster.name}</h3>
                  </div>

                  <span className="rounded bg-[#101724] px-2.5 py-0.5 text-xs font-mono font-semibold text-sky-300 border border-slate-700/70">
                    <TermTooltip termKey="cohesionScore">Cohesion {cluster.cohesionScore}%</TermTooltip>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {cluster.summary}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#101724] border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      <TermTooltip termKey="volumeWeight">Member Volume</TermTooltip>
                    </span>
                    <span className="font-bold text-slate-100">{cluster.memberCount.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#101724] border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      <TermTooltip termKey="latentSpace">Centroid Coords</TermTooltip>
                    </span>
                    <span className="font-bold text-sky-400">
                      ({cluster.centroid.x}, {cluster.centroid.y})
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#101724] border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      <TermTooltip termKey="entityCluster">Member Nodes</TermTooltip>
                    </span>
                    <span className="font-bold text-emerald-400">{cluster.nodes.length} Tokens</span>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Key Vector Entities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.nodes.map((node) => (
                      <span
                        key={node.id}
                        onClick={() => {
                          setSelectedNode(node);
                          handleSubTabChange('projection');
                        }}
                        className="cursor-pointer rounded bg-[#101724] px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border border-slate-700/60"
                      >
                        #{node.label} (+{node.growthRate}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => handleSubTabChange('projection')}
              className="font-medium text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Vector Projection
            </button>
            <button
              onClick={() => handleSubTabChange('tokens')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Next: View Entity Token Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: ENTITY TOKEN MATRIX ================= */}
      {activeSubTab === 'tokens' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800/90 bg-[#131926] p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">
                Extracted <TermTooltip termKey="entityCluster">Semantic Tokens</TermTooltip>
              </span>
              <span className="rounded-full bg-[#101724] px-2 py-0.5 text-xs font-mono font-semibold text-slate-300 border border-slate-700/60">
                {searchedTokens.length} Tokens
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                placeholder="Filter tokens or keywords..."
                className="w-full sm:w-64 rounded-lg border border-slate-700/80 bg-[#101724] py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tokens Table */}
          <div className="rounded-xl border border-slate-800/90 bg-[#131926] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#101724] border-b border-slate-800/80 text-[11px] font-mono uppercase text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Entity Token</th>
                    <th className="py-3 px-4">Parent Cluster</th>
                    <th className="py-3 px-4">
                      <TermTooltip termKey="volumeWeight">Volume Weight</TermTooltip>
                    </th>
                    <th className="py-3 px-4">
                      <TermTooltip termKey="growthVelocity">Growth Velocity</TermTooltip>
                    </th>
                    <th className="py-3 px-4">
                      <TermTooltip termKey="sentimentPolarity">Sentiment Polarity</TermTooltip>
                    </th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {searchedTokens.map((node) => {
                    const cluster = clusters.find((c) => c.clusterId === node.clusterId);
                    return (
                      <tr key={node.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-100">
                          #{node.label}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold border"
                            style={{
                              backgroundColor: `${cluster?.themeColor}12`,
                              borderColor: `${cluster?.themeColor}35`,
                              color: cluster?.themeColor,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: cluster?.themeColor }}
                            />
                            {cluster?.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {node.weight} pts
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          +{node.growthRate}%
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              node.sentiment === 'positive'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : node.sentiment === 'negative'
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                                : 'bg-[#101724] text-slate-300 border border-slate-700/60'
                            }`}
                          >
                            {node.sentiment}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {node.sentimentScore > 0 ? '+' : ''}
                          {node.sentimentScore.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedNode(node);
                              handleSubTabChange('projection');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Locate on Map</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => handleSubTabChange('catalog')}
              className="font-medium text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Semantic Clusters Catalog
            </button>
            <button
              onClick={() => handleSubTabChange('projection')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Back to Latent Projection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
