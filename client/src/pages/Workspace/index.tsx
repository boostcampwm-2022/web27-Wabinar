import Workspace from 'components/Workspace';
import { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { getWorkspaces } from 'src/apis/user';
import DefaultWorkspace from 'src/components/Workspace/DefaultWorkspace';
import { useUserContext } from 'src/hooks/useUserContext';

import Layout from './Layout';

function WorkspacePage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const loadWorkspaces = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    const { id: userId } = user;

    const { workspaces } = await getWorkspaces({ id: userId });

    if (!workspaces.length) {
      navigate('/workspace');
      return;
    }

    const defaultWorkspace = workspaces[0];
    const { id: workspaceId } = defaultWorkspace;

    navigate(`/workspace/${workspaceId}`);
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DefaultWorkspace />} />
        <Route path="/:id" element={<Workspace />} />
      </Route>
    </Routes>
  );
}

export default WorkspacePage;
