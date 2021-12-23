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

export const formatDateTimeID = date => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  const hour = ('0' + (date.getHours())).slice(-2);
  const minute = ('0' + (date.getMinutes())).slice(-2);
  const second = ('0' + (date.getSeconds())).slice(-2);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

export const formatDateTimeID2 = date => {
  const date2 = new Date(date);

  let year = date2.getFullYear();
  let month = date2.getMonth()+1;
  let dt = date2.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  const hour = ('0' + (date2.getHours())).slice(-2);
  const minute = ('0' + (date2.getMinutes())).slice(-2);
  const second = ('0' + (date2.getSeconds())).slice(-2);

  return `${year}-${month}-${dt}T${hour}:${minute}:${second}`;

};


export const formatDateWordID = date => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
		return days[date.getDay()] + ', ' + ('0' + date.getDate()).slice(-2) + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' - ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
};

export const formatDateWord = date => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return ('0' + date.getDate()).slice(-2) + ' ' + months[date.getMonth()] + ' ' + Math.abs(date.getFullYear());
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

export const formatMonthEngToID = date => {
    switch(date) {
        case 'January':
            return date.replace('January', 'Januari')
        case 'February':
            return date.replace('February', 'Februari')
        case 'March':
            return date.replace('March', 'Maret')
        case 'April':
            return date.replace('April', 'April')
        case 'May':
            return date.replace('May', 'Mei')
        case 'June':
            return date.replace('June', 'Juni')
        case 'July':
            return date.replace('July', 'Juli')
        case 'August':
            return date.replace('August', 'Agustus')
        case 'September':
            return date.replace('September', 'September')
        case 'October':
            return date.replace('October', 'Oktober')
        case 'November':
            return date.replace('November', 'November')
        case 'December':
            return date.replace('December', 'Desember')
        default:
            return date.replace('January', 'Januari')
    }
}
