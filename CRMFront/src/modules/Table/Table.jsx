import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useMemo } from "react";
import { heIL, ruRU } from "@mui/x-data-grid/locales";
import styles from "./Table.module.scss";
import { useSearchParams } from "react-router-dom";
import ParamContextMenu from "../ParamContextMenu/ParamContextMenu";

function CustomTable({ tableData, paramMenu, tableHeader, funClick }) {
  const [openList, setOpenList] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();

  // Получаем фильтр из URL
  const rawFilter = searchParams.get("filter");
  let parsedFilter = [];

  try {
    if (rawFilter) {
      parsedFilter = JSON.parse(decodeURIComponent(rawFilter));
    }
  } catch (e) {
    console.error("Ошибка парсинга фильтра", e);
  }

  // Применяем фильтрацию
  const filteredData = useMemo(() => {
    if (!parsedFilter.length) return tableData;

    return tableData.filter((row) =>
      parsedFilter.every((filter) =>
        String(row[filter.key])
          ?.toLowerCase()
          .includes(filter.value.toLowerCase())
      )
    );
  }, [tableData, parsedFilter]);

  // Колонки

  const columns =
    paramMenu?.length > 0
      ? [
          {
            field: "actions",
            headerName: "Действия",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <div
                className={styles.direction_container}
                style={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  paddingBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenList(params.id);
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <ParamContextMenu
                  openList={openList === params.id}
                  setOpenList={() => setOpenList(null)}
                  anchorEl={anchorEl}
                  paramMenu={paramMenu}
                  funClick={funClick}
                  row={params.row}
                />
              </div>
            ),
          },
          ...tableHeader.map((col) => ({
            field: col.key,
            headerName: col.name,
            width: col.width || 200,
            sortable: true,
            filterable: true,
            renderCell: (params) =>
              col.key === "imageUrl" ? (
                <img
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  src={params.value}
                />
              ) : (
                <div
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    paddingBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {params.value}
                </div>
              ),
          })),
        ]
      : [
          ...tableHeader.map((col) => ({
            field: col.key,
            headerName: col.name,
            width: col.width || 200,
            sortable: true,
            filterable: true,
            renderCell: (params) => (
              <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
                {params.value}
              </div>
            ),
          })),
        ];

  // Преобразуем данные (DataGrid требует поле `id`)
  const rows = filteredData.map((row, index) => ({
    id: row.id || index,
    number: index + 1,
    ...row,
  }));

  return (
    <div className={styles.Table}>
      <Box sx={{ height: 600, width: "100%", overflow: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sortingOrder={["asc", "desc"]}
          filterMode="client"
          getRowHeight={() => "auto"} // ← авто-высота
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </div>
  );
}

export default CustomTable;
