import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  Paper,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography
} from '@mui/material';

export default function StockMovements() {
  const [batches, setBatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    batch_id: '',
    type: 'IN',
    location_id: '',
    from_location_id: '',
    to_location_id: '',
    quantity: ''
  });
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    loadData();
    loadMovements();
  }, []);

  const loadData = async () => {
    const { data: b } = await supabase.from('batches').select('*');
    const { data: l } = await supabase.from('locations').select('*');
    setBatches(b || []);
    setLocations(l || []);
  };

  const loadMovements = async () => {
    const { data } = await supabase
      .from('stock_movements')
      .select(`
        id,
        quantity,
        type,
        movement_date,
        location_id,
        from_location_id,
        to_location_id,
        batches (
          id,
          expiration_date,
          products (
            id,
            name
          )
        ),
        locations (
          id,
          name
        )
      `)
      .order('movement_date', { ascending: false });

    setMovements(data || []);
  };

  const handleSubmit = async () => {
    const insertData = {
      batch_id: form.batch_id,
      type: form.type,
      quantity: Number(form.quantity)
    };

    if (form.type === 'IN' || form.type === 'OUT') {
      insertData.location_id = form.location_id;
    } else if (form.type === 'MOVE') {
      insertData.from_location_id = form.from_location_id;
      insertData.to_location_id = form.to_location_id;
    }

    const { error } = await supabase.from('stock_movements').insert([insertData]);
    if (error) return alert('Error: ' + error.message);

    alert('Movimiento registrado');
    loadMovements();
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Registrar movimiento
      </Typography>

      {/* FORMULARIO RESPONSIVO */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          select
          label="Lote"
          fullWidth
          value={form.batch_id}
          onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
        >
          {batches.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.id}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Tipo"
          fullWidth
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <MenuItem value="IN">IN</MenuItem>
          <MenuItem value="OUT">OUT</MenuItem>
          <MenuItem value="MOVE">MOVE</MenuItem>
        </TextField>

        {(form.type === 'IN' || form.type === 'OUT') && (
          <TextField
            select
            label="Ubicación"
            fullWidth
            value={form.location_id}
            onChange={(e) => setForm({ ...form, location_id: e.target.value })}
          >
            {locations.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        {form.type === 'MOVE' && (
          <>
            <TextField
              select
              label="Desde"
              fullWidth
              value={form.from_location_id}
              onChange={(e) => setForm({ ...form, from_location_id: e.target.value })}
            >
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Hacia"
              fullWidth
              value={form.to_location_id}
              onChange={(e) => setForm({ ...form, to_location_id: e.target.value })}
            >
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        <TextField
          label="Cantidad"
          type="number"
          fullWidth
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Registrar
        </Button>
      </Box>

      {/* TABLA RESPONSIVA */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Movimientos
      </Typography>

      <Box sx={{ mt: 2, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Lote</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Tipo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.movement_date}</TableCell>

                <TableCell>
                  {m.batches?.products?.name ?? '—'}
                  <br />
                  <small>Lote: {m.batches?.id}</small>
                </TableCell>

                <TableCell>
                  {m.type === 'MOVE'
                    ? `${locations.find((l) => l.id === m.from_location_id)?.name ?? '—'} → ${
                        locations.find((l) => l.id === m.to_location_id)?.name ?? '—'
                      }`
                    : m.locations?.name ?? '—'}
                </TableCell>

                <TableCell>{m.quantity}</TableCell>
                <TableCell>{m.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Box>
    </Paper>
  );
}
