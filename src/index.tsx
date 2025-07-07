import { useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import "./style.css";

dayjs.extend(jalaliday);

type PropsType = {
  label: string;
  placeholder?: string;
  name: string;
  onDateChange: (value: string) => void;
  inputClassName?: string;
  dialogClassName?: string;
  dayClassName?: (day: Dayjs) => string;
  renderLeftIcon?: JSX.Element;
  renderRightIcon?: JSX.Element;
};

export default function DatePicker({
  label,
  placeholder,
  name,
  onDateChange,
  inputClassName,
  dialogClassName,
  dayClassName,
  renderLeftIcon,
  renderRightIcon,
  ...props
}: PropsType) {
  const [currentDate, setCurrentDate] = useState(dayjs().calendar("jalali"));
  const [currentYear, setCurrentYear] = useState(currentDate.get("year"));
  const [currentMonth, setCurrentMonth] = useState(
    currentDate.get("month") + 1
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const datePickerModal = useRef<HTMLDialogElement>(null);

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleChangeMonth = (value: string) => {
    setCurrentDate(currentDate.set("month", +value - 1));
  };

  const handleChangeYear = (value: string) => {
    setCurrentDate(currentDate.set("year", +value));
  };

  const generateYears = () => {
    const years = [];
    for (let i = currentYear - 50; i < currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  };

  const generateDaysOfMonth = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const days: Dayjs[] = [];
    let day = startOfMonth.clone();

    const firstDayIndex = day.day();
    const lastDayIndex = endOfMonth.day();

    if (firstDayIndex < 6) {
      for (let i = 0; i < firstDayIndex + 1; i++) {
        days.push(startOfMonth.clone().subtract(firstDayIndex + 1 - i, "day"));
      }
    }

    while (day.isBefore(endOfMonth) || day.isSame(endOfMonth)) {
      days.push(day.clone());
      day = day.add(1, "day");
    }

    for (let i = 0; i < (lastDayIndex === 6 ? 6 : 6 - lastDayIndex - 1); i++) {
      days.push(endOfMonth.clone().add(i + 1, "day"));
    }

    return days;
  };

  const handleSelectDate = (day: Dayjs) => {
    onDateChange(day.format("YYYY/MM/DD"));
    setShowDatePicker(false);
  };

  const daysOfMonth = generateDaysOfMonth();
  const yearsList = generateYears();

  const dayNames = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const monthNames = [
    { title: "فروردین", value: 1 },
    { title: "اردیبهشت", value: 2 },
    { title: "خرداد", value: 3 },
    { title: "تیر", value: 4 },
    { title: "مرداد", value: 5 },
    { title: "شهریور", value: 6 },
    { title: "مهر", value: 7 },
    { title: "آبان", value: 8 },
    { title: "آذر", value: 9 },
    { title: "دی", value: 10 },
    { title: "بهمن", value: 11 },
    { title: "اسفند", value: 12 },
  ];

  useEffect(() => {
    setCurrentMonth(currentDate.get("month") + 1);
    setCurrentYear(currentDate.get("year"));
  }, [currentDate]);

  useEffect(() => {
    if (showDatePicker) {
      datePickerModal.current?.showModal();
    } else {
      datePickerModal.current?.close();
    }
  }, [showDatePicker]);

  return (
    <div className="datepicker-wrapper">
      <label className="datepicker-label">{label}</label>
      <input
        type="text"
        name={name}
        readOnly
        inputMode="none"
        placeholder={placeholder || label}
        className={inputClassName || "datepicker-input"}
        onClick={() => setShowDatePicker(true)}
        {...props}
      />
      <dialog
        ref={datePickerModal}
        className={dialogClassName || "datepicker-dialog"}
      >
        <div>
          <div className="datepicker-header">
            <button onClick={handlePrevMonth}>{renderRightIcon || "‹"}</button>
            <span>{currentDate.locale("fa").format("MMMM YYYY")}</span>
            <button onClick={handleNextMonth}>{renderLeftIcon || "›"}</button>
          </div>

          <div className="datepicker-grid">
            {dayNames.map((dayName, index) => (
              <div key={index}>{dayName}</div>
            ))}
          </div>

          <div className="datepicker-grid">
            {daysOfMonth.map((day, index) => {
              const isToday = dayjs().isSame(day, "day");
              const isOutOfMonth = !day.isSame(currentDate, "month");

              const defaultClass = [
                isToday ? "border:1px solid blue" : "",
                isOutOfMonth ? "opacity:0.4" : "",
              ].join(" ");

              return (
                <div
                  key={index}
                  style={{
                    cursor: "pointer",
                    padding: "6px",
                    textAlign: "center",
                  }}
                  className={dayClassName?.(day) || defaultClass}
                  onClick={() => handleSelectDate(day)}
                >
                  {day.format("D")}
                </div>
              );
            })}
          </div>

          <div className="datepicker-controls">
            <select
              className="datepicker-select"
              value={currentMonth}
              onChange={(e) => handleChangeMonth(e.target.value)}
            >
              {monthNames.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.title}
                </option>
              ))}
            </select>

            <select
              className="datepicker-select"
              value={currentYear}
              onChange={(e) => handleChangeYear(e.target.value)}
            >
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </dialog>
    </div>
  );
}
