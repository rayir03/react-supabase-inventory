import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem } from '@mui/material';

export default function InventoryByLocation() {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationsMap, setLocationsMap] = useState({});
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await loadLocations();
      await loadInventory();
    };
    loadData();
  }, []);

  // Cargar ubicaciones
  const loadLocations = async () => {
    const { data: locs, error } = await supabase.from('locations').select('*');
    if (error) {
      console.error(error);
      return;
    }
    const map = {};
    locs.forEach((l) => (map[l.id] = l.name));
    setLocations(locs);
    setLocationsMap(map);
    return true;
  };

  // Cargar inventario considerando IN, OUT y MOVE
  const loadInventory = async () => {
    const { data: rows, error } = await supabase
      .from('stock_movements')
      .select(`
        id,
        quantity,
        type,
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
        )
      `);

    if (error) {
      console.error(error);
      setData([]);
      return;
    }

    const inventoryMap = {};

    rows.forEach((row) => {
      const productName = row.batches?.products?.name ?? '—';
      const batchId = row.batches?.id ?? '—';
      const expiration = row.batches?.expiration_date ?? '—';

      // IN y OUT
      if (row.type === 'IN' || row.type === 'OUT') {
        const locId = row.location_id;
        const key = `${productName}_${batchId}_${locId}`;
        if (!inventoryMap[key]) {
          inventoryMap[key] = {
            name: productName,
            batch: batchId,
            expiration,
            location: locationsMap[locId] || '—',
            stock_location: 0
          };
        }
        inventoryMap[key].stock_location += row.type === 'IN' ? row.quantity : -row.quantity;
      }

      // MOVE
      if (row.type === 'MOVE') {
        // Restar del origen
        if (row.from_location_id) {
          const fromKey = `${productName}_${batchId}_${row.from_location_id}`;
          if (!inventoryMap[fromKey]) {
            inventoryMap[fromKey] = {
              name: productName,
              batch: batchId,
              expiration,
              location: locationsMap[row.from_location_id] || '—',
              stock_location: 0
            };
          }
          inventoryMap[fromKey].stock_location -= row.quantity;
        }

        // Sumar al destino
        if (row.to_location_id) {
          const toKey = `${productName}_${batchId}_${row.to_location_id}`;
          if (!inventoryMap[toKey]) {
            inventoryMap[toKey] = {
              name: productName,
              batch: batchId,
              expiration,
              location: locationsMap[row.to_location_id] || '—',
              stock_location: 0
            };
          }
          inventoryMap[toKey].stock_location += row.quantity;
        }
      }
    });

    setData(Object.values(inventoryMap));
  };

  // Filtrar por ubicación
  const filteredData = filterLocation
    ? data.filter((item) => item.location === filterLocation)
    : data;

  return (
    <Paper sx={{ mt: 3, p: 2, overflowX: 'auto' }}>
  <TextField
    select
    label="Filtrar por ubicación"
    fullWidth
    margin="dense"
    value={filterLocation}
    onChange={(e) => setFilterLocation(e.target.value)}
  >
    <MenuItem value="">Todas</MenuItem>
    {locations.map((l) => (
      <MenuItem key={l.id} value={l.name}>
        {l.name}
      </MenuItem>
    ))}
  </TextField>

  <Table sx={{ mt: 2, minWidth: 650 }}>
    <TableHead>
      <TableRow>
        <TableCell>Producto</TableCell>
        <TableCell>Lote</TableCell>
        <TableCell>Caducidad</TableCell>
        <TableCell>Ubicación</TableCell>
        <TableCell>Cantidad</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredData.map((r, i) => (
        <TableRow key={i}>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.name}</TableCell>
          <TableCell>{r.batch}</TableCell>
          <TableCell>{r.expiration}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.location}</TableCell>
          <TableCell>{r.stock_location}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Paper>

  );
}
