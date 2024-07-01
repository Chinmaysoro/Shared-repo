export function getUser() {
    let stored_user = JSON.parse(localStorage.getItem('creuto-user'));
    if (stored_user != undefined) {
        return stored_user;
    } else {
        return '';
    }
}

export function encodedID(empid) {
    if (empid) {
        const encoded = window.btoa(empid);
        return encoded;
    }
}

export function decodedID(empid) {
    if (empid) {
        const decoded = window.atob(empid);
        return decoded;
    }
}

export function getRandomColor() {
    const colors = ['##FFF1BF', '#FFDCBC', '#CFEEFF', '#FFBFDA', '#F5DBFF', '#C7F0D3'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

export function getMonth(index) {
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
    if (index) {
        return months[index].label;
    } else {
        return 'NA';
    }
}
