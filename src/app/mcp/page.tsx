'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { ZoomContainer, StepIndicator } from '@/components/ui';
import { usePresentationFlow, FlowStep } from '@/hooks/usePresentationFlow';
import { useAppStore } from '@/store/useAppStore';

// Complete MCP flow with detailed message exchanges
const MCP_STEPS: FlowStep[] = [
  {
    id: 'intro',
    title: 'Model Context Protocol (MCP)',
    description: 'MCP enables AI assistants like GitHub Copilot to interact with external tools. Let\'s trace the complete message flow for a Jira integration.',
    zoom: 1,
    focusX: 50,
    focusY: 50,
    duration: 0,
  },
  {
    id: 'vscode-start',
    title: 'VS Code + Copilot Ready',
    description: 'VS Code launches with GitHub Copilot. The Copilot extension discovers configured MCP servers.',
    zoom: 1.5,
    focusX: 20,
    focusY: 55,
    duration: 0,
    highlights: ['vscode'],
  },
  {
    id: 'mcp-init',
    title: 'MCP Server Initializes',
    description: 'The Jira MCP server starts and establishes a connection with Copilot via stdio or SSE.',
    zoom: 1.8,
    focusX: 50,
    focusY: 28,
    duration: 0,
    highlights: ['mcp'],
  },
  {
    id: 'mcp-capabilities',
    title: 'MCP → Copilot: Capabilities',
    description: 'MCP sends its capabilities to Copilot: tools (jira_get_issue, jira_search), resources, and prompt templates. Now Copilot knows what Jira can do.',
    zoom: 1.3,
    focusX: 30,
    focusY: 35,
    duration: 0,
    highlights: ['mcp', 'vscode', 'msg-capabilities'],
  },
  {
    id: 'user-request',
    title: 'Developer Types Request',
    description: 'You type in Copilot Chat: "Get the implementation details from PROJ-123 and help me implement it"',
    zoom: 2.5,
    focusX: 30,
    focusY: 55,
    duration: 0,
    highlights: ['vscode', 'user-input', 'typing-animation'],
  },
  {
    id: 'prompt-enrich',
    title: 'Copilot Enriches Prompt',
    description: 'Copilot builds a prompt containing your message AND all available MCP tools with their JSON schemas. The LLM will know what tools it CAN call.',
    zoom: 2.5,
    focusX: 30,
    focusY: 55,
    duration: 0,
    highlights: ['vscode', 'prompt-enriched'],
  },
  {
    id: 'llm-call-1',
    title: 'Copilot → LLM: First Request',
    description: 'The enriched prompt is sent to the LLM. Message contains: user question + tool definitions (with schemas).',
    zoom: 1.3,
    focusX: 45,
    focusY: 50,
    duration: 0,
    highlights: ['vscode', 'llm', 'msg-to-llm-1', 'prompt-detail'],
  },
  {
    id: 'llm-decision',
    title: 'LLM Decides: Need Tool',
    description: 'The LLM analyzes the request and decides it needs Jira data first. Instead of answering directly, it returns a tool_call response.',
    zoom: 1.6,
    focusX: 72,
    focusY: 50,
    duration: 0,
    highlights: ['llm', 'tool-decision'],
  },
  {
    id: 'tool-call-back',
    title: 'LLM → Copilot: Tool Call',
    description: 'The LLM returns: { tool_call: { name: "jira_get_issue", arguments: { key: "PROJ-123" } } }. This is NOT the final answer!',
    zoom: 1.3,
    focusX: 50,
    focusY: 50,
    duration: 0,
    highlights: ['msg-tool-call'],
  },
  {
    id: 'copilot-routes',
    title: 'Copilot → MCP: Execute Tool',
    description: 'Copilot receives the tool_call and routes it to the Jira MCP server: jira_get_issue({ key: "PROJ-123" })',
    zoom: 1.4,
    focusX: 30,
    focusY: 35,
    duration: 0,
    highlights: ['mcp', 'vscode', 'msg-to-mcp'],
  },
  {
    id: 'mcp-to-jira',
    title: 'MCP → Jira: API Request',
    description: 'The MCP server translates the tool call into a Jira REST API request: GET /rest/api/3/issue/PROJ-123',
    zoom: 1.3,
    focusX: 50,
    focusY: 45,
    duration: 0,
    highlights: ['mcp', 'jira', 'msg-api-call'],
  },
  {
    id: 'jira-response',
    title: 'Jira → MCP: JSON Response',
    description: 'Jira API responds with JSON: { key: "PROJ-123", summary: "OAuth Implementation", acceptanceCriteria: [...], storyPoints: 5 }',
    zoom: 1.3,
    focusX: 50,
    focusY: 45,
    duration: 0,
    highlights: ['mcp', 'jira', 'msg-json-response', 'json-to-mcp'],
  },
  {
    id: 'mcp-to-copilot',
    title: 'MCP → Copilot: Tool Result',
    description: 'MCP formats the Jira JSON into a tool_result and sends it back to Copilot. The result contains all issue details.',
    zoom: 1.2,
    focusX: 30,
    focusY: 35,
    duration: 0,
    highlights: ['vscode', 'mcp', 'msg-tool-result', 'json-to-copilot'],
  },
  {
    id: 'copilot-has-context',
    title: 'Copilot: Context Complete',
    description: 'Copilot now has the augmented context: original request + tool call made + tool result (real Jira data). Ready for second LLM call.',
    zoom: 1.5,
    focusX: 20,
    focusY: 55,
    duration: 0,
    highlights: ['vscode', 'context-ready'],
  },
  {
    id: 'llm-call-2',
    title: 'Copilot → LLM: Augmented Request',
    description: 'The augmented prompt is sent to LLM. Now it contains: user message + tool call + tool result (actual PROJ-123 data).',
    zoom: 1.2,
    focusX: 50,
    focusY: 50,
    duration: 0,
    highlights: ['msg-to-llm-2'],
  },
  {
    id: 'llm-generates',
    title: 'LLM Generates Response',
    description: 'With full Jira context, the LLM generates implementation instructions based on the real requirements from PROJ-123.',
    zoom: 1.6,
    focusX: 72,
    focusY: 50,
    duration: 0,
    highlights: ['llm', 'generating'],
  },
  {
    id: 'response-stream',
    title: 'LLM → Copilot: Response',
    description: 'The response streams back token by token: "Based on PROJ-123, implement OAuth2 with Google and GitHub providers..."',
    zoom: 1.2,
    focusX: 50,
    focusY: 50,
    duration: 0,
    highlights: ['msg-response'],
  },
  {
    id: 'copilot-shows',
    title: 'Response in VS Code',
    description: 'Copilot displays the implementation plan in the chat panel, showing requirements and suggested code structure.',
    zoom: 1.5,
    focusX: 20,
    focusY: 55,
    duration: 0,
    highlights: ['vscode', 'response-shown'],
  },
  {
    id: 'code-gen',
    title: 'Code Generation Begins',
    description: 'You ask Copilot to generate the code. This is now a direct VS Code ↔ LLM interaction - no MCP needed!',
    zoom: 1.5,
    focusX: 20,
    focusY: 55,
    duration: 0,
    highlights: ['vscode', 'code-gen'],
  },
  {
    id: 'code-loop',
    title: 'Iterative Code Loop',
    description: 'You refine code with Copilot. Multiple requests go back and forth to the LLM. MCP is idle - its job (fetching Jira data) is done.',
    zoom: 1.1,
    focusX: 50,
    focusY: 50,
    duration: 0,
    highlights: ['code-loop'],
  },
  {
    id: 'complete',
    title: 'MCP Flow Complete',
    description: 'MCP enabled real-time Jira integration, then stepped aside for direct LLM coding. Tool calls happen only when needed!',
    zoom: 1,
    focusX: 50,
    focusY: 50,
    duration: 0,
  },
  // === COMMENT SCENARIO ===
  {
    id: 'comment-intro',
    title: 'New Request: Add Comment',
    description: 'The developer finished implementing the feature. Now they want to update the Jira ticket with a status comment.',
    zoom: 1.5,
    focusX: 20,
    focusY: 55,
    duration: 0,
    highlights: ['vscode', 'comment-request'],
  },
  {
    id: 'comment-flow',
    title: 'Fast Forward: The Flow',
    description: 'Watch the familiar pattern: Copilot → LLM → tool_call → MCP → Jira. This time using jira_add_comment!',
    zoom: 1.1,
    focusX: 50,
    focusY: 45,
    duration: 0,
    highlights: ['fast-forward-flow'],
  },
  {
    id: 'comment-action',
    title: 'MCP Acts: Comment Added',
    description: 'Unlike jira_get_issue (read-only), jira_add_comment actually MODIFIES Jira. The comment is now live on PROJ-123!',
    zoom: 1.5,
    focusX: 50,
    focusY: 55,
    duration: 0,
    highlights: ['jira', 'mcp', 'comment-tool', 'comment-added'],
  },
  {
    id: 'comment-complete',
    title: 'Full Circle',
    description: 'MCP tools can both READ and WRITE to external systems. The developer gets confirmation, and Jira is updated - all without leaving VS Code.',
    zoom: 1,
    focusX: 50,
    focusY: 50,
    duration: 0,
  },
];

