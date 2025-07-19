import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import Dialog from "../components/Dialog";
import Popper from "../components/Popper";

type PropsType = {
  showDatePicker: boolean;
  dialogClassName?: string;
  monthClassName?: string;
  datePickerType?: "dialog" | "popper";
  onSelectMonth: (value: { title: string; value: Number }) => void;
  onClose: () => void;
};

dayjs.extend(jalaliday);

export default function MonthPickerMode({
  showDatePicker,
  dialogClassName,
  monthClassName,
  datePickerType,
  onSelectMonth,
  onClose,
}: PropsType) {
  const handleSelectMonth = (month: { title: string; value: Number }) => {
    onSelectMonth(month);
    onClose();
  };

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

  const MonthPicker = () => {
    return (
      <div className="datepicker-dialog-body">
        <div className="datepicker-grid-month">
          {monthNames.map((month) => (
            <div
              className={monthClassName || "datepicker-month"}
              key={month.value}
              onClick={() => handleSelectMonth(month)}
            >
              {month.title}
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
          <MonthPicker />
        </Dialog>
      )}

      {datePickerType === "popper" && (
        <Popper>
          <MonthPicker />
        </Popper>
      )}
    </>
  );
}
