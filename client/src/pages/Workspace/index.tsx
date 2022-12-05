import Workspace from 'components/Workspace';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout';

function WorkspacePage() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>만들어질 예정인 예외 페이지</div>} />
        <Route path="/:id" element={<Workspace />} />
      </Route>
    </Routes>
  );
}

export default WorkspacePage;
