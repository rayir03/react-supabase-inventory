import { Typography } from '@mui/material';

function PageTitle({ view }) {
  let title = '';
  switch (view) {
    case 'products':
      title = 'Products';
      break;
    case 'addProduct':
      title = 'Nuevo Producto';
      break;
    case 'batches':
      title = 'Lotes';
      break;
    case 'addBatch':
      title = 'Agregar Lote';
      break;
    case 'movements':
      title = 'Movimientos';
      break;
    case 'inventory':
      title = 'Inventario';
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
