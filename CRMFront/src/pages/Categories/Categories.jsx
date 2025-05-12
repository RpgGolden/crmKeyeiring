import ModalAddOfice from "../../modules/ModalAddOfice/ModalAddOfice";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import styles from "./Categories.module.scss";
import HeadBlock from "./HeadBlock/HeadBlock";
import Table from "./../../modules/Table/Table";
import { addOfficeData, paramMenu, tableHeader } from "./data";
import { useContext, useEffect, useState } from "react";
import {
  addCategory,
  deleteCategory,
  GetAllCategory,
  updateCategory,
} from "../../API/ApiReguest";
import DataContext from "../../context";

function Categories() {
  const context = useContext(DataContext);

  const [tableData, setTableData] = useState([]);
  const [shearchParam, setShearchParam] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalEditData, setModalEditData] = useState({});
  const [modalEditInputData, setModalEditInputData] = useState({});
  const [createOfficeData, setCreateOfficeData] = useState({});
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    context.setSelectedRows([]);
    context.setActiveTable("Categories");
    context.getTableData("Categories");
  }, []);

  const funUpdApi = () => {
    GetAllCategory().then((res) => {
      if (res?.status === 200) {
        setTableData(res?.data);
        setOriginalData(res?.data);
      }
    });
  };
  useEffect(() => {
    funUpdApi();
  }, []);

  //! поиск по всем полям
  useEffect(() => {
    if (shearchParam.trim() !== "") {
      const filteredData = originalData.filter((item) =>
        Object.values(item).some((value) =>
          typeof value === "string" || typeof value === "number"
            ? value
                .toString()
                .toLowerCase()
                .includes(shearchParam.toLowerCase())
            : false
        )
      );
      setTableData(filteredData);
    } else {
      setTableData([...originalData]); // Сбрасываем фильтр
    }
  }, [shearchParam, originalData]);

  const funAddCategory = () => {
    addCategory(createOfficeData).then((res) => {
      if (res?.status === 200) {
        funUpdApi();
        setModalShow(false);
        setCreateOfficeData({});
      }
    });
  };

  const funParamMenu = (param) => {
    console.log("par", param);
    if (param.key === "edit") {
      setModalEditShow(true);
      setModalEditData(param.row);
    }
    if (param.key === "delete") {
      deleteCategory(param.row.id).then((res) => {
        if (res?.status === 200) {
          funUpdApi();
        }
      });
    }
  };

  const funEdit = () => {
    console.log("modalEditData", modalEditData);
    updateCategory(modalEditData.id + "", { newName: modalEditData.name }).then(
      (res) => {
        if (res?.status === 200) {
          funUpdApi();
          setModalEditShow(false);
          setModalEditData({});
        }
      }
    );
  };

  return (
    <div className={styles.Categories}>
      <HomePageTopMenu />
      <ModalAddOfice
        show={modalShow}
        setShow={setModalShow}
        title={"Добавить категорию"}
        inputs={addOfficeData}
        data={createOfficeData}
        setData={setCreateOfficeData}
        funSave={funAddCategory}
      />
      <ModalAddOfice
        edit={modalEditInputData}
        setEdit={setModalEditInputData}
        show={modalEditShow}
        setShow={setModalEditShow}
        title={"Редактировать данные категории"}
        inputs={addOfficeData}
        data={modalEditData}
        setData={setModalEditData}
        funSave={funEdit}
      />
      <HeadBlock
        setModalShow={setModalShow}
        shearchParam={shearchParam}
        setShearchParam={setShearchParam}
      />
      <div className={styles.content}>
        <Table
          prewData={[]}
          tableData={tableData}
          setTableData={setTableData}
          direction={[]}
          setModalShow={setModalShow}
          paramMenu={paramMenu}
          tableHeader={tableHeader}
          funClick={funParamMenu}
        />
      </div>
    </div>
  );
}

export default Categories;
