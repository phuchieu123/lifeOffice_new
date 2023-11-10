export default arrToReport = () => {
    const ids = organizationUnitId
        ? [organizationUnitId]
        : departments.filter(e => !e.parent).map(e => e._id)

    const all = {}, female = {}, male = {}

    res.forEach(e => {
        if (ids.includes(e._id)) {
            const { resultFemale, resultMale, result } = e
            Object.keys(resultFemale).forEach(key => female[key] = (female[key] || 0) + resultFemale[key])
            Object.keys(resultMale).forEach(key => male[key] = (male[key] || 0) + resultMale[key])
            Object.keys(result).forEach(key => all[key] = (all[key] || 0) + result[key])
        }
    })

    const dataTotal = []

    const allCol = count(all).map((value) => ({ value }))
    const maleCol = count(male).map((value) => ({ value }))
    const femaleCol = count(female).map((value) => ({ value }))

    const xData = ['<20', '20-30', '30-40', '40-50', '>50', 'Khác'].map((value) => ({ value }));
    const yData = [0, _.max(Object.keys(all).map(key => all[key]))];
    const barData = [
        {
            data: allCol,
            svg: {
                fill: 'green',
            },
        },
        {
            data: maleCol,
            svg: {
                fill: 'red',
            },
        },
        {
            data: femaleCol,
            svg: {
                fill: 'yellow',
            },
        },
    ];
    const legendData = [
        {
            title: 'Tổng cộng',
            color: 'green',
        },
        {
            title: 'Nam',
            color: 'red',
        },
        {
            title: 'Nữ',
            color: 'yellow',
        },
    ];

    const recCostReportData = { xData, yData, barData, legendData }

    setData(recCostReportData)
}