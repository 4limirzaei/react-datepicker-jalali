import dayjs from "dayjs";
import Dialog from "../components/Dialog";
import Popper from "../components/Popper";
import { useEffect, useState } from "react";

type PropsType = {
  showDatePicker: boolean;
  dialogClassName?: string;
  monthClassName?: string;
  renderLeftIcon?: JSX.Element;
  renderRightIcon?: JSX.Element;
  datePickerType?: "dialog" | "popper";
  onSelectYear: (value: Number) => void;
  onClose: () => void;
};

export default function YearPickerMode({
  showDatePicker,
  dialogClassName,
  monthClassName,
  datePickerType,
  renderRightIcon,
  renderLeftIcon,
  onSelectYear,
  onClose,
}: PropsType) {
  const [currentDate, setCurrentDate] = useState(dayjs().calendar("jalali"));
  const currentYear = currentDate.get("year");

  const generateYears = () => {
    const years = [];
    for (let i = currentYear - 4; i < currentYear + 8; i++) {
      years.push(i);
    }
    return years;
  };

  const yearsList = generateYears();

  const handleSelectYear = (year: Number) => {
    onSelectYear(year);
    onClose();
  };

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(12, "years"));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(12, "years"));
  };

  const YearPicker = () => {
    return (
      <div className="datepicker-dialog-body">
        <div className="datepicker-header">
          <button onClick={handlePrev}>{renderRightIcon || "‹"}</button>
          <span>
            از {currentDate.subtract(4, "years").format("YYYY")} تا{" "}
            {currentDate.add(7, "years").format("YYYY")}
          </span>
          <button onClick={handleNext}>{renderLeftIcon || "›"}</button>
        </div>

        <div className="datepicker-grid-year">
          {yearsList.map((year) => (
            <div
              className={monthClassName || "datepicker-year"}
              key={year}
              onClick={() => handleSelectYear(year)}
            >
              {year}
            </div>
          ))}
        </div>
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
          <YearPicker />
        </Dialog>
      )}

      {datePickerType === "popper" && (
        <Popper>
          <YearPicker />
        </Popper>
      )}
    </>
  );
}
