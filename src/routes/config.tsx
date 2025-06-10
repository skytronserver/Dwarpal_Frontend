import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Building,
  Clock,
  Calendar,
  DoorClosed,
  UserPlus,
  Plus,
  Timer,
  CalendarPlus,
  DoorOpen,
  Settings,
  Search,
  X,
  Briefcase,
  UserCircle,
  FileText,
  CreditCard,
  BarChart3,
  Shield,
  CalendarClock,
  FileCheck,
  ClipboardList,
  LineChart,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGetOrganisationsQuery } from "../services/OrganisationApi";
import { Box, InputBase, IconButton, Paper} from "@mui/material";
import { styled } from '@mui/material/styles';

interface NavigationHeader {
  kind: "header" | "divider";
  title?: string | React.ReactNode;
  show?: boolean;
}

interface NavigationLink {
  segment?: string;
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  show?: boolean;
  children?: NavigationItem[];
}

type NavigationItem = NavigationHeader | NavigationLink;

const SEARCH_LIST_WIDTH = 340;

const SearchWrapper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
  width: '100%',
  maxWidth: `${SEARCH_LIST_WIDTH}px`,
  margin: '0 auto',
  padding: theme.spacing(0.5, 2),
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1, 0, 0),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 0, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: 16,
  },
}));

const OrgList = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: `${SEARCH_LIST_WIDTH}px`,
  margin: '4px auto 0 auto',
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  padding: 0,
}));

const OrgListItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.2, 2),
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'background 0.2s',
  fontSize: 16,
  '&:hover': {
    background: theme.palette.action.hover,
  },
}));

