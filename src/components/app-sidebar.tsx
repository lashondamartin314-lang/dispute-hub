import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Compass,
  FileText,
  Folder,
  Library,
  ScrollText,
  Sparkles,
  ArrowUpRight,
  ClipboardList,
  ScanSearch,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PHASES } from "@/data/phases";
import { PINNED_RESOURCES } from "@/data/resources";
import { lettersForPhase } from "@/data/letters";

const phaseIcon = {
  prepare: Compass,
  validate: ScrollText,
  "clean-identity": Sparkles,
  "dispute-bureaus": FileText,
  "challenge-furnishers": FileText,
  escalate: BookOpen,
} as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { setOpenMobile, isMobile } = useSidebar();
  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };
  const isActive = (path: string) => pathname === path;
  const isPhaseActive = (id: string) => pathname.startsWith(`/playbook/phase/${id}`);

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <Link to="/" className="block group" onClick={closeMobile}>
          <p className="eyebrow text-[10px]">Credit Academy</p>
          <h2 className="font-display mt-1 text-2xl leading-none">
            The Dispute<br />Playbook
          </h2>
          <p className="font-editorial mt-2 text-xs text-muted-foreground">Hub & companion</p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-2">
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupLabel className="eyebrow mb-1 text-[10px]">Companion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/playbook")}>
                  <Link to="/playbook"><BookOpen className="size-4" /> Cover</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/playbook/foundation")}>
                  <Link to="/playbook/foundation"><Compass className="size-4" /> Foundation</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/playbook/strategy")}>
                  <Link to="/playbook/strategy"><ScrollText className="size-4" /> Strategy</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/letters")}>
                  <Link to="/letters"><Library className="size-4" /> Letter library</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/tracker")}>
                  <Link to="/tracker"><ClipboardList className="size-4" /> Dispute tracker</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/decoder")}>
                  <Link to="/decoder"><ScanSearch className="size-4" /> Response decoder</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/resources")}>
                  <Link to="/resources"><Sparkles className="size-4" /> Resources</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t border-sidebar-border/60 px-2 py-3">
          <SidebarGroupLabel className="eyebrow mb-1 text-[10px]">Phases</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PHASES.map((p) => {
                const Icon = phaseIcon[p.id];
                const letters = lettersForPhase(p.id);
                const active = isPhaseActive(p.id);
                return (
                  <SidebarMenuItem key={p.id}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to="/playbook/phase/$id" params={{ id: p.id }}>
                        <Icon className="size-4" style={{ color: `var(${p.colorVar})` }} />
                        <span className="truncate">
                          <span className="font-mono text-[10px] mr-1.5 opacity-60">P{p.number}</span>
                          {p.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {active && letters.length > 0 && (
                      <SidebarMenuSub>
                        {letters.map((l) => (
                          <SidebarMenuSubItem key={l.id}>
                            <SidebarMenuSubButton asChild>
                              <Link to="/playbook/letter/$id" params={{ id: l.id }}>
                                <span className="font-mono text-[10px] opacity-60">{l.id}</span>
                                <span className="truncate">{l.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto border-t border-sidebar-border/60 px-2 py-3">
          <SidebarGroupLabel className="eyebrow mb-1 text-[10px]">Quick access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PINNED_RESOURCES.map((r) => (
                <SidebarMenuItem key={r.id}>
                  <SidebarMenuButton asChild>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Folder className="size-4 shrink-0 text-[color:var(--brand-gold-deep)]" />
                      <span className="truncate">{r.label}</span>
                      <ArrowUpRight className="ml-auto size-3 opacity-50" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <a href="https://shondamartin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
          shondamartin.com ↗
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
