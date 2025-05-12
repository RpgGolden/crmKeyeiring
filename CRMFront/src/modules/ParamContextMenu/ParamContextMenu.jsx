import { useEffect, useRef } from "react";
import styles from "./ParamContextMenu.module.scss";

function ParamContextMenu({ openList, setOpenList, paramMenu, funClick, row }) {
  const listParamRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        listParamRef.current &&
        !listParamRef.current.contains(event.target)
      ) {
        setOpenList(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {openList && (
        <div className={styles.ParamContextMenu} ref={listParamRef}>
          {paramMenu.map((item, index) => (
            <button key={index} onClick={() => funClick({ ...item, row })}>
              {item.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default ParamContextMenu;