export default function MCPPage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const flow = usePresentationFlow({ steps: MCP_STEPS });
  const { currentStep, currentStepData } = flow;

  const isHighlighted = (id: string) => currentStepData.highlights?.includes(id);

  // File tree for VS Code
  const fileTree = [
    { name: 'src', isFolder: true, indent: 0 },
    { name: 'auth', isFolder: true, indent: 1 },
    { name: 'oauth.ts', isFolder: false, indent: 2, active: true },
    { name: 'session.ts', isFolder: false, indent: 2 },
    { name: 'components', isFolder: true, indent: 1 },
    { name: 'package.json', isFolder: false, indent: 0 },
  ];

  const content = (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-bg-primary">
      <ZoomContainer
        zoom={currentStepData.zoom}
        focusX={currentStepData.focusX}
        focusY={currentStepData.focusY}
        className="w-full h-full"
      >
        <div className="relative w-full h-full p-4">
          {/* Title */}
          <motion.h1
            className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl font-display font-bold text-neon-magenta text-glow-magenta z-10"
            animate={{ opacity: currentStepData.zoom > 1.4 ? 0 : 1 }}
          >
            MCP + GitHub Copilot Message Flow
          </motion.h1>

          {/* ===== VS CODE (Large, with Copilot panel) ===== */}
          <motion.div
            className={`absolute left-[2%] top-[32%] w-[32%] transition-all duration-500`}
            animate={{
              boxShadow: isHighlighted('vscode')
                ? '0 0 60px rgba(0, 255, 255, 0.5)'
                : '0 0 15px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className={`bg-[#1e1e1e] rounded-xl overflow-hidden border-2 transition-colors ${
              isHighlighted('vscode') ? 'border-neon-cyan' : 'border-[#3c3c3c]'
            }`}>
              {/* Title bar */}
              <div className="bg-[#323233] px-3 py-1.5 flex items-center justify-between border-b border-[#3c3c3c]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[8px] text-text-muted ml-2">oauth.ts - my-project - VS Code</span>
                </div>
              </div>

              <div className="flex h-[260px]">
                {/* Activity Bar */}
                <div className="w-9 bg-[#333333] flex flex-col items-center py-2 gap-2 border-r border-[#3c3c3c]">
                  <div className="w-5 h-5 flex items-center justify-center text-text-secondary text-xs">📁</div>
                  <div className="w-5 h-5 flex items-center justify-center text-text-muted text-xs">🔍</div>
                  <div className="flex-1" />
                  <div className="w-5 h-5 flex items-center justify-center text-neon-cyan text-xs">✨</div>
                </div>

                {/* File Explorer */}
                <div className="w-28 bg-[#252526] border-r border-[#3c3c3c] overflow-hidden">
                  <div className="px-2 py-1 text-[8px] text-text-muted uppercase tracking-wider">Explorer</div>
                  <div className="px-1">
                    {fileTree.map((file, i) => (
                      <div
                        key={i}
                        className={`text-[9px] py-0.5 px-1 rounded flex items-center gap-1 ${
                          file.active ? 'bg-[#37373d] text-text-primary' : 'text-text-secondary'
                        }`}
                        style={{ paddingLeft: `${file.indent * 8 + 4}px` }}
                      >
                        <span className="text-[8px]">{file.isFolder ? '📁' : '📄'}</span>
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editor + Copilot Chat */}
                <div className="flex-1 flex">
                  {/* Code Editor */}
                  <div className="flex-1 bg-[#1e1e1e] flex flex-col min-w-0">
                    <div className="flex bg-[#252526] border-b border-[#3c3c3c]">
                      <div className="px-2 py-1 bg-[#1e1e1e] text-[9px] text-text-secondary flex items-center gap-1">
                        📄 oauth.ts
                      </div>
                    </div>
                    <div className="flex-1 p-2 font-mono text-[8px] overflow-hidden">
                      <AnimatePresence mode="wait">
                        {isHighlighted('code-gen') || isHighlighted('code-loop') ? (
                          <motion.div
                            key="code"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-0.5"
                          >
                            <div className="text-[#6a9955]">// PROJ-123: OAuth</div>
                            {[
                              { text: 'export async function', c: '#569cd6' },
                              { text: '  authenticate(provider) {', c: '#dcdcaa' },
                              { text: '  const config = getConfig();', c: '#d4d4d4' },
                              { text: '  const token = await', c: '#d4d4d4' },
                              { text: '    oauth.getToken(config);', c: '#d4d4d4' },
                              { text: '  return { ok: true };', c: '#d4d4d4' },
                              { text: '}', c: '#d4d4d4' },
                            ].map((line, i) => (
                              <motion.div
                                key={i}
                                style={{ color: line.c }}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                              >
                                {line.text}
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div key="placeholder" className="text-text-muted space-y-0.5">
                            <div>// oauth.ts</div>
                            <div className="text-[#6a9955]">// TODO: Implement</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Copilot Chat Panel */}
                  <div className={`w-36 bg-[#252526] border-l-2 flex flex-col transition-colors ${
                    isHighlighted('user-input') || isHighlighted('context-ready') || isHighlighted('prompt-enriched') || isHighlighted('response-shown')
                      ? 'border-neon-cyan'
                      : 'border-[#3c3c3c]'
                  }`}>
                    <div className="px-2 py-1 border-b border-[#3c3c3c] flex items-center gap-1">
                      <span className="text-[9px]">✨</span>
                      <span className="text-[8px] text-text-secondary">Copilot Chat</span>
                    </div>
                    <div className="flex-1 p-1.5 overflow-y-auto space-y-1.5 text-[7px]">
                      {/* User message with typing animation */}
                      <AnimatePresence>
                        {(currentStep >= 4) && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-1.5 rounded ${
                              isHighlighted('user-input') ? 'bg-neon-cyan/20 border border-neon-cyan/50' : 'bg-[#3c3c3c]'
                            }`}
                          >
                            <div className="text-text-muted">You:</div>
                            {isHighlighted('typing-animation') ? (
                              <motion.div className="text-text-primary">
                                {'Get details from PROJ-123 and help implement'.split('').map((char, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                  >
                                    {char}
                                  </motion.span>
                                ))}
                                <motion.span
                                  className="inline-block w-[2px] h-3 bg-neon-cyan ml-0.5"
                                  animate={{ opacity: [1, 0] }}
                                  transition={{ repeat: Infinity, duration: 0.5 }}
                                />
                              </motion.div>
                            ) : (
                              <div className="text-text-secondary">Get details from PROJ-123 and help implement</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tool enriched indicator */}
                      <AnimatePresence>
                        {isHighlighted('prompt-enriched') && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-1.5 bg-neon-yellow/15 border border-neon-yellow/50 rounded"
                          >
                            <div className="text-neon-yellow font-bold text-[8px] mb-1">+ Available Tools:</div>
                            <div className="space-y-1">
                              <div className="text-[7px]">
                                <span className="text-neon-green font-mono">jira_get_issue</span>
                                <span className="text-text-secondary ml-1">(key)</span>
                              </div>
                              <div className="text-[7px]">
                                <span className="text-neon-green font-mono">jira_search</span>
                                <span className="text-text-secondary ml-1">(jql)</span>
                              </div>
                              <div className="text-[7px]">
                                <span className="text-neon-green font-mono">jira_add_comment</span>
                                <span className="text-text-secondary ml-1">(key, text)</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Context ready indicator */}
                      <AnimatePresence>
                        {isHighlighted('context-ready') && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-1.5 bg-neon-green/15 border border-neon-green/50 rounded"
                          >
                            <div className="text-neon-green font-bold text-[8px]">Context Ready:</div>
                            <div className="text-text-primary text-[7px]"><span className="text-neon-green">✓</span> Request</div>
                            <div className="text-text-primary text-[7px]"><span className="text-neon-green">✓</span> Tool call</div>
                            <div className="text-text-primary text-[7px]"><span className="text-neon-green">✓</span> Jira data</div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Copilot response */}
                      <AnimatePresence>
                        {(isHighlighted('response-shown') || (currentStep >= 18 && currentStep < 21)) && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-1.5 bg-neon-cyan/10 border border-neon-cyan/30 rounded"
                          >
                            <div className="text-neon-cyan">Copilot:</div>
                            <div className="text-text-secondary">📋 PROJ-123</div>
                            <div className="text-text-muted">OAuth with Google & GitHub...</div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Comment request */}
                      <AnimatePresence>
                        {isHighlighted('comment-request') && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-1.5 bg-neon-yellow/20 border border-neon-yellow/50 rounded"
                          >
                            <div className="text-text-muted">You:</div>
                            <motion.div className="text-text-primary text-[7px]">
                              {"Add comment to PROJ-123: Done! But we should look into XYZ".split('').map((char, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.02 }}
                                >
                                  {char}
                                </motion.span>
                              ))}
                              <motion.span
                                className="inline-block w-[2px] h-2.5 bg-neon-yellow ml-0.5"
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                              />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Comment confirmation */}
                      <AnimatePresence>
                        {(isHighlighted('comment-added') || currentStep >= 24) && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-1.5 bg-neon-green/15 border border-neon-green/50 rounded"
                          >
                            <div className="text-neon-green">Copilot:</div>
                            <div className="text-text-primary text-[7px]">✓ Comment added to PROJ-123</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-1 text-[9px] text-text-secondary">VS Code + GitHub Copilot</div>
          </motion.div>

          {/* ===== MCP SERVER ===== */}
          <motion.div
            className={`absolute left-[40%] top-[12%] w-[20%] transition-all duration-500`}
            animate={{
              boxShadow: isHighlighted('mcp')
                ? '0 0 50px rgba(0, 255, 0, 0.5)'
                : '0 0 0px transparent',
            }}
          >
            <div className={`bg-bg-surface rounded-xl p-3 border-2 transition-colors ${
              isHighlighted('mcp') ? 'border-neon-green' : 'border-text-muted/30'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl">🔧</span>
                <div>
                  <div className="text-sm font-medium text-text-secondary">MCP Server</div>
                  <div className="text-[8px] text-text-muted">Jira Integration</div>
                </div>
              </div>

              {/* Status */}
              <div className={`flex items-center justify-center gap-1.5 text-[8px] mb-2 ${
                currentStep >= 2 ? 'text-neon-green' : 'text-text-muted'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  currentStep >= 2 ? 'bg-neon-green animate-pulse' : 'bg-text-muted'
                }`} />
                {currentStep >= 2 ? 'Connected' : 'Starting...'}
              </div>

              {/* Capabilities */}
              <AnimatePresence>
                {(currentStep >= 3) && (
                  <motion.div
                    className="space-y-1.5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className={`p-1.5 rounded ${
                      isHighlighted('msg-capabilities') || isHighlighted('comment-tool') ? 'bg-neon-green/20 border border-neon-green/50' : 'bg-bg-elevated'
                    }`}>
                      <div className="text-[9px] text-neon-green font-bold mb-1">Tools:</div>
                      <div className="text-[8px] font-mono text-text-primary">jira_get_issue(key)</div>
                      <div className="text-[8px] font-mono text-text-primary">jira_search(jql)</div>
                      <div className={`text-[8px] font-mono ${isHighlighted('comment-tool') ? 'text-neon-yellow' : 'text-text-primary'}`}>
                        jira_add_comment(key, text)
                      </div>
                    </div>
                    <div className="p-1.5 bg-bg-elevated rounded">
                      <div className="text-[9px] text-neon-cyan font-bold mb-1">Resources:</div>
                      <div className="text-[8px] font-mono text-text-primary">jira://projects</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-center mt-1 text-[9px] text-text-secondary">MCP Server</div>
          </motion.div>

          {/* ===== LLM ===== */}
          <motion.div
            className={`absolute left-[65%] top-[32%] w-[18%] transition-all duration-500`}
            animate={{
              boxShadow: isHighlighted('llm') || isHighlighted('generating')
                ? '0 0 60px rgba(0, 255, 255, 0.6)'
                : '0 0 0px transparent',
            }}
          >
            <div className={`bg-gradient-to-br from-bg-surface to-bg-elevated rounded-xl p-3 border-2 transition-colors ${
              isHighlighted('llm') || isHighlighted('generating') ? 'border-neon-cyan' : 'border-text-muted/30'
            }`}>
              <div className="text-2xl mb-1 text-center">🧠</div>
              <div className="text-sm text-center text-text-secondary font-medium">LLM</div>
              <div className="text-[8px] text-center text-text-muted">Claude / GPT-4</div>

              {/* Processing */}
              <AnimatePresence>
                {(isHighlighted('llm') || isHighlighted('generating')) && (
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex justify-center gap-1 mb-1">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-neon-cyan rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.8 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tool decision */}
              <AnimatePresence>
                {isHighlighted('tool-decision') && (
                  <motion.div
                    className="mt-2 p-1.5 bg-neon-orange/15 border border-neon-orange/50 rounded text-[8px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-neon-orange font-bold">Decision:</div>
                    <div className="text-text-primary">Need Jira data!</div>
                    <div className="text-neon-yellow text-[7px] mt-0.5 font-mono">→ tool_call</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-center mt-1 text-[9px] text-text-secondary">Language Model</div>
          </motion.div>

          {/* ===== JIRA ===== */}
          <motion.div
            className={`absolute left-[40%] top-[62%] w-[20%] transition-all duration-500`}
            animate={{
              boxShadow: isHighlighted('jira')
                ? '0 0 40px rgba(0, 149, 255, 0.5)'
                : '0 0 0px transparent',
            }}
          >
            <div className={`bg-bg-surface rounded-xl p-3 border-2 transition-colors ${
              isHighlighted('jira') ? 'border-blue-400' : 'border-text-muted/30'
            }`}>
              {/* Jira Logo */}
              <div className="flex justify-center mb-1">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <defs>
                    <linearGradient id="jira-blue-1" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#2684FF" />
                      <stop offset="100%" stopColor="#0052CC" />
                    </linearGradient>
                  </defs>
                  <path d="M15.967 0L6.073 9.893l9.894 9.894 9.893-9.894L15.967 0z" fill="url(#jira-blue-1)" />
                  <path d="M15.967 12.213L9.86 18.32l6.107 6.107 6.107-6.107-6.107-6.107z" fill="#2684FF" />
                  <path d="M6.073 9.893L0 15.967l6.073 6.073 6.073-6.073-6.073-6.074z" fill="url(#jira-blue-1)" />
                  <path d="M25.86 9.893l-6.073 6.074 6.073 6.073L32 15.967l-6.14-6.074z" fill="url(#jira-blue-1)" />
                </svg>
              </div>
              <div className="text-sm text-center text-text-secondary font-medium">Jira</div>
              <div className="text-[8px] text-center text-text-muted">REST API</div>

              {/* JSON response */}
              <AnimatePresence>
                {isHighlighted('msg-json-response') && (
                  <motion.div
                    className="mt-2 p-1.5 bg-blue-500/10 border border-blue-400/30 rounded font-mono text-[7px]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="text-blue-400">{'{'}</div>
                    <div className="pl-2 text-text-muted">
                      <div>&quot;key&quot;: <span className="text-blue-400">&quot;PROJ-123&quot;</span></div>
                      <div>&quot;summary&quot;: <span className="text-neon-green">&quot;OAuth...&quot;</span></div>
                      <div>&quot;points&quot;: <span className="text-neon-yellow">5</span></div>
                    </div>
                    <div className="text-blue-400">{'}'}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comment added indicator */}
              <AnimatePresence>
                {isHighlighted('comment-added') && (
                  <motion.div
                    className="mt-2 p-2 bg-neon-green/15 border-2 border-neon-green rounded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <div className="text-neon-green font-bold text-[9px] mb-1">✓ Comment Added!</div>
                    <div className="text-[7px] text-text-primary bg-bg-elevated p-1 rounded">
                      <div className="text-text-muted">PROJ-123:</div>
                      <div className="italic">&quot;Done! But we should look into XYZ&quot;</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-center mt-1 text-[9px] text-text-secondary">External Service</div>
          </motion.div>

          {/* ===== MESSAGE ARROWS AND LABELS ===== */}

          {/* MSG: Capabilities MCP → Copilot */}
          <AnimatePresence>
            {isHighlighted('msg-capabilities') && (
              <motion.div
                className="absolute left-[34%] top-[26%]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="px-2 py-1 bg-neon-green/20 border border-neon-green/50 rounded text-[8px] text-neon-green whitespace-nowrap">
                  ← capabilities: tools, resources
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MSG: First LLM call (prompt + tools) */}
          <AnimatePresence>
            {isHighlighted('msg-to-llm-1') && (
              <>
                <motion.div
                  className="absolute left-[34%] top-[48%] w-[31%] h-[2px]"
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-magenta border-y-4 border-y-transparent" />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Detailed prompt view for Step 7 */}
          <AnimatePresence>
            {isHighlighted('prompt-detail') && (
              <motion.div
                className="absolute left-[38%] top-[35%] w-[24%] bg-bg-surface border-2 border-neon-magenta rounded-lg p-3 font-mono text-[8px] shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)' }}
              >
                <div className="text-neon-magenta font-bold text-[10px] mb-2">Request to LLM:</div>
                <div className="text-text-muted mb-1">{'{'}</div>
                <div className="pl-2 space-y-1">
                  <div>
                    <span className="text-neon-cyan">&quot;messages&quot;</span>
                    <span className="text-text-muted">: [{'{'}</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-neon-cyan">&quot;role&quot;</span>
                    <span className="text-text-muted">: </span>
                    <span className="text-neon-green">&quot;user&quot;</span>
                    <span className="text-text-muted">,</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-neon-cyan">&quot;content&quot;</span>
                    <span className="text-text-muted">: </span>
                    <span className="text-neon-green">&quot;Get details...&quot;</span>
                  </div>
                  <div className="text-text-muted pl-0">{'}],'}</div>
                  <div className="mt-1">
                    <span className="text-neon-yellow">&quot;tools&quot;</span>
                    <span className="text-text-muted">: [{'{'}</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-neon-cyan">&quot;name&quot;</span>
                    <span className="text-text-muted">: </span>
                    <span className="text-neon-green">&quot;jira_get_issue&quot;</span>
                    <span className="text-text-muted">,</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-neon-cyan">&quot;parameters&quot;</span>
                    <span className="text-text-muted">: {'{'}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-neon-cyan">&quot;key&quot;</span>
                    <span className="text-text-muted">: </span>
                    <span className="text-neon-orange">&quot;string&quot;</span>
                  </div>
                  <div className="pl-2 text-text-muted">{'}'}</div>
                  <div className="text-text-muted">{'}]'}</div>
                </div>
                <div className="text-text-muted">{'}'}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MSG: Tool call back from LLM */}
          <AnimatePresence>
            {isHighlighted('msg-tool-call') && (
              <>
                <motion.div
                  className="absolute left-[34%] top-[52%] w-[31%] h-[2px]"
                  initial={{ scaleX: 0, transformOrigin: 'right' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-full bg-gradient-to-l from-neon-orange to-neon-yellow" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-r-8 border-r-neon-yellow border-y-4 border-y-transparent" />
                </motion.div>
                <motion.div
                  className="absolute left-[42%] top-[54%] px-2 py-1 bg-bg-surface border border-neon-orange rounded z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-[8px] text-neon-orange font-medium">← tool_call</div>
                  <div className="text-[7px] text-neon-yellow font-mono">jira_get_issue(&quot;PROJ-123&quot;)</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* MSG: Copilot → MCP */}
          <AnimatePresence>
            {isHighlighted('msg-to-mcp') && (
              <>
                {/* Arrow from VS Code to MCP */}
                <motion.svg
                  className="absolute left-[34%] top-[18%] w-[8%] h-[18%] z-10"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.path
                    d="M 5 95 L 90 10"
                    stroke="#FF9500"
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.polygon
                    points="82,5 95,8 88,20"
                    fill="#FF9500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                </motion.svg>
                {/* Label positioned above the arrow */}
                <motion.div
                  className="absolute left-[35%] top-[20%] z-20 px-2 py-1 bg-bg-surface border border-neon-orange rounded text-[9px] text-neon-orange font-mono whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  execute tool →
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* MSG: MCP → Jira */}
          <AnimatePresence>
            {isHighlighted('msg-api-call') && (
              <>
                <motion.div
                  className="absolute left-[49.5%] top-[44%] w-[2px] h-[18%]"
                  initial={{ scaleY: 0, transformOrigin: 'top' }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-full bg-gradient-to-b from-neon-green to-blue-400" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-t-8 border-t-blue-400 border-x-4 border-x-transparent" />
                </motion.div>
                <motion.div
                  className="absolute left-[51%] top-[50%] px-2 py-1 bg-bg-surface border border-blue-400 rounded text-[8px] text-blue-400 font-mono z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  GET /issue/PROJ-123
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* MSG: Jira → MCP (JSON) - Animated JSON document flowing up */}
          <AnimatePresence>
            {(isHighlighted('msg-json-response') || isHighlighted('json-to-mcp')) && (
              <>
                {/* Arrow going up */}
                <motion.div
                  className="absolute left-[49.5%] top-[44%] w-[2px] h-[18%]"
                  initial={{ scaleY: 0, transformOrigin: 'bottom' }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="h-full bg-gradient-to-t from-blue-400 to-neon-green" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-b-8 border-b-neon-green border-x-4 border-x-transparent" />
                </motion.div>
                {/* Animated JSON document floating up */}
                <motion.div
                  className="absolute left-[44%] px-2 py-1.5 bg-bg-surface border-2 border-blue-400 rounded shadow-lg z-20"
                  initial={{ top: '58%', opacity: 0, scale: 0.8 }}
                  animate={{ top: '46%', opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <div className="text-[7px] font-mono">
                    <div className="text-blue-400">{'{'}</div>
                    <div className="pl-1 text-text-muted">&quot;key&quot;: <span className="text-neon-cyan">&quot;PROJ-123&quot;</span></div>
                    <div className="pl-1 text-text-muted">&quot;summary&quot;: <span className="text-neon-green">&quot;OAuth...&quot;</span></div>
                    <div className="text-blue-400">{'}'}</div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* MSG: MCP → Copilot (tool result) - Animated JSON flowing to VS Code */}
          <AnimatePresence>
            {(isHighlighted('msg-tool-result') || isHighlighted('json-to-copilot')) && (
              <>
                {/* Arrow from MCP to VS Code */}
                <motion.svg
                  className="absolute left-[34%] top-[18%] w-[8%] h-[18%] z-10"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.path
                    d="M 95 10 L 5 90"
                    stroke="#00FF00"
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.polygon
                    points="10,82 2,95 18,90"
                    fill="#00FF00"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                </motion.svg>
                {/* Animated JSON document flowing to VS Code */}
                <motion.div
                  className="absolute px-2 py-1.5 bg-bg-surface border-2 border-neon-green rounded shadow-lg z-20"
                  initial={{ left: '40%', top: '20%', opacity: 0, scale: 0.8 }}
                  animate={{ left: '32%', top: '30%', opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                  <div className="text-[7px] font-mono">
                    <div className="text-neon-green font-bold">tool_result:</div>
                    <div className="text-text-muted">{'{'}PROJ-123 data{'}'}</div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* MSG: Second LLM call (augmented) */}
          <AnimatePresence>
            {isHighlighted('msg-to-llm-2') && (
              <>
                <motion.div
                  className="absolute left-[34%] top-[48%] w-[31%] h-[2px]"
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="h-full bg-gradient-to-r from-neon-green to-neon-cyan" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-cyan border-y-4 border-y-transparent" />
                </motion.div>
                <motion.div
                  className="absolute left-[45%] top-[50%] px-2 py-1 bg-neon-cyan/20 border border-neon-cyan/50 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-[8px] text-neon-cyan font-medium">Augmented →</div>
                  <div className="text-[7px] text-text-muted">msg + tool_result</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* MSG: Response stream */}
          <AnimatePresence>
            {isHighlighted('msg-response') && (
              <>
                <motion.div
                  className="absolute left-[34%] top-[52%] w-[31%] h-[2px]"
                  initial={{ scaleX: 0, transformOrigin: 'right' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="h-full bg-gradient-to-l from-neon-cyan to-neon-green" />
                </motion.div>
                {/* Streaming tokens */}
                {['Based', 'on', 'PROJ...'].map((token, i) => (
                  <motion.div
                    key={token}
                    className="absolute top-[53%] px-1 py-0.5 bg-neon-green/30 border border-neon-green/50 rounded text-[6px] text-neon-green font-mono"
                    initial={{ left: '63%', opacity: 0 }}
                    animate={{ left: '34%', opacity: [0, 1, 1, 0] }}
                    transition={{ delay: i * 0.25, duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    {token}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Fast-forward flow animation for comment scenario */}
          <AnimatePresence>
            {isHighlighted('fast-forward-flow') && (
              <>
                {/* Glowing data packet that travels through the flow */}
                <motion.div
                  className="absolute w-5 h-5 rounded-full z-30"
                  style={{
                    background: 'radial-gradient(circle, #00FFFF 0%, #00FFFF55 50%, transparent 70%)',
                    boxShadow: '0 0 25px #00FFFF, 0 0 50px #00FFFF',
                  }}
                  initial={{ left: '18%', top: '45%', scale: 0.5, opacity: 0 }}
                  animate={{
                    // VS Code → LLM → back → MCP → Jira
                    left: ['18%', '72%', '50%', '50%', '50%'],
                    top: ['45%', '45%', '45%', '22%', '68%'],
                    scale: [0.5, 1.2, 1, 1, 1.3],
                    opacity: [0, 1, 1, 1, 1],
                  }}
                  transition={{
                    duration: 4,
                    times: [0, 0.25, 0.45, 0.7, 1],
                    ease: 'easeInOut'
                  }}
                />

                {/* Step 1: Copilot → LLM arrow */}
                <motion.div
                  className="absolute left-[34%] top-[44%] w-[31%] h-[2px]"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 1, 0.3] }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                >
                  <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-magenta" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-6 border-l-neon-magenta border-y-3 border-y-transparent" />
                </motion.div>

                {/* Label 1: Request */}
                <motion.div
                  className="absolute left-[45%] top-[40%] px-2 py-1 bg-bg-surface/90 border border-neon-cyan/50 rounded text-[9px] z-20"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0, 1, 0.4] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="text-neon-cyan">→ Request</span>
                </motion.div>

                {/* Step 2: LLM → tool_call back */}
                <motion.div
                  className="absolute left-[34%] top-[48%] w-[31%] h-[2px]"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 1, 0.3] }}
                  transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: 'right' }}
                >
                  <div className="h-full bg-gradient-to-l from-neon-orange to-neon-yellow" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-r-6 border-r-neon-yellow border-y-3 border-y-transparent" />
                </motion.div>

                {/* Label 2: tool_call */}
                <motion.div
                  className="absolute left-[45%] top-[50%] px-2 py-1 bg-bg-surface/90 border border-neon-orange/50 rounded text-[9px] z-20"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: [0, 1, 0.4] }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <span className="text-neon-orange">← tool_call</span>
                </motion.div>

                {/* Step 3: Copilot → MCP (diagonal) */}
                <motion.svg
                  className="absolute left-[34%] top-[18%] w-[8%] h-[18%] z-10"
                  viewBox="0 0 100 100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.4] }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <motion.path
                    d="M 5 95 L 90 10"
                    stroke="#FF9500"
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  />
                  <motion.polygon
                    points="82,5 95,8 88,20"
                    fill="#FF9500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0 }}
                  />
                </motion.svg>

                {/* Label 3: jira_add_comment */}
                <motion.div
                  className="absolute left-[36%] top-[26%] px-2 py-1 bg-neon-yellow/20 border border-neon-yellow/60 rounded text-[10px] z-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0, 1, 0.8], scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                >
                  <span className="text-neon-yellow font-mono font-bold">jira_add_comment()</span>
                </motion.div>

                {/* Step 4: MCP → Jira (vertical) */}
                <motion.div
                  className="absolute left-[49.5%] top-[35%] w-[2px] h-[27%]"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 1, 0.5] }}
                  transition={{ duration: 0.6, delay: 2.5, ease: 'easeOut' }}
                  style={{ transformOrigin: 'top' }}
                >
                  <div className="h-full bg-gradient-to-b from-neon-green to-blue-400" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-t-6 border-t-blue-400 border-x-3 border-x-transparent" />
                </motion.div>

                {/* Label 4: API call */}
                <motion.div
                  className="absolute left-[52%] top-[48%] px-2 py-1 bg-bg-surface/90 border border-blue-400/50 rounded text-[9px] z-20"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{ duration: 0.6, delay: 2.7 }}
                >
                  <span className="text-blue-400">POST comment</span>
                </motion.div>

                {/* Final highlight on Jira */}
                <motion.div
                  className="absolute left-[40%] top-[62%] w-[20%] h-[18%] border-2 border-neon-green rounded-xl z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: [0, 0, 1], scale: 1 }}
                  transition={{ duration: 0.5, delay: 3.2 }}
                  style={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)' }}
                />

                {/* "Fast forward" indicator */}
                <motion.div
                  className="absolute left-[5%] top-[15%] flex items-center gap-2 px-3 py-1.5 bg-bg-surface/90 border border-neon-cyan/40 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-neon-cyan text-lg">⏩</span>
                  <span className="text-[10px] text-text-secondary">Same flow, now with add_comment</span>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Code loop visualization */}
          <AnimatePresence>
            {isHighlighted('code-loop') && (
              <>
                <motion.div
                  className="absolute left-[2%] top-[30%] w-[81%] h-[35%] border-2 border-dashed border-neon-cyan/30 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                {/* Bidirectional arrows */}
                <motion.svg
                  className="absolute left-[34%] top-[45%] w-[31%] h-[10%]"
                  viewBox="0 0 200 40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.path d="M 10 15 L 180 15" stroke="#00FFFF" strokeWidth="2" />
                  <motion.polygon points="175,10 185,15 175,20" fill="#00FFFF" />
                  <motion.path d="M 180 25 L 10 25" stroke="#00FF00" strokeWidth="2" />
                  <motion.polygon points="15,20 5,25 15,30" fill="#00FF00" />
                </motion.svg>
                <motion.div
                  className="absolute left-[45%] top-[55%] px-2 py-1 bg-bg-surface border border-neon-cyan/50 rounded text-[8px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-neon-cyan font-medium">Direct Loop</div>
                  <div className="text-text-muted text-[7px]">No MCP needed!</div>
                </motion.div>
                {/* MCP grayed out indicator */}
                <motion.div
                  className="absolute left-[40%] top-[10%] w-[20%] h-[22%] bg-black/40 rounded-xl flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-[9px] text-text-muted">MCP idle</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Phase indicators at bottom */}
          <div className="absolute bottom-[4%] left-[3%] right-[3%] flex justify-between text-[8px]">
            <div className={`px-2 py-1 rounded ${currentStep >= 1 && currentStep < 4 ? 'bg-neon-green/20 text-neon-green' : 'text-text-muted'}`}>
              1. Init
            </div>
            <div className={`px-2 py-1 rounded ${currentStep >= 4 && currentStep < 8 ? 'bg-neon-magenta/20 text-neon-magenta' : 'text-text-muted'}`}>
              2. First Call
            </div>
            <div className={`px-2 py-1 rounded ${currentStep >= 8 && currentStep < 13 ? 'bg-neon-orange/20 text-neon-orange' : 'text-text-muted'}`}>
              3. Tool Exec
            </div>
            <div className={`px-2 py-1 rounded ${currentStep >= 13 && currentStep < 17 ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-text-muted'}`}>
              4. Augmented
            </div>
            <div className={`px-2 py-1 rounded ${currentStep >= 17 ? 'bg-neon-green/20 text-neon-green' : 'text-text-muted'}`}>
              5. Code Loop
            </div>
          </div>
        </div>
      </ZoomContainer>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={flow.currentStep}
        totalSteps={flow.totalSteps}
        stepData={flow.currentStepData}
        isFirstStep={flow.isFirstStep}
        isLastStep={flow.isLastStep}
      />
    </div>
  );

  if (mode === 'presentation') {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main>{content}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar isOpen={true} />
        </div>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1">{content}</main>
      </div>
    </div>
  );
}
