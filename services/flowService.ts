import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseService';
import { FlowData } from '../types';
import type { Node, Edge } from 'reactflow';
import { templates } from '../data/templates';

const COLLECTION_NAME = 'flows';
const GUEST_ID = 'dev-guest-123';
const LOCAL_STORAGE_KEY = 'meshwork_local_flows';

// Helper to get local flows
const getLocalFlows = (): FlowData[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse local flows", e);
    return [];
  }
};

// Helper to save local flows
const saveLocalFlows = (flows: FlowData[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flows));
};

// Helper to generate unique ID
const generateId = (prefix: string = 'local') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const flowService = {
  // Create a new flow (Empty)
  createFlow: async (ownerId: string, title: string) => {
    const newFlow: FlowData = {
      id: '', // Placeholder, will be assigned
      ownerId,
      title,
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic: false
    };

    // Guest / Offline Mode
    if (ownerId === GUEST_ID) {
        newFlow.id = generateId();
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }
    
    // Firestore Mode
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...newFlow,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { ...newFlow, id: docRef.id };
    } catch (error) {
        console.error("Firestore create failed, falling back to local", error);
        newFlow.id = generateId('local-fallback');
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }
  },

  // Create a new flow from a Template
  createFlowFromTemplate: async (ownerId: string, templateId: string, customTitle?: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error("Template not found");

    const newFlow: FlowData = {
        id: '',
        ownerId,
        title: customTitle || (template.id === 'blank' ? 'New Architecture' : template.name),
        nodes: template.nodes,
        edges: template.edges,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPublic: false
    };

    if (ownerId === GUEST_ID) {
        newFlow.id = generateId();
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...newFlow,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { ...newFlow, id: docRef.id };
    } catch (error) {
        console.error("Firestore create failed", error);
        throw error;
    }
  },

  // Duplicate a flow
  duplicateFlow: async (userId: string, originalFlow: FlowData) => {
    const newTitle = `${originalFlow.title} (Copy)`;
    const newFlow: FlowData = {
        ...originalFlow,
        id: '', // Will be assigned
        ownerId: userId,
        title: newTitle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    if (userId === GUEST_ID) {
        newFlow.id = generateId();
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...flowData } = newFlow;
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...flowData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { ...newFlow, id: docRef.id };
    } catch (error) {
        console.error("Firestore duplicate failed", error);
        throw error;
    }
  },

  // Get all flows for a user
  getUserFlows: async (userId: string): Promise<FlowData[]> => {
    if (userId === GUEST_ID) {
        return getLocalFlows();
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), where("ownerId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle Firestore Timestamps if present
            const createdAt = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
            const updatedAt = data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now();
            return { ...data, id: doc.id, createdAt, updatedAt } as FlowData;
        });
    } catch (error) {
        console.error("Error fetching flows", error);
        return [];
    }
  },

  // Get single flow
  getFlow: async (flowId: string): Promise<FlowData | null> => {
    if (flowId.startsWith('local-')) {
        const flows = getLocalFlows();
        return flows.find(f => f.id === flowId) || null;
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, flowId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
             const data = docSnap.data();
             return { ...data, id: docSnap.id } as FlowData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching flow", error);
        return null;
    }
  },

  // Save/Update flow content (nodes/edges)
  saveFlow: async (flowId: string, nodes: Node[], edges: Edge[]) => {
    if (flowId.startsWith('local-')) {
        const flows = getLocalFlows();
        const index = flows.findIndex(f => f.id === flowId);
        if (index !== -1) {
            flows[index].nodes = nodes;
            flows[index].edges = edges;
            flows[index].updatedAt = Date.now();
            saveLocalFlows(flows);
        }
        return;
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, flowId);
        await updateDoc(docRef, {
            nodes,
            edges,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving flow", error);
    }
  },

  // Rename a flow
  renameFlow: async (flowId: string, newTitle: string) => {
    if (flowId.startsWith('local-')) {
        const flows = getLocalFlows();
        const index = flows.findIndex(f => f.id === flowId);
        if (index !== -1) {
            flows[index].title = newTitle;
            flows[index].updatedAt = Date.now();
            saveLocalFlows(flows);
        }
        return;
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, flowId);
        await updateDoc(docRef, {
            title: newTitle,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error renaming flow", error);
        throw error;
    }
  },

  // Delete a flow
  deleteFlow: async (flowId: string) => {
    if (flowId.startsWith('local-')) {
        const flows = getLocalFlows();
        const newFlows = flows.filter(f => f.id !== flowId);
        saveLocalFlows(newFlows);
        return;
    }

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, flowId));
    } catch (error) {
        console.error("Error deleting flow", error);
        throw error;
    }
  }
};