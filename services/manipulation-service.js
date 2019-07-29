import moment from "moment";

export const ManipulationService = {
    capitalize: work => {
        return work.charAt(0).toUpperCase() + work.slice(1);
    },

    combineArrays: (array1, array2) => {
        let newArray = [];

        array1.concat(array2).forEach(item => {
            if (newArray.indexOf(item) === -1) {
                newArray.push(item);
            }
        });

        return newArray;
    },

    getDiffDays: (d1, d2) => {
        let diff_ms = d2.diff(d1);

        return Math.floor(moment.duration(diff_ms).asDays());
    },

    getDateToday: () => {
        return moment(moment().format("MM-DD-YYYY"), "MM-DD-YYYY");
    }
};