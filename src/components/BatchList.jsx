
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from '@mui/material';

export default function BatchList() {
  const [batches, setBatches] = useState(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    const { data, error } = await supabase.from('batches').select('*, products(name)').order('entry_date', { ascending: false });
    if (error) {
      console.error(error);
      setBatches([]);
      return;
    }
    setBatches(data);
  };

  if (batches === null) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Entrada</TableCell>
            <TableCell>Expiración</TableCell>
            <TableCell>Cantidad Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {batches.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.products?.name ?? ''}</TableCell>
              <TableCell>{b.entry_date}</TableCell>
              <TableCell>{b.expiration_date}</TableCell>
              <TableCell>{b.total_quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
