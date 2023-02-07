import isodate from 'isodate'

const calTimeDiff = isoCreatedTime => {
    const createdTime = isodate(isoCreatedTime).getTime()
    const betweenMinutes = parseInt((new Date() - createdTime) / 1000 / 60) - 60 * 9
    if (betweenMinutes < 1) return '방금전';
    if (betweenMinutes < 60) {
        return `${betweenMinutes}분전`;
    }

    const betweenHour = Math.floor(betweenMinutes / 60);
    if (betweenHour < 24) {
        return `${betweenHour}시간전`;
    }

    const betweenDay = Math.floor(betweenHour / 24);

    const date = new Date()
    const backMonth = date => {
        if (date.getMonth() !== 1) {
            return date.setMonth(date.getMonth() - 1)
        }
        else {
            return date.setFullYear(date.getYear() - 1, date.getMonth() + 11)
        }
    }

    if (createdTime > backMonth(date)) {
        return `${betweenDay}일전`;
    }

    for (const i = 1; i < 12; i++) {
        if (createdTime > backMonth(date)) {
            return `${i}달전`;
        }
    }

    for (const i = 1; true; i++) {
        if (createdTime > Date(date.setYear(date.getFullYear() - 1))) {
            return `${i}년전`;
        }
    }
}

export default calTimeDiff