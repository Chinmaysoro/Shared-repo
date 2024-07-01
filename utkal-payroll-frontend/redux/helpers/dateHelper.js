// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import * as moment from 'moment';
export function date_diff_indays(due_date) {
    var today = new Date();
    var due_date = new Date(due_date);
    return Math.floor((Date.UTC(due_date.getFullYear(), due_date.getMonth(), due_date.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24));
}
export function formatted_date(date) {
    var dateDiff = date_diff_indays(new Date(date));
    var customdate = '';
    if (dateDiff === 0) {
        customdate = 'Today';
    } else if (dateDiff === 1) {
        customdate = 'Tomorrow';
    } else if (dateDiff === -1) {
        customdate = 'Yesterday';
    } else if (dateDiff > 7 || dateDiff < -7) {
        customdate = new Intl.DateTimeFormat('en-GB', {
            month: 'short',
            day: '2-digit'
        }).format(new Date(date));
    } else {
        customdate = dateDiff + 'd';
    }
    return customdate;
}
export function formatted_date_inYear(date) {
    var dateDiff = date_diff_indays(new Date(date));
    var customdate = '';
    if (dateDiff === 0) {
        customdate = 'Today';
    } else if (dateDiff === 1) {
        customdate = 'Tomorrow';
    } else if (dateDiff === -1) {
        customdate = 'Yesterday';
    } else if (dateDiff > 7 || dateDiff < -7) {
        customdate = new Intl.DateTimeFormat('en-GB', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    } else {
        customdate = dateDiff + 'd';
    }
    return customdate;
}
export function validateEndDate(startDate, endDate) {
    var start = new Date(startDate);
    var end = new Date(endDate);
    var valid = true;
    if (startDate && endDate && start > end) {
        // toast.error("End date must be greater than or equal to start date.");
        valid = false;
    }
    return valid;
}
export function clickOnDatePicker(event) {
    let isDatePicker = false;
    isDatePicker =
        event.target.classList.contains('react-datepicker__navigation') ||
        event.target.classList.contains('react-datepicker__today-button') ||
        event.target.classList.contains('react-datepicker__current-month') ||
        event.target.classList.contains('react-datepicker__week') ||
        event.target.classList.contains('react-datepicker') ||
        event.target.classList.contains('react-datepicker__header') ||
        event.target.classList.contains('react-datepicker__month-container') ||
        event.target.classList.contains('react-datepicker__day-names') ||
        event.target.classList.contains('react-datepicker__day-name');
    return isDatePicker;
}
export function customHr(value) {
    const dotIndex = value.lastIndexOf('.');
    if (dotIndex > -1) {
        return value.slice(0, dotIndex);
    } else {
        return value;
    }
}
export function convertHMS(value) {
    var hours = Math.floor(value / 60);
    var minutes = value % 60;
    return hours + ':' + minutes;
}
export function customHrs(value) {
    value = value.toString();
    const dotIndex = value.lastIndexOf('.');
    if (dotIndex > -1) {
        var h = value.split('.')[0];
        if (h < 10) {
            h = '0' + h;
        }
        value = h + ':' + value.split('.')[1];
        return value;
    } else {
        return value;
    }
}

export function hrs_diff(st_hr, end_hr, br_hr) {
    var t_spent = moment.utc(moment(end_hr, 'HH:mm').diff(moment(st_hr, 'HH:mm')));
    var bh = br_hr.split(':');
    var minutes = +bh[0] * 60 + +bh[1];
    var p = t_spent.subtract(minutes, 'minutes');
    return p.format('HH:mm');
}

export function secondsToMinute(secs) {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
        .map((v) => (v < 10 ? '0' + v : v))
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
}
export function dateToSeconds(start, end) {
    var startDate = new Date();
    // Do your operations
    var endDate = new Date();
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    return seconds;
}
export function currentMonthStartDate() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
}
export function convertUTCToLocal(val) {
    var date = moment.utc(val).format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc).local().format('HH:mm:ss');
    return local;
}
export function convertTimeToUTC(val) {
    const today = new Date();
    return new Date(today.toDateString() + ' ' + val);
}
export function convertUTCToLocalTime(val) {
    var date = moment.utc(val).format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc).local().format('hh:mm A');
    return local;
}
export function convertUTCTo24HourTime(val) {
    var date = moment.utc(val).format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc).local().format('HH:mm');
    return local;
}

export function getYearList() {
    const minOffset = 0;
    const maxOffset = 30;
    const thisYear = new Date().getFullYear();
    const options = [];
    for (let i = minOffset; i <= maxOffset; i++) {
        const year = thisYear - i;
        options.push(year);
    }
    return options;
}

export function getMonthList() {
    const months = [
        { label: 'January', value: 'jan' },
        { label: 'February', value: 'feb' },
        { label: 'March', value: 'mar' },
        { label: 'April', value: 'apr' },
        { label: 'May', value: 'may' },
        { label: 'June', value: 'june' },
        { label: 'July', value: 'july' },
        { label: 'August', value: 'aug' },
        { label: 'September', value: 'sept' },
        { label: 'October', value: 'oct' },
        { label: 'November', value: 'nov' },
        { label: 'December', value: 'dec' }
    ];
    return months;
}

export function daysInMonth(month, year) {
    const arr = new Date(year, month, 0).getDate();
    const newarr = [];
    for (let i = 0; i < arr; i++) {
        newarr.push(i);
    }
    return newarr;
}

export function fetchMonthList() {
    const months = [
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' }
    ];
    return months;
}

export function getCurrentMonth() {
    const date = new Date();
    return date.getMonth() + 1;
}

export function getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
}
