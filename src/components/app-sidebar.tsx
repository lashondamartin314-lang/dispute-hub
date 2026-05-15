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
  Award,
  MessageCircleQuestion,
  Home,
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
import { PhaseGrid } from "@/components/phase-grid";

const phaseIcon = {
  prepare: Compass,
  validate: ScrollText,
  "clean-identity": Sparkles,
  "dispute-bureaus": FileText,
  "challenge-furnishers": FileText,
  escalate: BookOpen,
} as const;

// Pearl-pill aesthetic: every nav row is a soft white pill with an inner
// hairline, lifting on hover. Active uses a magenta-tinted shadow and a
// magenta dot accent, signaling "you are here" without color noise.
const PILL_BASE =
  "rounded-2xl px-4 py-3 bg-white/40 border border-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] " +
  "transition-all duration-300 ease-out " +
  "hover:bg-white hover:border-white hover:shadow-[0_8px_18px_-6px_rgba(12,19,64,0.10),inset_0_1px_2px_rgba(255,255,255,0.85)] " +
  "hover:-translate-y-px";

const ACTIVE_CLS =
  PILL_BASE +
  " data-[active=true]:bg-white data-[active=true]:border-[color:var(--brand-magenta)]/35 " +
  "data-[active=true]:shadow-[0_12px_24px_-8px_rgba(241,0,133,0.28),inset_0_1px_2px_rgba(255,255,255,1)] " +
  "data-[active=true]:text-[color:var(--sidebar-foreground)] data-[active=true]:font-semibold";

const PHASE_ACTIVE_CLS = ACTIVE_CLS + " data-[active=true]:scale-[1.015]";

