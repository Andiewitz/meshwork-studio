import React from 'react';
import type { Node, Edge } from 'reactflow';

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
}

export type CanvasLayer = 'backend' | 'devops';

// Represents a Flow document in Firestore 'flows' collection
export interface FlowData {
  id: string;
  ownerId: string;
  title: string;
  icon?: string;
  // Primary (Backend) Layer
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  // DevOps Layer
  devopsNodes?: Node<FlowNodeData>[];
  devopsEdges?: Edge[];
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