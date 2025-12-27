# Meshwork Studio To-Do List

## High Priority: Infrastructure & Backend
- [ ] **Fix Firebase Auth Registration Error**: Currently decommissioned due to `Uncaught Error: Component auth has not been registered yet`. This is likely a version mismatch or duplicate module loading via the ESM CDN.
- [ ] **Re-enable Firestore Persistence**: Switch from local storage fallbacks to live Firestore collections for real-time sync.
- [ ] **Google OAuth Setup**: Configure the Firebase Console and GCP project to allow production Google Sign-In.
- [ ] **Security Rules**: Implement granular Firestore security rules to prevent unauthorized access to user meshes.

## UI/UX Refinement
- [ ] **Real-time Collaboration**: Use Firestore snapshots to allow multiple architects on the same canvas.
- [ ] **Asset Library Expansion**: Add more cloud provider icons (OCI, IBM Cloud).
- [ ] **Export to Terraform**: Add a feature to generate HCL code based on the visual mesh.
- [ ] **Node Snap-to-Grid**: Improve canvas precision for professional-grade diagrams.

## DevOps
- [ ] **Production Environment Variables**: Properly inject API keys into the Vercel/Production environment instead of relying on fallbacks.
- [ ] **Error Boundaries**: Add more robust error handling for canvas crashes.