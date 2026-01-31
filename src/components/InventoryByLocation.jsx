import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem } from '@mui/material';

export default function InventoryByLocation() {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationsMap, setLocationsMap] = useState({});
  const [filterLocation, setFilterLocation] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [totalStockMap, setTotalStockMap] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const { map, locs} = await loadLocations();
      await loadInventory(map);
    };
    loadData();
  }, []);

  // Cargar ubicaciones
  const loadLocations = async () => {
    const { data: locs, error } = await supabase.from('locations').select('*');
    if (error) {
      console.error(error);
      return { map: {}, locs: [] };
    }
    const map = {};
    locs.forEach((l) => (map[l.id] = l.name));
    setLocations(locs);
    setLocationsMap(map);
    return { map, locs };
  };

  // Cargar inventario y calcular stock total por producto
  const loadInventory = async (locMap) => {
    const { data: rows, error } = await supabase.from('stock_movements').select(`
      id,
      quantity,
      type,
      location_id,
      from_location_id,
      to_location_id,
      batches (
        id,
        expiration_date,
        total_quantity,
        products (id, name)
      )
    `);

    if (error) {
      console.error(error);
      setData([]);
      return;
    }

    const inventoryMap = {};
    const totalStockMap = {};

    rows.forEach((row) => {
      const productName = row.batches?.products?.name ?? '—';
      const batchId = row.batches?.id ?? '—';
      const expiration = row.batches?.expiration_date ?? '—';
      

      const initKey = (locId) => {
        if (!locId) return null;
        const key = `${productName}_${batchId}_${locId}`;
        if (!inventoryMap[key]) {
          inventoryMap[key] = {
            name: productName,
            batch: batchId,
            expiration,
            location: locMap[locId] || '—',
            stock_location: 0
          };
        }
        
        return key;
      };

      if (row.type === 'IN') {
        const key = initKey(row.location_id);
        if (key) inventoryMap[key].stock_location += row.quantity;
      } else if (row.type === 'OUT') {
        const key = initKey(row.location_id);
        if (key) inventoryMap[key].stock_location -= row.quantity;
        
      } else if (row.type === 'MOVE') {
        const fromKey = initKey(row.from_location_id);
        const toKey = initKey(row.to_location_id);
        if (fromKey) inventoryMap[fromKey].stock_location -= row.quantity;
        if (toKey) inventoryMap[toKey].stock_location += row.quantity;
      }
    });

    // Evitar negativos y calcular stock total
    Object.values(inventoryMap).forEach((inv) => {
      inv.stock_location = Math.max(inv.stock_location, 0); // no negativos
      totalStockMap[inv.name] = (totalStockMap[inv.name] || 0) + inv.stock_location;
    });

    // Asegurarnos de que productos sin stock aparezcan como 0
    Object.keys(totalStockMap).forEach((name) => {
      if (totalStockMap[name] < 0) totalStockMap[name] = 0;
    });

    setTotalStockMap(totalStockMap);
    setData(Object.values(inventoryMap));
  };

  // Filtrar por ubicación y buscador
  const filteredData = data.filter((item) => {
    const matchesLocation = filterLocation ? item.location === filterLocation : true;
    const matchesProduct = searchProduct
      ? item.name.toLowerCase().includes(searchProduct.toLowerCase())
      : true;
    return matchesLocation && matchesProduct;
  });

  return (
    <Paper sx={{ mt: 3, p: 2, overflowX: 'auto' }}>
      <TextField
        label="Buscar producto"
        fullWidth
        margin="dense"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />

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

      <Table sx={{ mt: 2, minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Lote</TableCell>
            <TableCell>Caducidad</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Stock Total</TableCell>
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
              <TableCell>{totalStockMap[r.name]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
