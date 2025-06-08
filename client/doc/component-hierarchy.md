## MainLayout Component Hierarchy

```
MainLayout
├── SidebarProvider
    └── div.min-h-screen.flex.w-full.bg-background
        ├── Sidebar (Sidebar Area)
        │   ├── SidebarHeader
        │   ├── SidebarMenu
        │   │   └── SidebarMenuItem (repeated)
        │   │       └── SidebarMenuButton
        │   └── SidebarFooter
        └── SidebarInset.flex-1.min-w-0 (Main Content Area)
            ├── header
            │   ├── SidebarTrigger
            │   ├── AssessmentYearSwitcher
            │   └── UserSwitcher
            └── div.p-6
                └── Outlet (Renders page content)
```

- **Sidebar Area**: Contains navigation and branding.
- **Main Content Area**: Contains the header, user controls, and the main routed page content. 