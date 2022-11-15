import style from "./style.module.scss";
import WorkspaceList from "src/components/WorkspaceList";
import Modal from "src/components/common/Modal";

function WorkspacePage() {
  return (
    <div className={style.container}>
      <WorkspaceList />
      <Modal className={style["select-modal"]} isHaveCloseBtn={false}>
        <ul className={style["menu-list"]}>
          <li>생성하기</li>
          <li>참여하기</li>
        </ul>
      </Modal>
    </div>
  );
}

export default WorkspacePage;
