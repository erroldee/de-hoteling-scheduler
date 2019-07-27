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
    }
};