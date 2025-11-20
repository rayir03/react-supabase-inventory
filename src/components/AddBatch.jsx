
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { TextField, Button, MenuItem, Paper } from '@mui/material';

export default function AddBatch() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: '', entry_date: '', expiration_date: '', total_quantity: '' });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    setProducts(data || []);
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from('batches').insert([form]);
    if (error) {
      alert('Error: ' + error.message);
      return;
    }
    alert('Lote agregado');
    setForm({ product_id: '', entry_date: '', expiration_date: '', total_quantity: '' });
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <TextField select label="Producto" fullWidth margin="dense" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}>
        {products.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
      </TextField>

      <TextField label="Fecha Entrada" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
      <TextField label="Fecha Expiración" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={form.expiration_date} onChange={(e) => setForm({ ...form, expiration_date: e.target.value })} />
      <TextField label="Cantidad" fullWidth margin="dense" value={form.total_quantity} onChange={(e) => setForm({ ...form, total_quantity: e.target.value })} />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Guardar Lote</Button>
    </Paper>
  );
}
