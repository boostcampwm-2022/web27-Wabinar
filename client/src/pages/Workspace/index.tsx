import Workspace from 'components/Workspace';
import { Route, Routes } from 'react-router-dom';
import DefaultWorkspace from 'src/components/Workspace/DefaultWorkspace';

import Layout from './Layout';

function WorkspacePage() {
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
