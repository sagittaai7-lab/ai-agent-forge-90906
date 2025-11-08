import { IconRobot, IconPlus, IconSettings, IconLogout, IconBrandOpenai } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-custom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const links = [
  {
    label: "My Agents",
    href: "/dashboard",
    icon: (
      <IconRobot className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
  {
    label: "Create Agent",
    href: "/create-agent",
    icon: (
      <IconPlus className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <IconSettings className="h-5 w-5 shrink-0 text-foreground" />
    ),
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <Logo />
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Logout",
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
