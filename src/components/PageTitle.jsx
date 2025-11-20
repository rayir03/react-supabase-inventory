import { Typography } from '@mui/material';

function PageTitle({ view }) {
  let title = '';
  switch (view) {
    case 'products':
      title = 'Products';
      break;
    case 'addProduct':
      title = 'Add Product';
      break;
    case 'batches':
      title = 'Batches';
      break;
    case 'addBatch':
      title = 'Add Batch';
      break;
    case 'movements':
      title = 'Stock Movements';
      break;
    case 'inventory':
      title = 'Inventory';
      break;
    default:
      title = '';
  }

  return (
    <Typography
      variant="h4"
      sx={{
        mt: 2,
        mb: 2,
        color: 'primary.main', // usa el color principal (azul)
        fontWeight: 'bold',
        textAlign: 'center', // opcional: centrado
      }}
    >
      {title}
    </Typography>
  );
}

export default PageTitle;
