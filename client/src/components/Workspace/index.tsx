import Confbar from 'components/Confbar';
import Mom from 'components/Mom';
import Sidebar from 'components/Sidebar';
import { TMom } from 'src/types/mom';
import { TUser } from 'src/types/user';

interface WorkspaceProps {
  name: string;
  members: TUser[];
  moms: TMom[];
}

function Workspace({ name, members, moms }: WorkspaceProps) {
  return (
    <>
      <Sidebar />
      <Mom />
      <Confbar />
    </>
  );
}

export default Workspace;
