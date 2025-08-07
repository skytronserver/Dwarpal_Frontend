import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  styled
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigation } from '../../routes/config';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '8px',
  margin: '4px 8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (segment: string) => {
    setOpenItems(prev => 
      prev.includes(segment) 
        ? prev.filter(item => item !== segment)
        : [...prev, segment]
    );
  };

  const renderNavigationItem = (item: any, parentPath = '') => {
    if (item.kind === 'divider') {
      return <Divider key={Math.random()} sx={{ my: 1 }} />;
    }

    if (item.kind === 'header') {
      return (
        <Typography
          key={item.title}
          variant="subtitle2"
          sx={{ px: 3, py: 1, opacity: 0.7 }}
        >
          {item.title}
        </Typography>
      );
    }

    const fullPath = parentPath ? `${parentPath}/${item.segment}` : item.segment;
    const isActive = pathname.includes(fullPath);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.includes(item.segment);

    if (!item.show && item.show !== undefined) {
      return null;
    }

    return (
      <React.Fragment key={item.segment}>
        <StyledListItem
          component={hasChildren ? 'div' : Link}
          to={hasChildren ? undefined : `/${fullPath}`}
          onClick={() => hasChildren && toggleItem(item.segment)}
          className={isActive ? 'active' : ''}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} />
          {hasChildren && (
            <Box component="span" sx={{ ml: 'auto' }}>
              {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </Box>
          )}
        </StyledListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any) =>
                renderNavigationItem(child, fullPath)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Dwarpal AI
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {navigation.map((item) => renderNavigationItem(item))}
      </List>
    </Box>
  );
};

export default Sidebar;
