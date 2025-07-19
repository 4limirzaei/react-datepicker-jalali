import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import DatePickerMode from "./modes/DatePickerMode";
import YearPickerMode from "./modes/YearPickerMode";
import MonthPickerMode from "./modes/MonthPickerMode";
import "./index.css";

dayjs.extend(jalaliday);

type PropsType = {
  label?: string;
  name?: string;
  placeholder?: string;
  inputClassName?: string;
  dialogClassName?: string;
  dayClassName?: string;
  renderLeftIcon?: JSX.Element;
  renderRightIcon?: JSX.Element;
  pickerType?: "dialog" | "popper";
  pickerMode?: "datePicker" | "monthPicker" | "yearPicker";
  onDateChange: (value: string | Number) => void;
};

export default function DatePicker({
  label,
  name,
  placeholder,
  inputClassName,
  dialogClassName,
  dayClassName,
  renderLeftIcon,
  renderRightIcon,
  pickerType = "dialog",
  pickerMode = "datePicker",
  onDateChange,
  ...props
}: PropsType) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const handleSelectDate = (day: Dayjs) => {
    onDateChange(day.format("YYYY/MM/DD"));
    setSelectedDate(day.format("YYYY/MM/DD"));
    setShowDatePicker(false);
  };

  const handleSelectMonth = (month: { title: string; value: Number }) => {
    onDateChange(month.value);
    setSelectedMonth(month.title);
    setShowDatePicker(false);
  };

  const handleSelectYear = (year: Number) => {
    onDateChange(year);
    setSelectedYear(String(year));
    setShowDatePicker(false);
  };

  return (
    <div className="datepicker-wrapper" dir="rtl">
      {label && <label className="datepicker-label">{label}</label>}

      <input
        type="text"
        name={name}
        readOnly
        inputMode="none"
        value={selectedDate || selectedMonth || selectedYear}
        placeholder={placeholder || label}
        className={inputClassName || "datepicker-input"}
        onClick={() => setShowDatePicker(true)}
        {...props}
      />

      {pickerMode === "datePicker" && (
        <DatePickerMode
          showDatePicker={showDatePicker}
          renderLeftIcon={renderLeftIcon}
          renderRightIcon={renderRightIcon}
          dayClassName={dayClassName}
          datePickerType={pickerType}
          onSelectDate={(day: Dayjs) => handleSelectDate(day)}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {pickerMode === "monthPicker" && (
        <MonthPickerMode
          showDatePicker={showDatePicker}
          monthClassName={dayClassName}
          datePickerType={pickerType}
          onSelectMonth={(month: { title: string; value: Number }) =>
            handleSelectMonth(month)
          }
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {pickerMode === "yearPicker" && (
        <YearPickerMode
          showDatePicker={showDatePicker}
          renderLeftIcon={renderLeftIcon}
          renderRightIcon={renderRightIcon}
          monthClassName={dayClassName}
          datePickerType={pickerType}
          onSelectYear={(year: Number) => handleSelectYear(year)}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}
