import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Box
} from '@mui/material';

export default function ProductList() {
  const [products, setProducts] = useState(null);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (filterValue = filter) => {
    let query = supabase.from("products").select("*");

    if (filterValue === "active") {
      query = query.eq("active", true);
    } else if (filterValue === "inactive") {
      query = query.eq("active", false);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setProducts([]);
      return;
    }
    setProducts(data);
  };

  const handleDeactivateProduct = async (id) => {
    const { error } = await supabase
      .from("products")
      .update({ active: false })
      .eq("id", id);

    if (error) return alert("Error: " + error.message);

    alert("Producto desactivado");
    loadProducts();
  };

  const handleReactivateProduct = async (id) => {
    if (!window.confirm("¿Seguro que quieres reactivar este producto?")) return;

    const { error } = await supabase
      .from("products")
      .update({ active: true })
      .eq("id", id);

    if (error) return alert("Error: " + error.message);

    alert("Producto reactivado");
    loadProducts();
  };

  if (products === null) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <h2>Products</h2>
      {/* Selector de filtro responsivo */}
      <TextField
        select
        label="Filtrar productos"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          loadProducts(e.target.value);
        }}
        sx={{ mb: 2, width: "100%", maxWidth: 300 }}
      >
        <MenuItem value="active">Activos</MenuItem>
        <MenuItem value="inactive">Inactivos</MenuItem>
        <MenuItem value="all">Todos</MenuItem>
      </TextField>

      {/* Caja responsiva para tabla */}
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>
                  {p.active ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeactivateProduct(p.id)}
                    >
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleReactivateProduct(p.id)}
                    >
                      Reactivar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
