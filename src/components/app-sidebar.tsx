import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
  ChevronUp,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

// Active-state classes used on every menu/sub-button so the currently-rendered
// page is unmistakable inside the mobile sheet (and remains clear on desktop).
const ACTIVE_CLS =
  "data-[active=true]:bg-[color:var(--brand-gold)]/15 data-[active=true]:text-foreground data-[active=true]:font-semibold data-[active=true]:border-l-2 data-[active=true]:border-[color:var(--brand-gold-deep)] data-[active=true]:rounded-l-none";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { setOpenMobile, isMobile, openMobile } = useSidebar();
  const wasOpenRef = useRef(false);

  // Return focus to the SidebarTrigger after the mobile sheet closes via a tap.
  useEffect(() => {
    if (!isMobile) return;
    if (wasOpenRef.current && !openMobile) {
      requestAnimationFrame(() => {
        const trigger = document.querySelector<HTMLElement>('[data-sidebar="trigger"]');
        trigger?.focus();
      });
    }
    wasOpenRef.current = openMobile;
  }, [openMobile, isMobile]);

  // When the mobile sheet opens, auto-scroll the active phase/letter sublink
  // into view so the user instantly sees where they are.
  useEffect(() => {
    if (!isMobile || !openMobile) return;
    // Wait for sheet content to mount and animate in.
    const t = window.setTimeout(() => {
    const sheet = document.querySelector<HTMLElement>('[data-mobile="true"][data-sidebar="sidebar"]');
      const target =
        sheet?.querySelector<HTMLElement>('[data-active-scroll="letter"]') ??
        sheet?.querySelector<HTMLElement>('[data-active-scroll="phase"]') ??
        sheet?.querySelector<HTMLElement>('[data-active-scroll="link"]');
      target?.scrollIntoView({ block: "center", behavior: "auto" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [isMobile, openMobile, pathname]);

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };
  const isActive = (path: string) => pathname === path;
  const isPhaseActive = (id: string) => pathname.startsWith(`/playbook/phase/${id}`);
  const isLetterActive = (id: string) => pathname === `/playbook/letter/${id}`;

  // Collapsible group state — open by default; auto-expand the group containing the active route.
  const playbookHasActive =
    pathname === "/playbook" ||
    pathname.startsWith("/playbook/foundation") ||
    pathname.startsWith("/playbook/strategy") ||
    pathname.startsWith("/playbook/phase") ||
    pathname.startsWith("/playbook/letter") ||
    pathname.startsWith("/letters");
  const companionHasActive =
    pathname.startsWith("/tracker") ||
    pathname.startsWith("/decoder") ||
    pathname.startsWith("/resources");

  // Persist expanded/collapsed state across sessions so the user's preferred
  // menu layout reappears on next open. We hydrate after mount to avoid SSR mismatch.
  const STORAGE_KEY = "sidebar:groups:v1";
  const ORDER_KEY = "sidebar:order:v1";
  type GroupId = "playbook" | "phases" | "companion";
  const DEFAULT_ORDER: GroupId[] = ["playbook", "phases", "companion"];
  const [playbookOpen, setPlaybookOpen] = useState(true);
  const [companionOpen, setCompanionOpen] = useState(true);
  const [phasesOpen, setPhasesOpen] = useState(true);
  const [order, setOrder] = useState<GroupId[]>(DEFAULT_ORDER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<{ playbook: boolean; companion: boolean; phases: boolean }>;
        if (typeof saved.playbook === "boolean") setPlaybookOpen(saved.playbook);
        if (typeof saved.companion === "boolean") setCompanionOpen(saved.companion);
        if (typeof saved.phases === "boolean") setPhasesOpen(saved.phases);
      }
      const rawOrder = window.localStorage.getItem(ORDER_KEY);
      if (rawOrder) {
        const parsed = JSON.parse(rawOrder) as GroupId[];
        // Validate: every default id present exactly once.
        if (
          Array.isArray(parsed) &&
          parsed.length === DEFAULT_ORDER.length &&
          DEFAULT_ORDER.every((id) => parsed.includes(id))
        ) {
          setOrder(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ playbook: playbookOpen, companion: companionOpen, phases: phasesOpen }),
      );
    } catch {
      /* ignore */
    }
  }, [hydrated, playbookOpen, companionOpen, phasesOpen]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* ignore */
    }
  }, [hydrated, order]);

  // Auto-expand the group containing the active route (overrides saved state
  // only when navigating into a collapsed group, so users always see context).
  useEffect(() => {
    if (playbookHasActive) setPlaybookOpen(true);
    if (companionHasActive) setCompanionOpen(true);
  }, [playbookHasActive, companionHasActive]);

  const moveGroup = (id: GroupId, dir: -1 | 1) => {
    setOrder((curr) => {
      const idx = curr.indexOf(id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= curr.length) return curr;
      const next = curr.slice();
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const groupHeader = (id: GroupId, label: string, open: boolean) => {
    const idx = order.indexOf(id);
    const isFirst = idx === 0;
    const isLast = idx === order.length - 1;
    return (
      <div className="flex w-full items-center gap-1">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex flex-1 items-center justify-between px-2 py-1.5 text-left rounded hover:bg-sidebar-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)]"
            aria-expanded={open}
          >
            <SidebarGroupLabel className="eyebrow m-0 text-[10px]">{label}</SidebarGroupLabel>
            <ChevronDown
              className={`size-3.5 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
              aria-hidden="true"
            />
          </button>
        </CollapsibleTrigger>
        <div className="flex items-center" aria-label={`Reorder ${label}`}>
          <button
            type="button"
            onClick={() => moveGroup(id, -1)}
            disabled={isFirst}
            aria-label={`Move ${label} up`}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground disabled:opacity-25 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)]"
          >
            <ChevronUp className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => moveGroup(id, 1)}
            disabled={isLast}
            aria-label={`Move ${label} down`}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-foreground disabled:opacity-25 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)]"
          >
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  };

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
        {(() => {
          const groups: Record<GroupId, React.ReactNode> = {
            playbook: (
              <Collapsible key="playbook" open={playbookOpen} onOpenChange={setPlaybookOpen}>
                <SidebarGroup className="border-t border-sidebar-border/60 px-2 py-3 first:border-t-0">
                  {groupHeader("playbook", "Playbook", playbookOpen)}
                  <CollapsibleContent>
                    <SidebarGroupContent className="mt-1">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/playbook")} className={ACTIVE_CLS}>
                            <Link to="/playbook" onClick={closeMobile} data-active-scroll={isActive("/playbook") ? "link" : undefined}><BookOpen className="size-4" /> Cover</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/playbook/foundation")} className={ACTIVE_CLS}>
                            <Link to="/playbook/foundation" onClick={closeMobile} data-active-scroll={isActive("/playbook/foundation") ? "link" : undefined}><Compass className="size-4" /> Foundation</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/playbook/strategy")} className={ACTIVE_CLS}>
                            <Link to="/playbook/strategy" onClick={closeMobile} data-active-scroll={isActive("/playbook/strategy") ? "link" : undefined}><ScrollText className="size-4" /> Strategy</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/letters")} className={ACTIVE_CLS}>
                            <Link to="/letters" onClick={closeMobile} data-active-scroll={isActive("/letters") ? "link" : undefined}><Library className="size-4" /> Letter library</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ),
            phases: (
              <Collapsible key="phases" open={phasesOpen} onOpenChange={setPhasesOpen}>
                <SidebarGroup className="border-t border-sidebar-border/60 px-2 py-3 first:border-t-0">
                  {groupHeader("phases", "Phases", phasesOpen)}
                  <CollapsibleContent>
                    <SidebarGroupContent className="mt-1">
                      <SidebarMenu>
                        {PHASES.map((p) => {
                          const Icon = phaseIcon[p.id];
                          const letters = lettersForPhase(p.id);
                          const active = isPhaseActive(p.id);
                          return (
                            <SidebarMenuItem key={p.id}>
                              <SidebarMenuButton asChild isActive={active} className={ACTIVE_CLS}>
                                <Link to="/playbook/phase/$id" params={{ id: p.id }} onClick={closeMobile} data-active-scroll={active ? "phase" : undefined}>
                                  <Icon className="size-4" style={{ color: `var(${p.colorVar})` }} />
                                  <span className="truncate">
                                    <span className="font-mono text-[10px] mr-1.5 opacity-60">P{p.number}</span>
                                    {p.name}
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                              {active && letters.length > 0 && (
                                <SidebarMenuSub>
                                  {letters.map((l) => {
                                    const lActive = isLetterActive(l.id);
                                    return (
                                      <SidebarMenuSubItem key={l.id}>
                                        <SidebarMenuSubButton
                                          asChild
                                          isActive={lActive}
                                          className="data-[active=true]:bg-[color:var(--brand-gold)]/15 data-[active=true]:text-foreground data-[active=true]:font-semibold data-[active=true]:border-l-2 data-[active=true]:border-[color:var(--brand-gold-deep)]"
                                          aria-current={lActive ? "page" : undefined}
                                        >
                                          <Link to="/playbook/letter/$id" params={{ id: l.id }} onClick={closeMobile} data-active-scroll={lActive ? "letter" : undefined}>
                                            <span className="font-mono text-[10px] opacity-60">{l.id}</span>
                                            <span className="truncate">{l.title}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                </SidebarMenuSub>
                              )}
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ),
            companion: (
              <Collapsible key="companion" open={companionOpen} onOpenChange={setCompanionOpen}>
                <SidebarGroup className="border-t border-sidebar-border/60 px-2 py-3 first:border-t-0">
                  {groupHeader("companion", "Companion tools", companionOpen)}
                  <CollapsibleContent>
                    <SidebarGroupContent className="mt-1">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/tracker")} className={ACTIVE_CLS}>
                            <Link to="/tracker" onClick={closeMobile} data-active-scroll={isActive("/tracker") ? "link" : undefined}><ClipboardList className="size-4" /> Dispute tracker</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/decoder")} className={ACTIVE_CLS}>
                            <Link to="/decoder" onClick={closeMobile} data-active-scroll={isActive("/decoder") ? "link" : undefined}><ScanSearch className="size-4" /> Response decoder</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/resources")} className={ACTIVE_CLS}>
                            <Link to="/resources" onClick={closeMobile} data-active-scroll={isActive("/resources") ? "link" : undefined}><Sparkles className="size-4" /> Resources</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* External companion links — same ordered group, tappable, close sheet on tap */}
                        {PINNED_RESOURCES.map((r) => (
                          <SidebarMenuItem key={r.id}>
                            <SidebarMenuButton asChild>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMobile}
                                className="flex items-center gap-2"
                              >
                                <Folder className="size-4 shrink-0 text-[color:var(--brand-gold-deep)]" />
                                <span className="truncate">{r.label}</span>
                                <ArrowUpRight className="ml-auto size-3 opacity-50" aria-hidden="true" />
                                <span className="sr-only"> (opens in new tab)</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ),
          };
          return order.map((id) => groups[id]);
        })()}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <a
          href="https://shondamartin.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          shondamartin.com ↗
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
