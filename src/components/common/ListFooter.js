import { Spin } from "antd";
import styles from "../../styles/components/common/ListFooter.module.css";

const ListFooter = ({ loading, hasMore }) => {
  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <Spin tip="加载中..." />
      </div>
    );
  }
  if (!hasMore) {
    return (
      <div className={styles["all-loaded"]}>
        已加载全部数据
      </div>
    );
  }
  return null;
};

export default ListFooter; 