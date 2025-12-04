'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { ZoomContainer, StepIndicator } from '@/components/ui';
import { usePresentationFlow, FlowStep } from '@/hooks/usePresentationFlow';
import { useAppStore } from '@/store/useAppStore';

// RAG flow steps
const RAG_STEPS: FlowStep[] = [
  {
    id: 'intro',
    title: 'Retrieval-Augmented Generation (RAG)',
    description: 'RAG enhances LLM responses by retrieving relevant information from a knowledge base. Let\'s see how a FLIR thermal camera manual query flows through the system.',
    zoom: 1,
    focusX: 50,
    focusY: 50,
    duration: 0,
  },
  {
    id: 'ingest-docs',
    title: 'Document Ingestion: Source Documents',
    description: 'First, we need to prepare our knowledge base. FLIR thermal camera manuals (PDFs, docs) are loaded into the system for processing.',
    zoom: 1.5,
    focusX: 15,
    focusY: 25,
    duration: 0,
    highlights: ['documents'],
  },
  {
    id: 'ingest-chunk',
    title: 'Document Ingestion: Chunking',
    description: 'Documents are split into smaller chunks (typically 500-1000 tokens). This allows for precise retrieval of relevant sections.',
    zoom: 2,
    focusX: 30,
    focusY: 25,
    duration: 0,
    highlights: ['chunker'],
  },
  {
    id: 'ingest-embed',
    title: 'Document Ingestion: Creating Embeddings',
    description: 'Each chunk is converted to a vector (embedding) using an embedding model. These vectors capture semantic meaning in ~1536 dimensions.',
    zoom: 2.2,
    focusX: 50,
    focusY: 25,
    duration: 0,
    highlights: ['embedder'],
  },
  {
    id: 'ingest-store',
    title: 'Document Ingestion: Vector Storage',
    description: 'Vectors are indexed in Azure AI Search for fast similarity search. PostgreSQL with pgvector is a simpler alternative if you already have Postgres in your stack.',
    zoom: 1.8,
    focusX: 70,
    focusY: 25,
    duration: 0,
    highlights: ['vectordb'],
  },
  {
    id: 'query-start',
    title: 'Query: User Question',
    description: '"How much does my camera weigh?" - The user asks a question through the client application.',
    zoom: 1.5,
    focusX: 10,
    focusY: 70,
    duration: 0,
    highlights: ['client'],
  },
  {
    id: 'query-clarify',
    title: 'Query: Clarification Needed',
    description: 'The system has multiple FLIR cameras in its knowledge base. Before searching, it asks the user to specify which camera they mean.',
    zoom: 1.5,
    focusX: 10,
    focusY: 70,
    duration: 0,
    highlights: ['client', 'clarification'],
  },
  {
    id: 'query-clarify-response',
    title: 'Query: User Specifies Camera',
    description: 'The user responds: "The FLIR E8 Pro" - Now we have a specific query to search for.',
    zoom: 1.5,
    focusX: 10,
    focusY: 70,
    duration: 0,
    highlights: ['client', 'clarification-response'],
  },
  {
    id: 'query-api',
    title: 'Query: API Layer',
    description: 'The complete question is sent to the backend API, which orchestrates the RAG pipeline.',
    zoom: 1.3,
    focusX: 30,
    focusY: 70,
    duration: 0,
    highlights: ['api'],
  },
  {
    id: 'query-embed',
    title: 'Query: Question Embedding',
    description: 'The question "How much does the FLIR E8 Pro weigh?" is converted to a vector using the same embedding model.',
    zoom: 2,
    focusX: 50,
    focusY: 55,
    duration: 0,
    highlights: ['query-embedder'],
  },
  {
    id: 'query-search',
    title: 'Query: Vector Similarity Search',
    description: 'The query vector is compared against all stored vectors. Cosine similarity measures how "close" vectors are in the embedding space.',
    zoom: 2,
    focusX: 85,
    focusY: 30,
    duration: 0,
    highlights: ['similarity-viz'],
  },
  {
    id: 'query-topk',
    title: 'Query: Top-K Retrieval (K=3)',
    description: 'The 3 most similar chunks are retrieved. Notice how they all relate to FLIR E8 Pro specifications, weight, and physical dimensions.',
    zoom: 1.8,
    focusX: 85,
    focusY: 30,
    duration: 0,
    highlights: ['vectordb', 'topk-results'],
  },
  {
    id: 'query-context',
    title: 'Query: Context Assembly',
    description: 'All 3 retrieved chunks are combined with the original question to form an augmented prompt with comprehensive context.',
    zoom: 2.2,
    focusX: 55,
    focusY: 82,
    duration: 0,
    highlights: ['context'],
  },
  {
    id: 'query-llm',
    title: 'Query: LLM Generation',
    description: 'The augmented prompt (question + 3 context chunks) is sent to the LLM. The model processes the prompt token by token, generating a grounded response.',
    zoom: 2,
    focusX: 78,
    focusY: 78,
    duration: 0,
    highlights: ['llm', 'token-generation'],
  },
  {
    id: 'query-stream',
    title: 'Query: Streaming Response',
    description: 'Tokens stream back through the API to the client: "The FLIR E8 Pro weighs approximately 575 grams including battery..."',
    zoom: 1.3,
    focusX: 40,
    focusY: 70,
    duration: 0,
    highlights: ['streaming'],
  },
  {
    id: 'answer-revealed',
    title: 'Query: Answer Revealed',
    description: 'The complete answer appears in the client, grounded in the actual FLIR E8 Pro manual data retrieved from the vector database.',
    zoom: 2,
    focusX: 12,
    focusY: 75,
    duration: 0,
    highlights: ['client', 'answer-complete'],
  },
  {
    id: 'complete',
    title: 'RAG Complete',
    description: 'The user receives an accurate answer grounded in their actual FLIR manual, not generic training data. RAG reduces hallucinations and provides up-to-date information.',
    zoom: 1,
    focusX: 50,
    focusY: 50,
    duration: 0,
  },
];

