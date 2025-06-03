import React, { useState, useMemo } from "react";
import { TextField, Box, IconButton, Modal, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useGetOrganisationsQuery } from "../services/OrganisationApi";

interface NavigationHeader {
  kind: "header" | "divider";
  title?: string;
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

export const useNavigation = () => {
  const { data: organizations } = useGetOrganisationsQuery({ search: '', page: 1, page_size: 10 });
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredOrgs = useMemo(() =>
    organizations?.results?.filter(org =>
      org.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [], [search, organizations]);

  const allRoutes: NavigationItem[] = [
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard />,
    },
    { kind: "divider" },
    {
      segment: "service-provider",
      title: "Create Service Providers",
      icon: <Users />,
      show: hasPermission("manage:users") || hasPermission("manage:admin-users"),
      children: [
        {
          segment: "new/:id",
          title: "Company",
          icon: <Users />,
          show: hasPermission("manage:users") || hasPermission("manage:admin-users"),
        },
        {
          segment: "individual/new/:id",
          title: "Individual",
          icon: <Users />,
          show: hasPermission("manage:users") || hasPermission("manage:admin-users"),
        },
      ],
    },
    { kind: "divider" },
    {
      segment: "client",
      title: "Create Clients",
      icon: <Plus />,
      show: hasPermission("create:client"),
      children: [
        {
          segment: "organisations/new/:id",
          title: "Create Company",
          icon: <Plus />,
          show: hasPermission("create:organization"),
        },
        {
          segment: "individualForm",
          title: "Create Individual Client",
          icon: <Plus />,
          show: hasPermission("create:organization"),
        },
      ],
    },
    { kind: "divider" },
    {
      title: "Corporate Users",
      icon: <Building2 />,
      show: hasPermission("view:organizations"),
      action: (
        <>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchOpen(true);
            }}
            sx={{ mr: 1 }}
          >
            <SearchIcon />
          </IconButton>
          <Modal
            open={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <Paper
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                p: 4,
                outline: 'none',
              }}
            >
              <TextField
                autoFocus
                size="small"
                fullWidth
                variant="outlined"
                placeholder="Search corporate users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Paper>
          </Modal>
        </>
      ),
      children: filteredOrgs.map((organization) => ({
        segment: "client",
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
            icon: <UserPlus />,
            show: hasPermission("create:user") || hasPermission("create:admin-user"),
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
            show: hasPermission("manage:users") || hasPermission("manage:admin-users"),
          },
        ],
      })),
    },
    { kind: "divider" },
    {
      segment: "",
      title: "Individual Users",
      icon: <Users />,
      show: hasPermission("manage:users") || hasPermission("manage:admin-users"),
    },
    { kind: "divider" },
    {
      segment: "accountsForm",
      title: "Accounts",
      icon: <UserPlus />,
      show: hasPermission("create:user") || hasPermission("create:admin-user"),
    },
    { kind: "divider" },
    {
      segment: "",
      title: "Reports",
      icon: <Users />,
      show: hasPermission("manage:users") || hasPermission("manage:admin-users"),
    },
    { kind: "divider" },
    {
      segment: "settings",
      title: "Settings",
      icon: <Settings />,
      show: hasPermission("create:user") || hasPermission("create:admin-user"),
      children: [
        {
          segment: "subscriptions/new",
          title: "Subscription",
          icon: <UserPlus />,
          show: hasPermission("create:user") || hasPermission("create:admin-user"),
        },
      ],
    },
    {
      segment: "shifts/new/:id",
      title: "Create Shift",
      icon: <Timer />,
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
      icon: <DoorOpen />,
      show: hasPermission("can_create_guest_pass"),
    },
    {
      segment: "shifts",
      title: "Manage Shifts",
      icon: <Clock />,
      show: hasPermission("manage:shifts"),
    },
    {
      segment: "holidays",
      title: "Manage Holidays",
      icon: <Calendar />,
      show: hasPermission("manage:holidays"),
    },
    {
      segment: "gate-passes",
      title: "Manage Gate Passes",
      icon: <DoorClosed />,
      show: hasPermission("manage:gate-passes") || hasPermission("approve_guest_pass"),
    },
    {
      segment: "gate-passes/:id",
      title: "View Gate Pass",
      icon: <DoorOpen />,
      show: hasPermission("view_guest_pass"),
    },
    {
      segment: "attendance/analytics",
      title: "Attendance Analytics",
      icon: <Clock />,
      show: hasPermission("manage:attendance") || hasPermission("attendance_report"),
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
    return route.show !== false;
  });
};
