import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import Dialog from "../components/Dialog";
import Popper from "../components/Popper";

dayjs.extend(jalaliday);

type PropsType = {
  showDatePicker: boolean;
  dialogClassName?: string;
  popperClassName?: string;
  renderLeftIcon?: JSX.Element;
  renderRightIcon?: JSX.Element;
  dayClassName?: string;
  datePickerType?: "dialog" | "popper";
  selectsPosition?: "top" | "bottom";
  triggerRef?: React.RefObject<HTMLElement>;
  onSelectDate: (value: Dayjs) => void;
  onClose: () => void;
};

export default function DatePickerMode({
  showDatePicker,
  dialogClassName,
  popperClassName,
  renderRightIcon,
  renderLeftIcon,
  dayClassName,
  datePickerType,
  selectsPosition,
  triggerRef,
  onSelectDate,
  onClose,
}: PropsType) {
  const [currentDate, setCurrentDate] = useState(dayjs().calendar("jalali"));
  const [currentYear, setCurrentYear] = useState(currentDate.get("year"));
  const [currentMonth, setCurrentMonth] = useState(
    currentDate.get("month") + 1
  );

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };
  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleChangeMonth = (value: string) => {
    setCurrentDate(currentDate.set("month", +value - 1));
  };

  const handleChangeYear = (value: string) => {
    setCurrentDate(currentDate.set("year", +value));
  };

  const generateYears = () => {
    const years = [];
    for (let i = currentYear - 110; i < currentYear + 110; i++) {
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
    onSelectDate(day);
    onClose();
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

  const SelectControllers = () => {
    return (
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
    );
  };

  useEffect(() => {
    setCurrentMonth(currentDate.get("month") + 1);
    setCurrentYear(currentDate.get("year"));
  }, [currentDate]);

  const DatePicker = () => {
    return (
      <div className="datepicker-dialog-body">
        <div className="datepicker-header">
          <button onClick={handlePrevMonth}>{renderRightIcon || "‹"}</button>
          <span>{currentDate.locale("fa").format("MMMM YYYY")}</span>
          <button onClick={handleNextMonth}>{renderLeftIcon || "›"}</button>
        </div>

        {selectsPosition === "top" && <SelectControllers />}

        <div className="datepicker-grid datepicker-days-name">
          {dayNames.map((dayName, index) => (
            <div key={index}>{dayName}</div>
          ))}
        </div>

        <div className="datepicker-grid datepicker-days">
          {daysOfMonth.map((day, index) => {
            const isToday = dayjs().isSame(day, "day");
            const isOutOfMonth = !day.isSame(currentDate, "month");
            const isFriday = day.day() === 5;

            const defaultStyle = {
              border: isToday ? "1px solid blue" : "1px solid",
              opacity: isOutOfMonth ? 0.4 : 1,
              color: isFriday ? "red" : undefined,
            };

            return (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  padding: "6px",
                  textAlign: "center",
                  ...defaultStyle,
                }}
                className={dayClassName}
                onClick={() => handleSelectDate(day)}
              >
                {day.format("D")}
              </div>
            );
          })}
        </div>

        {selectsPosition === "bottom" && <SelectControllers />}
      </div>
    );
  };

  return (
    <>
      {datePickerType === "dialog" && (
        <Dialog
          show={showDatePicker}
          onClose={onClose}
          dialogClassName={dialogClassName}
        >
          <DatePicker />
        </Dialog>
      )}

      {datePickerType === "popper" && (
        <Popper
          show={showDatePicker}
          onClose={onClose}
          popperClassName={popperClassName}
          triggerRef={triggerRef}
        >
          <DatePicker />
        </Popper>
      )}
    </>
  );
}
