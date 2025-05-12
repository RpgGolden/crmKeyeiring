import ModalAddOfice from "../../modules/ModalAddOfice/ModalAddOfice";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import styles from "./Dish.module.scss";
import HeadBlock from "./HeadBlock/HeadBlock";
import Table from "./../../modules/Table/Table";
import { addOfficeData, paramMenu, tableHeader } from "./data";
import { useContext, useEffect, useState } from "react";
import {
  addCategory,
  addDish,
  deleteCategory,
  deleteDish,
  GetAllCategory,
  GetAllDish,
  updateCategory,
  updateDish,
} from "../../API/ApiReguest";
import DataContext from "../../context";

function Dish() {
  const context = useContext(DataContext);

  const [tableData, setTableData] = useState([]);
  const [shearchParam, setShearchParam] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalEditData, setModalEditData] = useState({});
  const [modalEditInputData, setModalEditInputData] = useState({});
  const [createOfficeData, setCreateOfficeData] = useState({});
  const [originalData, setOriginalData] = useState([]);
  const [caregories, setCaregories] = useState([]);

  useEffect(() => {
    context.setSelectedRows([]);
    context.setActiveTable("Dish");
    context.getTableData("Dish");
    GetAllCategory().then((res) => {
      if (res?.status === 200) {
        setCaregories(res?.data);
      }
    });
  }, []);

  const funUpdApi = () => {
    GetAllDish().then((res) => {
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
    const formData = new FormData();
    createOfficeData.name && formData.append("name", createOfficeData.name);
    createOfficeData.description &&
      formData.append("description", createOfficeData.description);
    createOfficeData.imageUrl &&
      formData.append("image", createOfficeData.imageUrl);
    createOfficeData.price && formData.append("price", createOfficeData.price);
    createOfficeData.price &&
      formData.append("categoryId", createOfficeData.categoryId);

    addDish(formData).then((res) => {
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
      setModalEditData({
        ...param.row,
        category: caregories.find((item) => item.id === param.row.categoryId)
          .name,
        categoryId: param.row.categoryId,
        imageUrl: param.row.imageUrl,
      });
    }
    if (param.key === "delete") {
      deleteDish(param.row.id).then((res) => {
        if (res?.status === 200) {
          funUpdApi();
        }
      });
    }
  };

  const funEdit = () => {
    const formData = new FormData();
    modalEditData.name && formData.append("newName", modalEditData.name);
    modalEditData.description &&
      formData.append("description", modalEditData.description);
    modalEditData.imageUrl && formData.append("image", modalEditData.imageUrl);
    modalEditData.price && formData.append("price", modalEditData.price);
    modalEditData.price &&
      formData.append("categoryId", modalEditData.categoryId);
    updateDish(modalEditData.id, formData).then((res) => {
      if (res?.status === 200) {
        funUpdApi();
        setModalEditShow(false);
        setModalEditData({});
      }
    });
  };

  return (
    <div className={styles.Dish}>
      <HomePageTopMenu />
      <ModalAddOfice
        show={modalShow}
        setShow={setModalShow}
        title={"Добавить блюдо"}
        inputs={addOfficeData}
        data={createOfficeData}
        setData={setCreateOfficeData}
        funSave={funAddCategory}
        lists={{
          category: {
            data: caregories,
            key: "categoryId",
            value: ["name"],
          },
        }}
      />
      <ModalAddOfice
        edit={modalEditInputData}
        setEdit={setModalEditInputData}
        show={modalEditShow}
        setShow={setModalEditShow}
        title={"Редактировать данные блюда"}
        inputs={addOfficeData}
        data={modalEditData}
        setData={setModalEditData}
        funSave={funEdit}
        lists={{
          category: {
            data: caregories,
            key: "categoryId",
            value: ["name"],
          },
        }}
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

export default Dish;