// Stored vectors in the database (for visualization)
const STORED_VECTORS = [
  { id: 1, label: 'E8 Pro weight', vector: [0.89, 0.12, -0.34, 0.67], similarity: 0.94 },
  { id: 2, label: 'E8 Pro specs', vector: [0.85, 0.18, -0.29, 0.61], similarity: 0.89 },
  { id: 3, label: 'E8 Pro dimensions', vector: [0.82, 0.21, -0.31, 0.58], similarity: 0.85 },
  { id: 4, label: 'T540 weight', vector: [0.45, 0.67, -0.12, 0.34], similarity: 0.52 },
  { id: 5, label: 'ONE Pro battery', vector: [0.23, 0.78, 0.15, -0.45], similarity: 0.31 },
];

const QUERY_VECTOR = [0.91, 0.10, -0.35, 0.69];

export default function RAGPage() {
  const mode = useAppStore((state) => state.mode);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const flow = usePresentationFlow({ steps: RAG_STEPS });
  const { currentStep, currentStepData } = flow;

  const isHighlighted = (id: string) => currentStepData.highlights?.includes(id);

  const content = (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-bg-primary">
      <ZoomContainer
        zoom={currentStepData.zoom}
        focusX={currentStepData.focusX}
        focusY={currentStepData.focusY}
        className="w-full h-full"
      >
        <div className="relative w-full h-full p-8">
          {/* Title */}
          <motion.h1
            className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl font-display font-bold text-neon-cyan text-glow-cyan z-10"
            animate={{ opacity: currentStepData.zoom > 1.5 ? 0 : 1 }}
          >
            RAG Architecture
          </motion.h1>

          {/* ===== INGESTION PIPELINE (Top) ===== */}
          <div className="absolute top-[15%] left-[5%] right-[5%] h-[25%]">
            {/* Ingestion label */}
            <div className="absolute -top-8 left-0 text-sm font-mono text-text-muted">
              Document Ingestion Pipeline
            </div>

            {/* Documents */}
            <motion.div
              className={`absolute left-[0%] top-1/2 -translate-y-1/2 w-32 transition-all duration-500 ${
                isHighlighted('documents') ? 'scale-110' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('documents')
                  ? '0 0 40px rgba(0, 255, 255, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('documents') ? 'border-neon-cyan' : 'border-text-muted/30'
              }`}>
                <div className="text-3xl mb-2 text-center">📄</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  FLIR Manuals
                </div>
                <div className="mt-2 space-y-1">
                  {['FLIR E8 Pro.pdf', 'FLIR T540.pdf', 'FLIR ONE Pro.pdf'].map((doc, i) => (
                    <motion.div
                      key={doc}
                      className="text-[10px] bg-bg-elevated rounded px-2 py-1 text-text-muted truncate"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {doc}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Arrow to Chunker */}
            <motion.div
              className="absolute left-[15%] top-1/2 w-[12%] h-0.5 -translate-y-1/2"
              animate={{
                background: currentStep >= 2
                  ? 'linear-gradient(90deg, #00FFFF, #FF00FF)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-magenta border-y-4 border-y-transparent"
                animate={{ opacity: currentStep >= 2 ? 1 : 0.3 }}
              />
            </motion.div>

            {/* Chunker */}
            <motion.div
              className={`absolute left-[28%] top-1/2 -translate-y-1/2 w-36 transition-all duration-500 ${
                isHighlighted('chunker') ? 'scale-110' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('chunker')
                  ? '0 0 40px rgba(255, 0, 255, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('chunker') ? 'border-neon-magenta' : 'border-text-muted/30'
              }`}>
                <div className="text-3xl mb-2 text-center">✂️</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  Text Chunker
                </div>
                <AnimatePresence>
                  {isHighlighted('chunker') && (
                    <motion.div
                      className="mt-2 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {['Chunk 1: "The FLIR E8 Pro..."', 'Chunk 2: "Weight: 575g..."', 'Chunk 3: "IR resolution..."'].map((chunk, i) => (
                        <motion.div
                          key={i}
                          className="text-[9px] bg-neon-magenta/20 border border-neon-magenta/30 rounded px-2 py-1 text-neon-magenta truncate"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                        >
                          {chunk}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Arrow to Embedder */}
            <motion.div
              className="absolute left-[45%] top-1/2 w-[10%] h-0.5 -translate-y-1/2"
              animate={{
                background: currentStep >= 3
                  ? 'linear-gradient(90deg, #FF00FF, #FFFF00)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-yellow border-y-4 border-y-transparent"
                animate={{ opacity: currentStep >= 3 ? 1 : 0.3 }}
              />
            </motion.div>

            {/* Embedding Model */}
            <motion.div
              className={`absolute left-[56%] top-1/2 -translate-y-1/2 w-40 transition-all duration-500 ${
                isHighlighted('embedder') ? 'scale-110' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('embedder')
                  ? '0 0 40px rgba(255, 255, 0, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('embedder') ? 'border-neon-yellow' : 'border-text-muted/30'
              }`}>
                <div className="text-3xl mb-2 text-center">🧮</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  Embedding Model
                </div>
                <div className="text-[10px] text-center text-text-muted mt-1">
                  text-embedding-3-small
                </div>
                <AnimatePresence>
                  {isHighlighted('embedder') && (
                    <motion.div
                      className="mt-3 p-2 bg-bg-elevated rounded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="text-[8px] text-text-muted mb-1">Vector (1536 dims):</div>
                      <div className="font-mono text-[8px] text-neon-yellow break-all">
                        [0.023, -0.156, 0.892, ...]
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Arrow to Vector DB */}
            <motion.div
              className="absolute left-[78%] top-1/2 w-[8%] h-0.5 -translate-y-1/2"
              animate={{
                background: currentStep >= 4
                  ? 'linear-gradient(90deg, #FFFF00, #00FF00)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-green border-y-4 border-y-transparent"
                animate={{ opacity: currentStep >= 4 ? 1 : 0.3 }}
              />
            </motion.div>

            {/* Vector Database */}
            <motion.div
              className={`absolute right-[0%] top-1/2 -translate-y-1/2 w-44 transition-all duration-500 ${
                isHighlighted('vectordb') || isHighlighted('similarity-viz') || isHighlighted('topk-results')
                  ? 'scale-110'
                  : ''
              }`}
              animate={{
                boxShadow: isHighlighted('vectordb') || isHighlighted('similarity-viz') || isHighlighted('topk-results')
                  ? '0 0 40px rgba(0, 255, 0, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('vectordb') || isHighlighted('similarity-viz') || isHighlighted('topk-results')
                  ? 'border-neon-green'
                  : 'border-text-muted/30'
              }`}>
                {/* Database cylinder icon */}
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5" />
                    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
                    <path d="M3 8.5c0 1.66 4.03 3 9 3s9-1.34 9-3" strokeDasharray="2 2" opacity="0.5" />
                    <path d="M3 15.5c0 1.66 4.03 3 9 3s9-1.34 9-3" strokeDasharray="2 2" opacity="0.5" />
                  </svg>
                </div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  Vector Database
                </div>
                <div className="text-[10px] text-center text-text-muted mt-1">
                  Azure AI Search
                </div>
                <div className="text-[8px] text-center text-text-muted/60 mt-0.5">
                  (or PostgreSQL + pgvector)
                </div>

                {/* Vector Similarity Visualization */}
                <AnimatePresence>
                  {(isHighlighted('similarity-viz') || isHighlighted('topk-results')) && (
                    <motion.div
                      className="mt-3 space-y-1.5"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {/* Query vector */}
                      <div className="p-1.5 bg-neon-cyan/20 border border-neon-cyan/50 rounded">
                        <div className="text-[8px] text-neon-cyan font-medium">Query Vector:</div>
                        <div className="font-mono text-[7px] text-neon-cyan">
                          [{QUERY_VECTOR.join(', ')}]
                        </div>
                      </div>

                      {/* Stored vectors with similarity */}
                      <div className="text-[8px] text-text-muted">Comparing with stored vectors:</div>
                      {STORED_VECTORS.map((vec, i) => {
                        const isTopK = i < 3;
                        const showResult = isHighlighted('topk-results');

                        return (
                          <motion.div
                            key={vec.id}
                            className={`p-1.5 rounded border ${
                              isTopK && showResult
                                ? 'bg-neon-green/20 border-neon-green/50'
                                : 'bg-bg-elevated border-text-muted/20'
                            }`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[8px] ${isTopK && showResult ? 'text-neon-green' : 'text-text-muted'}`}>
                                {vec.label}
                              </span>
                              <motion.span
                                className={`text-[9px] font-mono font-bold ${
                                  isTopK ? 'text-neon-green' : 'text-text-muted'
                                }`}
                                initial={{ scale: 1 }}
                                animate={isHighlighted('similarity-viz') ? {
                                  scale: [1, 1.2, 1],
                                } : {}}
                                transition={{ delay: i * 0.15 }}
                              >
                                {vec.similarity.toFixed(2)}
                              </motion.span>
                            </div>
                            {/* Similarity bar */}
                            <div className="mt-1 h-1 bg-bg-primary rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${
                                  isTopK ? 'bg-neon-green' : 'bg-text-muted/50'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${vec.similarity * 100}%` }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Top-K indicator */}
                      {isHighlighted('topk-results') && (
                        <motion.div
                          className="mt-2 p-2 bg-neon-green/10 border border-neon-green rounded text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="text-[10px] text-neon-green font-bold">
                            Top 3 chunks retrieved!
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simple view when not in similarity mode */}
                <AnimatePresence>
                  {isHighlighted('vectordb') && !isHighlighted('similarity-viz') && !isHighlighted('topk-results') && (
                    <motion.div
                      className="mt-3 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {[
                        { score: 0.94, text: 'Weight: 575g...' },
                        { score: 0.89, text: 'FLIR E8 specs...' },
                        { score: 0.85, text: 'Dimensions...' },
                      ].map((result, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-1 text-[8px] bg-neon-green/10 border border-neon-green/30 rounded px-1.5 py-1"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <span className="text-neon-green font-mono">{result.score}</span>
                          <span className="text-text-muted truncate">{result.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ===== QUERY PIPELINE (Bottom) ===== */}
          <div className="absolute top-[55%] left-[5%] right-[5%] h-[35%]">
            {/* Query label */}
            <div className="absolute -top-8 left-0 text-sm font-mono text-text-muted">
              Query Pipeline
            </div>

            {/* Client App */}
            <motion.div
              className={`absolute left-[0%] top-[30%] -translate-y-1/2 w-40 transition-all duration-500 ${
                isHighlighted('client') || isHighlighted('clarification') || isHighlighted('clarification-response') || isHighlighted('streaming') || isHighlighted('answer-complete')
                  ? 'scale-105'
                  : ''
              }`}
              animate={{
                boxShadow: isHighlighted('client') || isHighlighted('clarification') || isHighlighted('clarification-response') || isHighlighted('streaming') || isHighlighted('answer-complete')
                  ? '0 0 40px rgba(0, 255, 255, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('client') || isHighlighted('clarification') || isHighlighted('clarification-response') || isHighlighted('streaming') || isHighlighted('answer-complete')
                  ? 'border-neon-cyan'
                  : 'border-text-muted/30'
              }`}>
                <div className="text-3xl mb-2 text-center">💻</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  Client App
                </div>

                {/* Initial question */}
                <AnimatePresence>
                  {(isHighlighted('client') && !isHighlighted('clarification') && !isHighlighted('answer-complete')) && (
                    <motion.div
                      className="mt-2 p-2 bg-bg-elevated rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="text-[9px] text-neon-cyan">
                        &quot;How much does my camera weigh?&quot;
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Clarification dialog */}
                <AnimatePresence>
                  {isHighlighted('clarification') && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="p-2 bg-bg-elevated rounded">
                        <div className="text-[8px] text-text-muted mb-1">You:</div>
                        <div className="text-[9px] text-neon-cyan">
                          &quot;How much does my camera weigh?&quot;
                        </div>
                      </div>
                      <div className="p-2 bg-neon-yellow/10 border border-neon-yellow/30 rounded">
                        <div className="text-[8px] text-neon-yellow mb-1">Assistant:</div>
                        <div className="text-[9px] text-text-secondary">
                          &quot;Which FLIR camera do you have? I have manuals for the E8 Pro, T540, and ONE Pro.&quot;
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User response to clarification */}
                <AnimatePresence>
                  {isHighlighted('clarification-response') && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="p-2 bg-bg-elevated rounded">
                        <div className="text-[8px] text-text-muted mb-1">You:</div>
                        <div className="text-[9px] text-neon-cyan">
                          &quot;How much does my camera weigh?&quot;
                        </div>
                      </div>
                      <div className="p-2 bg-neon-yellow/10 border border-neon-yellow/30 rounded">
                        <div className="text-[8px] text-neon-yellow mb-1">Assistant:</div>
                        <div className="text-[9px] text-text-secondary">
                          &quot;Which FLIR camera do you have?&quot;
                        </div>
                      </div>
                      <motion.div
                        className="p-2 bg-neon-green/10 border border-neon-green/30 rounded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="text-[8px] text-neon-green mb-1">You:</div>
                        <div className="text-[9px] text-neon-green font-medium">
                          &quot;The FLIR E8 Pro&quot;
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Streaming response */}
                <AnimatePresence>
                  {isHighlighted('streaming') && (
                    <motion.div
                      className="mt-2 p-2 bg-neon-green/10 border border-neon-green/30 rounded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="text-[9px] text-neon-green">
                        &quot;The FLIR E8 Pro weighs approximately 575 grams including battery...&quot;
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                          |
                        </motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Complete answer revealed */}
                <AnimatePresence>
                  {isHighlighted('answer-complete') && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="p-1.5 bg-bg-elevated rounded">
                        <div className="text-[8px] text-text-muted mb-0.5">You:</div>
                        <div className="text-[8px] text-neon-cyan">
                          &quot;How much does the FLIR E8 Pro weigh?&quot;
                        </div>
                      </div>
                      <motion.div
                        className="p-2 bg-neon-green/10 border border-neon-green/30 rounded"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="text-[8px] text-neon-green mb-1">Assistant:</div>
                        <div className="text-[8px] text-text-secondary space-y-1">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            The <span className="text-neon-green font-medium">FLIR E8 Pro</span> weighs approximately <span className="text-neon-green font-medium">575 grams</span> including the battery.
                          </motion.div>
                          <motion.div
                            className="text-text-muted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            Dimensions: 244 × 95 × 140 mm
                          </motion.div>
                          <motion.div
                            className="text-[7px] text-text-muted/70 pt-1 border-t border-text-muted/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                          >
                            📖 Source: FLIR E8 Pro Manual
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Arrow to API */}
            <motion.div
              className="absolute left-[16%] top-[30%] w-[10%] h-0.5 -translate-y-1/2"
              animate={{
                background: currentStep >= 8
                  ? 'linear-gradient(90deg, #00FFFF, #FF9500)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-orange border-y-4 border-y-transparent"
                animate={{ opacity: currentStep >= 8 ? 1 : 0.3 }}
              />
            </motion.div>

            {/* API Layer */}
            <motion.div
              className={`absolute left-[27%] top-[30%] -translate-y-1/2 w-36 transition-all duration-500 ${
                isHighlighted('api') ? 'scale-110' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('api')
                  ? '0 0 40px rgba(255, 149, 0, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('api') ? 'border-neon-orange' : 'border-text-muted/30'
              }`}>
                <div className="text-3xl mb-2 text-center">🔌</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  Web API
                </div>
                <div className="text-[10px] text-center text-text-muted mt-1">
                  /api/chat
                </div>
                <AnimatePresence>
                  {isHighlighted('api') && (
                    <motion.div
                      className="mt-2 space-y-1 text-[8px] font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-neon-orange">1. Embed query</div>
                      <div className="text-neon-orange">2. Search vectors</div>
                      <div className="text-neon-orange">3. Build prompt</div>
                      <div className="text-neon-orange">4. Call LLM</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Arrow to Query Embedder */}
            <motion.div
              className="absolute left-[42%] top-[15%] w-[12%] h-0.5"
              animate={{
                background: currentStep >= 9
                  ? 'linear-gradient(90deg, #FF9500, #FFFF00)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-yellow border-y-4 border-y-transparent"
                animate={{ opacity: currentStep >= 9 ? 1 : 0.3 }}
              />
            </motion.div>

            {/* Query Embedding (reusing embedder) */}
            <motion.div
              className={`absolute left-[55%] top-[5%] w-36 transition-all duration-500 ${
                isHighlighted('query-embedder') ? 'scale-110' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('query-embedder')
                  ? '0 0 40px rgba(255, 255, 0, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-3 border-2 ${
                isHighlighted('query-embedder') ? 'border-neon-yellow' : 'border-text-muted/30'
              }`}>
                <div className="text-2xl mb-1 text-center">🧮</div>
                <div className="text-[10px] text-center text-text-secondary font-medium">
                  Query → Vector
                </div>
                {/* Same model indicator */}
                <div className="text-[8px] text-center text-neon-yellow/70 mt-0.5">
                  text-embedding-3-small
                </div>
                <AnimatePresence>
                  {isHighlighted('query-embedder') && (
                    <motion.div
                      className="mt-2 p-2 bg-bg-elevated rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-[8px] text-text-muted mb-1">&quot;FLIR E8 Pro weight&quot;</div>
                      <div className="font-mono text-[7px] text-neon-yellow break-all">
                        [{QUERY_VECTOR.join(', ')}]
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Dotted line connecting the two embedding models (same model) */}
            <motion.svg
              className="absolute left-[58%] top-[-42%] w-[10%] h-[50%] pointer-events-none"
              viewBox="0 0 100 200"
              fill="none"
              animate={{
                opacity: isHighlighted('query-embedder') ? 1 : 0.3,
              }}
            >
              <motion.path
                d="M 50 200 L 50 0"
                stroke="#FFFF00"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
              {/* Arrow pointing up to ingestion embedder */}
              <motion.polygon
                points="45,10 50,0 55,10"
                fill="#FFFF00"
                opacity={isHighlighted('query-embedder') ? 1 : 0.3}
              />
            </motion.svg>

            {/* "Same Model" label */}
            <AnimatePresence>
              {isHighlighted('query-embedder') && (
                <motion.div
                  className="absolute left-[60%] top-[-15%] px-2 py-1 bg-neon-yellow/20 border border-neon-yellow/50 rounded text-[9px] text-neon-yellow font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  ↑ Same Model
                </motion.div>
              )}
            </AnimatePresence>

            {/* Curved arrow to Vector DB (similarity search) */}
            <motion.svg
              className="absolute left-[67%] top-[-25%] w-[20%] h-[40%]"
              viewBox="0 0 100 100"
              fill="none"
            >
              <motion.path
                d="M 10 80 Q 50 80 70 40 Q 90 0 90 -20"
                stroke={currentStep >= 10 ? '#00FF00' : 'rgba(255,255,255,0.2)'}
                strokeWidth="2"
                strokeDasharray="4 2"
                fill="none"
              />
            </motion.svg>

            {/* Context Assembly - Now shows all 3 chunks */}
            <motion.div
              className={`absolute left-[42%] top-[55%] w-52 transition-all duration-500 ${
                isHighlighted('context') ? 'scale-105' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('context')
                  ? '0 0 40px rgba(255, 0, 255, 0.5)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-bg-surface rounded-xl p-4 border-2 ${
                isHighlighted('context') ? 'border-neon-magenta' : 'border-text-muted/30'
              }`}>
                <div className="text-2xl mb-2 text-center">📝</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  Augmented Prompt
                </div>
                <AnimatePresence>
                  {isHighlighted('context') && (
                    <motion.div
                      className="mt-2 space-y-1.5 text-[8px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* 3 Context chunks */}
                      <div className="p-1.5 bg-neon-green/10 rounded border border-neon-green/30">
                        <div className="text-neon-green font-medium mb-0.5">Chunk 1 (0.94):</div>
                        <div className="text-text-muted">&quot;FLIR E8 Pro weight: 575g including battery...&quot;</div>
                      </div>
                      <div className="p-1.5 bg-neon-green/10 rounded border border-neon-green/30">
                        <div className="text-neon-green font-medium mb-0.5">Chunk 2 (0.89):</div>
                        <div className="text-text-muted">&quot;E8 Pro specifications: IR resolution 320x240...&quot;</div>
                      </div>
                      <div className="p-1.5 bg-neon-green/10 rounded border border-neon-green/30">
                        <div className="text-neon-green font-medium mb-0.5">Chunk 3 (0.85):</div>
                        <div className="text-text-muted">&quot;Dimensions: 244x95x140mm, ruggedized...&quot;</div>
                      </div>
                      {/* Question */}
                      <div className="p-1.5 bg-neon-cyan/10 rounded border border-neon-cyan/30 mt-2">
                        <div className="text-neon-cyan font-medium">Question:</div>
                        <div className="text-text-muted">&quot;How much does the FLIR E8 Pro weigh?&quot;</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Arrow to LLM */}
            <motion.div
              className="absolute left-[70%] top-[55%] w-[10%] h-0.5 -translate-y-1/2"
              animate={{
                background: currentStep >= 13
                  ? 'linear-gradient(90deg, #FF00FF, #00FFFF)'
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-neon-cyan border-y-4 border-y-transparent"
                animate={{ opacity: currentStep >= 13 ? 1 : 0.3 }}
              />
            </motion.div>

            {/* LLM */}
            <motion.div
              className={`absolute right-[5%] top-[40%] -translate-y-1/2 w-40 transition-all duration-500 ${
                isHighlighted('llm') || isHighlighted('token-generation') ? 'scale-110' : ''
              }`}
              animate={{
                boxShadow: isHighlighted('llm') || isHighlighted('token-generation')
                  ? '0 0 50px rgba(0, 255, 255, 0.6)'
                  : '0 0 0px transparent',
              }}
            >
              <div className={`bg-gradient-to-br from-bg-surface to-bg-elevated rounded-xl p-4 border-2 ${
                isHighlighted('llm') || isHighlighted('token-generation') ? 'border-neon-cyan' : 'border-text-muted/30'
              }`}>
                <div className="text-3xl mb-2 text-center">🧠</div>
                <div className="text-xs text-center text-text-secondary font-medium">
                  LLM
                </div>
                <div className="text-[10px] text-center text-text-muted mt-1">
                  GPT-4 / Claude
                </div>
                <AnimatePresence>
                  {(isHighlighted('llm') || isHighlighted('token-generation') || isHighlighted('streaming')) && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex justify-center gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-neon-cyan rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              delay: i * 0.15,
                              repeat: Infinity,
                              duration: 0.8,
                            }}
                          />
                        ))}
                      </div>
                      {/* Token generation label */}
                      {isHighlighted('token-generation') && (
                        <motion.div
                          className="mt-2 text-[9px] text-center text-neon-cyan"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Generating tokens...
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Flying tokens animation */}
              <AnimatePresence>
                {isHighlighted('token-generation') && (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                    {['The', 'FLIR', 'E8', 'Pro', 'weighs', '575g'].map((token, i) => (
                      <motion.div
                        key={`${token}-${i}`}
                        className="absolute px-2 py-1 bg-neon-green/20 border border-neon-green/50 rounded text-[10px] text-neon-green font-mono whitespace-nowrap"
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                        animate={{
                          x: [-20, -80, -140],
                          y: [0, (i % 2 === 0 ? -15 : 15), 0],
                          opacity: [0, 1, 1, 0],
                          scale: [0.5, 1, 1, 0.8],
                        }}
                        transition={{
                          delay: i * 0.4,
                          duration: 1.6,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: 'easeOut',
                        }}
                      >
                        {token}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Streaming response arrow (back to client) */}
            <AnimatePresence>
              {isHighlighted('streaming') && (
                <motion.div
                  className="absolute left-[17%] top-[60%] w-[58%] h-0.5"
                  initial={{ scaleX: 0, transformOrigin: 'right' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1 }}
                >
                  <div className="h-full bg-gradient-to-l from-neon-cyan via-neon-green to-neon-cyan" />
                  {/* Streaming tokens animation */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-neon-green rounded-full"
                      initial={{ right: '0%', opacity: 0 }}
                      animate={{
                        right: '100%',
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        delay: i * 0.3,
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
