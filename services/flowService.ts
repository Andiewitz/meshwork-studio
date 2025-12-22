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
import { Node, Edge } from 'reactflow';
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
        newFlow.id = `local-${Date.now()}`;
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }
    
    // Firestore Mode
    // Remove id from object passed to addDoc (Firestore generates it)
    const { id, ...data } = newFlow;
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
        return { id: docRef.id, ...data } as FlowData;
    } catch (error) {
        console.error("Firestore create failed, falling back to local for robustness in demo", error);
        // Fallback for demo purposes if config is invalid
        newFlow.id = `local-fallback-${Date.now()}`;
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }
  },

  // Create a new flow from a Template
  createFlowFromTemplate: async (ownerId: string, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error("Template not found");

    const newFlow: FlowData = {
      id: '',
      ownerId,
      title: template.name === 'Blank Canvas' ? 'Untitled Mesh' : template.name,
      nodes: template.nodes,
      edges: template.edges,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic: false
    };

    if (ownerId === GUEST_ID) {
        newFlow.id = `local-${Date.now()}`;
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }

    const { id, ...data } = newFlow;
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
        return { id: docRef.id, ...data } as FlowData;
    } catch (error) {
        console.error("Firestore create template failed, falling back", error);
        newFlow.id = `local-fallback-${Date.now()}`;
        const flows = getLocalFlows();
        flows.push(newFlow);
        saveLocalFlows(flows);
        return newFlow;
    }
  },

  // Save/Update an existing flow
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

    const flowRef = doc(db, COLLECTION_NAME, flowId);
    await updateDoc(flowRef, {
      nodes,
      edges,
      updatedAt: Date.now()
    });
  },

  // Get all flows for a specific user
  getUserFlows: async (userId: string): Promise<FlowData[]> => {
    // Combine local fallback flows with guest flows if user is guest
    if (userId === GUEST_ID) {
        return getLocalFlows();
    }

    try {
        const q = query(
        collection(db, COLLECTION_NAME), 
        where("ownerId", "==", userId)
        );
        
        const querySnapshot = await getDocs(q);
        const fbFlows = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        } as FlowData));

        // Also return any fallback flows created during errors
        const localFlows = getLocalFlows().filter(f => f.id.startsWith('local-fallback-'));
        return [...fbFlows, ...localFlows];

    } catch (error) {
        console.error("Error fetching flows", error);
        return getLocalFlows(); // Fallback to local on error
    }
  },

  // Get a single flow by ID
  getFlow: async (flowId: string): Promise<FlowData | null> => {
    if (flowId.startsWith('local-')) {
        const flows = getLocalFlows();
        return flows.find(f => f.id === flowId) || null;
    }

    try {
        const docRef = doc(db, COLLECTION_NAME, flowId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FlowData;
        } else {
        return null;
        }
    } catch (error) {
        console.error("Error getting flow", error);
        // Fallback check
        const flows = getLocalFlows();
        return flows.find(f => f.id === flowId) || null;
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
    await deleteDoc(doc(db, COLLECTION_NAME, flowId));
  }
};