import React, { useState, useEffect } from 'react';
import { X, Check, Type } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Button, DialogActions, Typography } from '@mui/material';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLabel: string;
  onSave: (newLabel: string) => void;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({ 
  isOpen, 
  onClose, 
  initialLabel, 
  onSave 
}) => {
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    setLabel(initialLabel);
  }, [initialLabel, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth 
      PaperProps={{ sx: { borderRadius: 4, border: '2px solid #0f172a', boxShadow: '8px 8px 0px 0px #0f172a' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Edit Node</Typography>
        <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Typography variant="caption" fontWeight="bold" color="textSecondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            Node Label
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
            InputProps={{
              sx: { fontWeight: 'bold', borderRadius: 2, border: '1px solid #e2e8f0', '&.Mui-focused': { borderColor: '#0f172a' } }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} fullWidth sx={{ color: '#64748b', fontWeight: 'bold' }}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ backgroundColor: '#0f172a', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #cbd5e1', '&:hover': { backgroundColor: '#1e293b' } }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};