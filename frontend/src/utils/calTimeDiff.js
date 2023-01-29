import isodate from 'isodate'

const calTimeDiff = isoCreatedTime => {
    const now = new Date()
    const createdTime = isodate(isoCreatedTime).getTime()
    const betweenMinutes = parseInt((now - createdTime) / 1000 / 60) - 60 * 9
    if (betweenMinutes < 1) return '방금전';
    if (betweenMinutes < 60) {
        return `${betweenMinutes}분전`;
    }

    const betweenHour = Math.floor(betweenMinutes / 60);
    if (betweenHour < 24) {
        return `${betweenHour}시간전`;
    }

    const betweenDay = Math.floor(betweenHour / 24);
    if (createdTime > Date(now.setMonth(now.getMonth() - 1))) {
        return `${betweenDay}일전`;
    }

    for (const i = 2; i < 12; i++) {
        if (createdTime < Date(now.setMonth(now.getMonth() - i))) {
            return `${i-1}달전`;
        }
    }

    for (const i = 2; true; i++) {
        if (createdTime < Date(now.setYear(now.getYear() - i))) {
            return `${i-1}년전`;
        }
    }
}

export default calTimeDiff