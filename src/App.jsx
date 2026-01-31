
import { useState } from 'react';
import { Container } from '@mui/material';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import BatchList from './components/BatchList';
import AddBatch from './components/AddBatch';
import StockMovements from './components/StockMovements';
import InventoryByLocation from './components/InventoryByLocation';
import PageTitle from './components/PageTitle';
import { supabase } from "./supabaseClient";
import BarcodeScanner from "./components/BarcodeScanner.jsx";

function App() {
  const [view, setView] = useState('products');
  const [product, setProduct] = useState(null);
  const [scanned, setScanned] = useState(false);
const handleScan = async (barcode) => {
  if (scanned) return;
  setScanned(true);

  navigator.vibrate(200);

  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock")
    .eq("barcode", barcode)
    .single();

  if (error) {
    alert("Producto no encontrado");
    setScanned(false);
    return;
  }

  setProduct(data);
};


  return (
    <Container maxWidth="md" sx={{ mt: 2, px: 1 }}>
      <NavBar setView={setView} />
      <PageTitle view={view} /> 

      {view === 'products' && <ProductList />}
      {view === 'addProduct' && <AddProduct />}
      {view === 'batches' && <BatchList />}
      {view === 'addBatch' && <AddBatch />}
      {view === 'movements' && <StockMovements />}
      {view === 'inventory' && <InventoryByLocation />}
      {!product && <BarcodeScanner onScan={handleScan} />}

{product && (
  <div>
    <h3>{product.name}</h3>
    <p>ID: {product.id}</p>
    <p>Stock: {product.stock}</p>

    <button
      onClick={() => {
        setProduct(null);
        setScanned(false);
      }}
    >
      Escanear otro
    </button>
  </div>
)}

    </Container>
  );
}

export default App;
