import { IconRobot, IconPlus, IconSettings, IconLogout, IconBrandOpenai, IconChartBar, IconUsers, IconCalendar, IconCalendarClock } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-custom";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const mainLinks = [
  {
    label: "Meus Agentes",
    href: "/dashboard",
    icon: (
      <IconRobot className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
  {
    label: "Criar Agente",
    href: "/create-agent",
    icon: (
      <IconPlus className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
];

const secondaryLinks = [
  {
    label: "Agenda",
    href: "/agenda",
    icon: (
      <IconCalendarClock className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
  {
    label: "Análises",
    href: "/analytics",
    icon: (
      <IconChartBar className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
  {
    label: "Clientes",
    href: "/clients",
    icon: (
      <IconUsers className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
  {
    label: "Agendamentos",
    href: "/appointments",
    icon: (
      <IconCalendar className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
];

const settingsLinks = [
  {
    label: "Configurações",
    href: "/settings",
    icon: (
      <IconSettings className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <Logo />
          
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              {mainLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            <div className="px-2">
              <Separator className="bg-border" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="px-2 mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Ferramentas</span>
              </div>
              {secondaryLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            <div className="px-2">
              <Separator className="bg-border" />
            </div>

            <div className="flex flex-col gap-1">
              {settingsLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <SidebarLink
            link={{
              label: "Sair",
              href: "/",
              icon: (
                <IconLogout className="h-5 w-5 shrink-0 text-foreground" />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <IconBrandOpenai className="h-5 w-5 text-primary-foreground" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-lg whitespace-pre text-foreground"
      >
        AgentForge
      </motion.span>
    </Link>
  );
};
