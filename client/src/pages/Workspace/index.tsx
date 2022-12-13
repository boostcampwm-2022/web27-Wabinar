import Workspace from 'components/Workspace';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getWorkspaces } from 'src/apis/user';
import DefaultWorkspace from 'src/components/Workspace/DefaultWorkspace';
import WorkspacesContext from 'src/contexts/workspaces';
import { useUserContext } from 'src/hooks/useUserContext';
import { Workspace as TWorkspace } from 'src/types/workspace';

import Layout from './Layout';

function WorkspacePage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<TWorkspace[]>([]);

  const loadWorkspaces = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    const { id: userId } = user;

    const { workspaces: userWorkspaces } = await getWorkspaces({
      id: userId,
    });

    setWorkspaces(userWorkspaces);

    if (!userWorkspaces.length) {
      navigate('/workspace');
      return;
    }

    const defaultWorkspace = userWorkspaces[0];
    const { id: workspaceId } = defaultWorkspace;

    navigate(`/workspace/${workspaceId}`);
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  return (
    <WorkspacesContext.Provider value={{ workspaces, setWorkspaces }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DefaultWorkspace />} />
          <Route path="/:id" element={<Workspace />} />
        </Route>
      </Routes>
    </WorkspacesContext.Provider>
  );
}

export default WorkspacePage;
