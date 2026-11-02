import { StudentShell } from "@/components/shell/StudentShell";

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return <StudentShell>{children}</StudentShell>;
}
