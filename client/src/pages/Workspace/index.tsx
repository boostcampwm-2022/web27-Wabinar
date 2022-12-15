import DefaultWorkspace from 'components/Workspace/DefaultWorkspace';
import WorkspaceSkeleton from 'components/Workspace/Skeleton';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { getWorkspaces } from 'src/apis/user';
import WorkspacesContext from 'src/contexts/workspaces';
import useUserContext from 'src/hooks/context/useUserContext';
import { Workspace as TWorkspace } from 'src/types/workspace';

function WorkspacePage() {
  const Layout = lazy(() => import('./Layout'));
  const Workspace = lazy(() => import('components/Workspace'));

  const { user } = useUserContext();

  const params = useParams();
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

    if (params['*']?.length) return;

    const defaultWorkspace = userWorkspaces[0];
    const { id: workspaceId } = defaultWorkspace;

    navigate(`/workspace/${workspaceId}`);
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <WorkspacesContext.Provider value={{ workspaces, setWorkspaces }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DefaultWorkspace />} />
            <Route path="/:id" element={<Workspace />} />
          </Route>
        </Routes>
      </WorkspacesContext.Provider>
    </Suspense>
  );
}

export default WorkspacePage;