const HOVER_CLS = "";
const PHASE_HOVER_CLS = "";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { setOpenMobile, setOpen, isMobile, openMobile } = useSidebar();
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
        sheet?.querySelector<HTMLElement>('[data-active-scroll="link"]') ??
        // Fallback: no active match — scroll to the first nav item so the
        // user lands at the top of the menu instead of wherever it last was.
        sheet?.querySelector<HTMLElement>('[data-sidebar="menu-button"]');
      if (!target) return;
      // Honor prefers-reduced-motion: jump instantly instead of animating.
      const prefersReducedMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        block: "center",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      // Move keyboard focus to the active item so screen-reader and
      // keyboard users land on the same place sighted users see.
      // preventScroll avoids fighting the scrollIntoView we just ran.
      target.focus({ preventScroll: true });
    }, 120);
    return () => window.clearTimeout(t);
  }, [isMobile, openMobile, pathname]);

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
    else setOpen(false); // desktop: collapse to icon rail when navigating
  };

  // Auto-collapse the desktop sidebar to its icon rail once the user scrolls
  // past the cover hero on /. They can re-expand any time via the trigger.
  useEffect(() => {
    if (isMobile) return;
    if (pathname !== "/") return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setOpen(false);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, pathname, setOpen]);
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
    pathname.startsWith("/resources") ||
    pathname.startsWith("/progress") ||
    pathname.startsWith("/ask");

  // Persist expanded/collapsed state across sessions so the user's preferred
  // menu layout reappears on next open. We hydrate after mount to avoid SSR mismatch.
  const STORAGE_KEY = "sidebar:groups:v2";
  const ORDER_KEY = "sidebar:order:v2";
  type GroupId = "companion" | "phases";
  const DEFAULT_ORDER: GroupId[] = ["companion", "phases"];
  const [companionOpen, setCompanionOpen] = useState(true);
  const [phasesOpen, setPhasesOpen] = useState(true);
  const [order, setOrder] = useState<GroupId[]>(DEFAULT_ORDER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<{ companion: boolean; phases: boolean }>;
        if (typeof saved.companion === "boolean") setCompanionOpen(saved.companion);
        if (typeof saved.phases === "boolean") setPhasesOpen(saved.phases);
      }
      const rawOrder = window.localStorage.getItem(ORDER_KEY);
      if (rawOrder) {
        const parsed = JSON.parse(rawOrder) as GroupId[];
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
        JSON.stringify({ companion: companionOpen, phases: phasesOpen }),
      );
    } catch {
      /* ignore */
    }
  }, [hydrated, companionOpen, phasesOpen]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* ignore */
    }
  }, [hydrated, order]);

  // Auto-expand the group containing the active route.
  useEffect(() => {
    if (playbookHasActive) setPhasesOpen(true);
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

  // On mobile, the AppSidebar's built-in Sheet is replaced by <MobileNavDrawer />
  // (mounted in __root.tsx) for a richer Framer Motion drawer with drag-to-close.
  if (isMobile) return null;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
      data-lenis-prevent
    >
      <SidebarHeader className="border-b border-sidebar-border/70 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        <Link
          to="/"
          onClick={closeMobile}
          aria-label="Home"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white/70 text-[color:var(--sidebar-foreground)] shadow-[0_4px_12px_-6px_rgba(12,19,64,0.18)] transition-all hover:-translate-y-px hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-magenta)]"
        >
          <Home className="size-5" aria-hidden="true" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-3 py-3">
        {(() => {
          const groups: Record<GroupId, React.ReactNode> = {
            phases: (
              <Collapsible key="phases" open={phasesOpen} onOpenChange={setPhasesOpen}>
                <SidebarGroup className="border-t border-sidebar-border/60 px-2 py-3 first:border-t-0">
                  {groupHeader("phases", "Phases", phasesOpen)}
                  <CollapsibleContent>
                    <SidebarGroupContent className="mt-1">
                      {/* Home is the only entry to / — the header logo is also Home. No separate "Cover" row. */}

                      {/* Square P1–P6 grid replaces the stacked phase rows. */}
                      <div className="px-1 pt-2">
                        <PhaseGrid variant="sidebar" onSelect={closeMobile} />
                      </div>

                      {/* Active phase exposes its letters below the grid. */}
                      {(() => {
                        const activePhase = PHASES.find((p) => isPhaseActive(p.id));
                        if (!activePhase) return null;
                        const letters = lettersForPhase(activePhase.id);
                        if (letters.length === 0) return null;
                        return (
                          <div className="mt-3 px-1">
                            <p
                              className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                              style={{ color: `var(${activePhase.colorVar}-deep)` }}
                            >
                              P{activePhase.number} · Letters
                            </p>
                            <SidebarMenu>
                              {letters.map((l) => {
                                const lActive = isLetterActive(l.id);
                                return (
                                  <SidebarMenuItem key={l.id}>
                                    <SidebarMenuButton
                                      asChild
                                      isActive={lActive}
                                      className="rounded-xl data-[active=true]:bg-white data-[active=true]:text-[color:var(--sidebar-foreground)] data-[active=true]:font-semibold data-[active=true]:shadow-[0_6px_14px_-6px_rgba(241,0,133,0.25)]"
                                      aria-current={lActive ? "page" : undefined}
                                    >
                                      <Link
                                        to="/playbook/letter/$id"
                                        params={{ id: l.id }}
                                        onClick={closeMobile}
                                        data-active-scroll={lActive ? "letter" : undefined}
                                      >
                                        <span className="font-mono text-[10px] opacity-60">{l.id}</span>
                                        <span className="truncate">{l.title}</span>
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                );
                              })}
                            </SidebarMenu>
                          </div>
                        );
                      })()}
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
                          <SidebarMenuButton asChild isActive={isActive("/playbook/foundation")} tooltip="Foundation" className={ACTIVE_CLS}>
                            <Link to="/playbook/foundation" onClick={closeMobile} data-active-scroll={isActive("/playbook/foundation") ? "link" : undefined}><Compass className="size-4" /> Foundation</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/playbook/strategy")} tooltip="Strategy overview" className={ACTIVE_CLS}>
                            <Link to="/playbook/strategy" onClick={closeMobile} data-active-scroll={isActive("/playbook/strategy") ? "link" : undefined}><ScrollText className="size-4" /> Strategy overview</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/letters")} tooltip="Letter library" className={ACTIVE_CLS}>
                            <Link to="/letters" onClick={closeMobile} data-active-scroll={isActive("/letters") ? "link" : undefined}><Library className="size-4" /> Letter library</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/tracker")} tooltip="Dispute tracker" className={ACTIVE_CLS}>
                            <Link to="/tracker" onClick={closeMobile} data-active-scroll={isActive("/tracker") ? "link" : undefined}><ClipboardList className="size-4" /> Dispute tracker</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/decoder")} tooltip="Response decoder" className={ACTIVE_CLS}>
                            <Link to="/decoder" onClick={closeMobile} data-active-scroll={isActive("/decoder") ? "link" : undefined}><ScanSearch className="size-4" /> Response decoder</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/resources")} tooltip="Resources" className={ACTIVE_CLS}>
                            <Link to="/resources" onClick={closeMobile} data-active-scroll={isActive("/resources") ? "link" : undefined}><Sparkles className="size-4" /> Resources</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/progress")} tooltip="Your progress" className={ACTIVE_CLS}>
                            <Link to="/progress" onClick={closeMobile} data-active-scroll={isActive("/progress") ? "link" : undefined}><Award className="size-4" /> Your progress</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive("/ask")} tooltip="Ask Shonda" className={ACTIVE_CLS}>
                            <Link to="/ask" onClick={closeMobile} data-active-scroll={isActive("/ask") ? "link" : undefined}>
                              <MessageCircleQuestion className="size-4" /> Ask Shonda
                              {isActive("/ask") && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[color:var(--brand-magenta)] shadow-[0_0_8px_var(--brand-magenta)]" aria-hidden />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
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

      <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
        {/* Quick Access and External Resources removed — duplicates of the
            Companion tools group above and the Companion Hub menu in the header. */}
        <a
          href="https://shondamartin.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
          className="inline-flex items-center gap-1 px-1 text-xs text-[#1a0dab] underline underline-offset-2 decoration-[#1a0dab]/40 hover:decoration-[#1a0dab]"
        >
          shondamartin.com
          <ArrowUpRight className="size-3" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab, leaves the Playbook)</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}