export const useNavigation = () => {
  const { data: organizations } = useGetOrganisationsQuery({ search: '', page: 1, page_size: 10 });
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredOrgs = useMemo(() =>
    organizations?.results?.filter(org =>
      org.name?.toLowerCase().includes(search.toLowerCase())
    ) ?? [], [search, organizations]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const allRoutes: NavigationItem[] = [
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard />,
    },
    // super admin 
    {
      segment: "service-provider",
      title: "Create Service Providers",
      icon: <Briefcase />,
      show: hasPermission("manage:admin-users"),
      children: [
        {
          segment: "new/:id",
          title: "Company",
          icon: <Building2 />,
          show: hasPermission("manage:admin-users"),
        },
        {
          segment: "individual/new/:id",
          title: "Individual",
          icon: <UserCircle />,
          show: hasPermission("manage:admin-users"),
        },
      ],
    },
    {
      segment: "client",
      title: "Create Clients",
      icon: <UserPlus />,
      show: hasPermission("create:client"),
      children: [
        {
          segment: "organisations/new/:id",
          title: "Create Company",
          icon: <Building2 />,
          show: hasPermission("create:organization"),
        },
        {
          segment: "individualForm",
          title: "Create Individual Client",
          icon: <UserCircle />,
          show: hasPermission("create:organization"),
        },
      ],
    },
    {
      segment: "org",
      title: "Corporate Users",
      icon: <Building2 />,
      show: hasPermission("view:organizations"),
      children: [
        {
          kind: "header",
          title: (
            <Box sx={{
              position: 'relative',
              top: '-17px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 2,
            }}>
              <SearchWrapper>
                <SearchIconWrapper>
                  <Search size={18} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search organizations..."
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  endAdornment={
                    search && (
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        sx={{ ml: 1 }}
                      >
                        <X size={14} />
                      </IconButton>
                    )
                  }
                />
              </SearchWrapper>
              <OrgList>
                {filteredOrgs.length > 0 ? (
                  filteredOrgs.map((org) => (
                    <OrgListItem key={org.id}>
                      <Building2 size={20} style={{ minWidth: 20 }} />
                      <span style={{ fontSize: 16 }}>{org.name}</span>
                    </OrgListItem>
                  ))
                ) : (
                  <OrgListItem style={{ cursor: 'default', color: '#888' }}>
                    No organizations found
                  </OrgListItem>
                )}
              </OrgList>
            </Box>
          ),
          show: hasPermission("view:organizations"),
        },
        ...filteredOrgs.map((organization) => ({
          segment:'client',
          title: organization.name,
          icon: <Building2 />,
          show: hasPermission("view:organizations"),
          children: [
            {
              segment: `${organization.id}/departments/new/:id`,
              title: "Create Departments",
              icon: <Building />,
              show: hasPermission("view:departments"),
            },
            {
              segment: `${organization.id}/users/new/:id`,
              title: "Create Company Admin",
              icon: <Shield />,
              show: hasPermission("create:admin-user"),
            },
            {
              segment: `${organization.id}/departments`,
              title: "Manage Departments",
              icon: <Building />,
              show: hasPermission("manage:departments"),
            },
            {
              segment: `${organization.id}/users`,
              title: "Manage Company Admin",
              icon: <Users />,
              show: hasPermission("manage:admin-users"),
            },
          ],
        })),
      ],
    },
    {
      segment: "",
      title: "Individual Users",
      icon: <UserCircle />,
      show: hasPermission("manage:admin-users"),
    },
    {
      segment: "accounts",
      title: "Accounts",
      icon: <CreditCard />,
      show: hasPermission("create:admin-user"),
      children: [
        {
          segment: "new/:id",
          title: "Create Account User",
          icon: <CreditCard />,
          show: hasPermission("create:admin-user"),
        },
      ],
    },

    // suder admin close 

  // Admin

  {
    segment:"company",
    title: "Create Users",
    icon: <UserPlus />,
    show: hasPermission("create:user") || hasPermission("create:employee"),
    children: [{
      segment: "hr/new/:id",
      title: "Create HR",
      icon: <UserCircle />,
      show: hasPermission("create:user"),
    },
    {
      segment: "accounts/new/:id",
      title: "Create Accounts",
      icon: <CreditCard />,
      show: hasPermission("create:user"),
    },
    {
      segment: "sub-admin/new/:id",
      title: "Create HR and Accounts",
      icon: <UserCircle />,
      show: hasPermission("create:user"),
    },
    {
      segment: "employee/new/:id",
      title: "Create Employee",
      icon: <UserCircle />,
      show: hasPermission("create:employee"),
    },
    {
      segment: "shifts/new/:id",
      title: "Create Shift",
      icon: <CalendarClock />,
      show: hasPermission("create:shift"),
    },
    {
      segment: "holidays/new/:id",
      title: "Create Holiday",
      icon: <CalendarPlus />,
      show: hasPermission("create:holiday"),
    },
    {
      segment: "gate-passes/new/:id",
      title: "Create Gate Pass",
      icon: <FileCheck />,
      show: hasPermission("can_create_guest_pass") || hasPermission("create:guest-pass"),
    },
  ]
  },


// manage approvals
{
  segment: "reports",
  title: "Manage Approvals",
  icon: <BarChart3 />,
  show: hasPermission("approve:approval"),
  children: [
    {
      segment: "shifts",
      title: " Shifts",
      icon: <CalendarClock />,
      show: hasPermission("manage:shifts"),
    },
    {
      segment: "holidays",
      title: " Holidays",
      icon: <Calendar />,
      show: hasPermission("manage:holidays"),
    },
    {
      segment: "guest-pass",
      title: " Gate Passes Settings",
      icon: <ClipboardList />,
      show: hasPermission("manage:gate-passes settings") || hasPermission("view:guest-pass settings"),
    },
  ],
},

// reports
{
  segment: "reports",
  title: "Reports",
  icon: <BarChart3 />,
  show: hasPermission("view:shifts") || hasPermission("view:holidays") || hasPermission("view:guest-pass") || hasPermission("view:users") || hasPermission("manage:gate-passes") || hasPermission("manage:attendance") || hasPermission("attendance_report"),
  children: [
    {
      segment: "gate-passes",
      title: " Gate Passes",
      icon: <ClipboardList />,
      show: hasPermission("manage:gate-passes") || hasPermission("approve_guest_pass") || hasPermission("view:guest-pass"),
    },
    {
      segment: "gate-passes/:id",
      title: "View Gate Pass",
      icon: <FileText />,
      show: hasPermission("view_guest_pass"),
    },
    {
      segment: "attendance/analytics",
      title: "Attendance Analytics",
      icon: <LineChart />,
      show: hasPermission("manage:attendance") || hasPermission("attendance_report"),
    },
    {
      segment:"users",
      title: "Users",
      icon: <Users />,
      show: hasPermission("view:users"),
    },
    {
      segment: "shifts",
      title: " Shifts",
      icon: <CalendarClock />,
      show: hasPermission("view:shifts"),
    },
    {
      segment: "holidays",
      title: " Holidays",
      icon: <Calendar />,
      show: hasPermission("view:holidays"),
    },
  ]
},


//settings
{
  segment: "settings",
  title: "Settings",
  icon: <Settings />,
  children: [
    {
      segment: "subscriptions/new",
      title: "Subscription",
      icon: <CreditCard />,
      show: hasPermission("manage:admin-users"),
    },
    {
      segment: "guest-pass",
      title: "Guest Pass Settings",
      icon: <Settings />,
      show: hasPermission("settings:guest-pass"),
    },
  ],
},


  ];

  // Filter out invisible items and headers with no children
  return allRoutes.filter((route): route is NavigationItem => {
    if ("kind" in route) {
      if (route.kind === "header") {
        const nextItems = allRoutes.slice(allRoutes.indexOf(route) + 1);
        return nextItems.some(item => !("kind" in item) && item.show !== false);
      }
      return true;
    }
    
    // If route has children, filter them first
    if (route.children) {
      route.children = route.children.filter(child => child.show !== false);
    }
    
    // Show parent if it's visible, regardless of children
    return route.show !== false;
  });
};
