import moment from "moment";
import { CONSTANTS } from "../Constants";

const DateService = (schedulerStartDate, date, holidays, variables) => {
    const schedulerStart = schedulerStartDate;
    const currentDate = date;
    const standardHolidays = holidays;
    const variableHolidays = variables;
    const completeHolidayList = [];

    const getSchedulerStart = () => {
        return schedulerStart;
    };

    const getCurrentDay = () => {
        return currentDate;
    };

    const getFutureDay = (daysFromCurrent) => {
        return moment(schedulerStart).add('days', daysFromCurrent);
    };

    const getDiffDays = (d1, d2) => {
        let diff_ms = d2.diff(d1);

        return Math.floor(moment.duration(diff_ms).asDays());
    };

    const getNumberOfHolidays = (futureDate) => {
        const plusOneDate = futureDate;
        let holidayCount = 0;

        completeHolidayList.forEach(date => {
            if (date.isBetween(schedulerStart, plusOneDate)) {
                if (!(date.day() === 6 || date.day() === 0)) {
                    holidayCount++;
                }
            }
        });

        return holidayCount;
    };

    const prepHolidays = () => {
        const futureDate = moment(currentDate).add('days', CONSTANTS.DAYS_TO_DISPLAY + 1);
        let checkYear = schedulerStartDate.year();

        variableHolidays.forEach(date => {
            const holiday = moment(date, "MM-DD-YYYY");

            if (holiday.isBetween(schedulerStart, futureDate)) {
                completeHolidayList.push(holiday);
            }
        });

        while(checkYear <= futureDate.year()) {
            standardHolidays.forEach(date => {
                const holiday = moment(date + "-" + checkYear, "MM-DD-YYYY");

                if (holiday.isBetween(schedulerStart, futureDate)) {
                    completeHolidayList.push(holiday);
                }
            });

            checkYear++;
        }
    };

    const getCompleteHolidayList = () => {
        return completeHolidayList;
    };

    prepHolidays();

    return {
        getSchedulerStart,
        getCurrentDay,
        getFutureDay,
        getDiffDays,
        getCompleteHolidayList,
        getNumberOfHolidays
    };
};

export default DateService;