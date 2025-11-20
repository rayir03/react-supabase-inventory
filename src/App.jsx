
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

function App() {
  const [view, setView] = useState('products');

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
    </Container>
  );
}

export default App;
