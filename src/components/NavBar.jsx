import { AppBar, Toolbar, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function NavBar({ setView, currentView }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleSelect = (view) => {
    setView(view);
    closeMenu();
  };

  const buttons = [
    { label: 'Productos', view: 'products' },
    { label: 'Nuevo', view: 'addProduct' },
    { label: 'Lotes', view: 'batches' },
    { label: 'Agregar Lote', view: 'addBatch' },
    { label: 'Movimientos', view: 'movements' },
    { label: 'Inventario', view: 'inventory' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Inventory
        </Typography>

        {/* BOTONES PARA ESCRITORIO */}
        <div style={{ display: 'flex' }}>
          {buttons.map((b) => (
            <Button
              key={b.view}
              color={currentView === b.view ? 'secondary' : 'inherit'}
              variant={currentView === b.view ? 'contained' : 'text'}
              onClick={() => handleSelect(b.view)}
              sx={{ display: { xs: 'none', md: 'block' }, m: 0.5 }}
            >
              {b.label}
            </Button>
          ))}
        </div>

        {/* MENÚ HAMBURGUESA PARA CELULAR */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: 'block', md: 'none' } }}
          onClick={openMenu}
        >
          <MenuIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          {buttons.map((b) => (
            <MenuItem
              key={b.view}
              selected={currentView === b.view} // resalta el activo
              onClick={() => handleSelect(b.view)}
            >
              {b.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
