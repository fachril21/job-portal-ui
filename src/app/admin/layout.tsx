import { WorkspaceShell } from "@/components/shell/WorkspaceShell";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <WorkspaceShell role="admin">{children}</WorkspaceShell>;
}
