import { listProjects } from '@/lib/projects/queries';
import { ProjectTable } from '@/components/common/project-table';
import { getSessionUser } from '@/lib/auth/get-session-user';

export default async function ProjectsPage() {
  const [projects, user] = await Promise.all([listProjects(), getSessionUser()]);
  if (!user) {
    return null;
  }

  return <ProjectTable projects={projects} role={user.role} />;
}
