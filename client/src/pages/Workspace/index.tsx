import Workspace from 'components/Workspace';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getWorkspaces } from 'src/apis/user';
import DefaultWorkspace from 'src/components/Workspace/DefaultWorkspace';
import WorkspacesContext from 'src/contexts/workspaces';
import { useUserContext } from 'src/hooks/useUserContext';
import LoadingPage from 'src/pages/Loading';
import { Workspace as TWorkspace } from 'src/types/workspace';

import Layout from './Layout';

function WorkspacePage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState<TWorkspace[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadWorkspaces = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    const { id: userId } = user;

    const { workspaces: userWorkspaces } = await getWorkspaces({
      id: userId,
    });

    setIsLoaded(true);

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
      {isLoaded ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DefaultWorkspace />} />
            <Route path="/:id" element={<Workspace />} />
          </Route>
        </Routes>
      ) : (
        <LoadingPage />
      )}
    </WorkspacesContext.Provider>
  );
}

export default WorkspacePage;
