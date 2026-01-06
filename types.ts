import React from 'react';
import * as ReactFlow from 'reactflow';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Ensure Node Data is always serializable for Firestore
export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  icon?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  config?: Record<string, unknown>;
  layer?: 'backend' | 'devops';
  subType?: 'vpc' | 'subnet' | 'internet'; // Specific styling for boundaries
  // Nested Flow Data
  subFlow?: {
    nodes: ReactFlow.Node[];
    edges: ReactFlow.Edge[];
  };
}

export type CanvasLayer = 'backend' | 'devops';

// Represents a Flow document in Firestore 'flows' collection
export interface FlowData {
  id: string;
  ownerId: string;
  title: string;
  icon?: string;
  // Primary (Backend) Layer
  nodes: ReactFlow.Node<FlowNodeData>[];
  edges: ReactFlow.Edge[];
  // DevOps Layer
  devopsNodes?: ReactFlow.Node<FlowNodeData>[];
  devopsEdges?: ReactFlow.Edge[];
  createdAt: number;
  updatedAt: number;
  isPublic?: boolean;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}