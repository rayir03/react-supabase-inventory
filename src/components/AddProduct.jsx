
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, Paper } from '@mui/material';

export default function AddProduct() {
  const [form, setForm] = useState({ name: '', category: '', description: '' });

  const handleSubmit = async () => {
    const { error } = await supabase.from('products').insert([form]);
    if (error) {
      alert('Error: ' + error.message);
      return;
    }
    alert('Producto agregado');
    setForm({ name: '', category: '', description: '' });
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <TextField label="Nombre" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <TextField label="Categoría" fullWidth margin="dense" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <TextField label="Descripción" fullWidth margin="dense" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Guardar</Button>
    </Paper>
  );
}
