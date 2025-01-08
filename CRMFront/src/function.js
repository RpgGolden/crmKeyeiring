import { saveAs } from "file-saver";
import * as XLSX from "xlsx";


const getNormalDate = (date) => {
    if (date) {
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return "___";
}

const status = {
    pending: "Создан",
    approved: "Одобрен",
    declined: "Отклонен",
    completed: "Выполнен",
    canceled: "Отменен",
  };
const deliveryMethod = {
    pickup: "Самовывоз",
    delivery: "Доставка",
}

export function funFixDataTable(data) {
    return data.map((item, index) => {
      return {
        ...item,
            number: index,
            clientName: item.client.clientName || "___",
            clientEmail: item.client.clientEmail || "___",
            clientPhone: item.client.clientPhone || "___",
            eventType: item.eventType || "___",
            preferences: item.preferences || "___",
            eventStartDate: item.eventStartDate || "___",
            createdAt: item.createdAt || "___",
            budget: item.budget || "___",
            deliveryMethod: deliveryMethod[item.deliveryMethod] || "___",
            deliveryAddress: item.deliveryAddress || "___",
            status: status[item.status] || "___",
      };
    });
  }

//! Функция генерации файла для скачивания
export const generateAndDownloadExcel = (data, nameTable) => {
  let transformedData = {};

      transformedData = data.map(({ ...item }) => ({
        Имя_клиента: item.clientName || "___",
        Почта_клиента : item.clientEmail || "___",
        Номер_телефона: item.clientPhone || "___",
        Тип_мероприятия: item.eventType || "___",
        Предпочтения: item.preferences || "___",
        Дата_мероприятия: item.eventStartDate || "___",
        Бюджет: item.budget || "___",
        Способ_доставки: item.deliveryMethod || "___",
        Адрес_доставки: item.deliveryAddress || "___",
        Статус: item.status || "___",
      }));

  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Установка ширины столбцов
  const columnWidths = transformedData.reduce((widths, row) => {
    Object.keys(row).forEach((key, index) => {
      const value = row[key] ? row[key].toString() : "";
      widths[index] = Math.max(widths[index] || 10, value.length);
    });
    return widths;
  }, []);

  worksheet["!cols"] = columnWidths.map((width) => ({ wch: width + 10 })); // Добавляем немного запаса

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Moscow",
  };
  const formattedDate = currentDate
    .toLocaleString("ru-RU", options)
    .replace(/(\d+)\.(\d+)\.(\d+), (\d+):(\d+)/, "$3.$2.$1_$4:$5");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const excelData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(excelData, `Экспорт_Таблицы_${nameTable}_${formattedDate}.xlsx`);
};