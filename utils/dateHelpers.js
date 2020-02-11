export const formatDate = date => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
};

export const formatDateTime = date => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    const hour = ('0' + (date.getHours())).slice(-2);
    const minute = ('0' + (date.getMinutes())).slice(-2);
    const second = ('0' + (date.getSeconds())).slice(-2);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export const formatDateWord = date => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return ('0' + date.getDate()).slice(-2) + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
};

export const getFormattedDateBefore = daysBefore => {
    const dates = [];
    for (let i = 0; i < daysBefore; i++) {
        let currentDate = new Date();
        currentDate = new Date(currentDate.setTime(currentDate.getTime() - (i * 24 * 60 * 60 * 1000)))
        dates.push(formatDateWord(currentDate));
    }

    return dates;
};