
import _ from 'lodash'
import moment from 'moment'

const convertLabel = (string) => { return string.charAt().toUpperCase() + string.slice(1).toLowerCase() }
const validateEmail = (text) => { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text) }
const checkRequire = (key, config, updateList = null) => config && config.checkedShowForm && config.checkedRequireForm && (!updateList || key in updateList)

const checkedRequireForm = (configs, data, updateList = null) => {
    if (!configs) return {}

    let firstMessage
    const errorList = {}
    let isValid

    Object.keys(configs).map(key => {
        const config = configs[key]
        if (checkRequire(key, config, updateList)) {
            let valid = true
            const value = _.get(data, key)
            if (!value) valid = false
            else if (Array.isArray(value) && !value.length) valid = false
            if (!valid) {
                const msg = `${convertLabel(config.title)} không được để trống `
                firstMessage = firstMessage || msg
                errorList[key] = true
            }
        }
    })

    isValid = !Object.keys(errorList).length ? true : false
    return { isValid, errorList, firstMessage }
}

const validateForm = (configs, data, updateList = null) => {
    const result = checkedRequireForm(configs, data, updateList)
    let { isValid, errorList, firstMessage } = result

    Object.keys(errorList).map(key => {
        switch (key) {
            case 'email':
                if (!validateEmail(_.get(data, key))) {
                    if (!firstMessage) firstMessage = `${convertLabel(configs[key].title)} không đúng định dạng`
                    errorList[key] = true
                }
                break;
        }
    })

    {
        const key = 'name'
        if (checkRequire(key, configs[key], updateList)) {
            if (_.get(data, key, '').length < 5) {
                firstMessage = `${convertLabel(configs[key].title)} phải có tối thiểu 5 kí tự`
                errorList[key] = true
            }
        }
    }

    const startDate = _.get(data, 'startDate')
    const endDate = _.get(data, 'endDate')
    if (startDate && endDate && !moment(startDate).isBefore(endDate)) {
        if (!firstMessage) firstMessage = `${convertLabel(configs['endDate'].title)} phải lớn hơn ${convertLabel(configs['startDate'].title)}`
        errorList.startDate = true
        errorList.endDate = true
    }

    const timeStart = _.get(data, 'startDate')
    const timeEnd = _.get(data, 'endDate')
    if (timeStart && timeEnd && !moment(timeStart).isBefore(timeEnd)) {
        if (!firstMessage) firstMessage = `${convertLabel(configs['timeEnd'].title)} phải lớn hơn ${convertLabel(configs['timeStart'].title)}`
        errorList.timeStart = true
        errorList.timeEnd = true
    }

    isValid = !Object.keys(errorList).length ? true : false
    return { isValid, errorList, firstMessage }
}

export {
    validateEmail,
    validateForm,
}