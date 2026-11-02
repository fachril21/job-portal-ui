import { WorkspaceShell } from "@/components/shell/WorkspaceShell";

export default function PartnerLayout({ children }: LayoutProps<"/partner">) {
  return <WorkspaceShell role="partner">{children}</WorkspaceShell>;
}
