import { Mom } from 'src/types/mom';
import { User } from 'src/types/user';

interface WorkspaceProps {
  name: string;
  members: User[];
  moms: Mom[];
}

function Workspace({ name, members, moms }: WorkspaceProps) {
  console.log(name, members, moms);
  return <div></div>;
}

export default Workspace;
