
import { API_COMMON, API_CUSTOMER, API_DYNAMIC_FORM, API_INVENTORY, API_SALES_QUOTATION, API_TASK, API_TASK_PROJECT } from "../configs/Paths";
import _ from "lodash";
import request from "../utils/request";
import moment from 'moment';
import dot from 'dot-object';
export const onSalle = async (body) => {
    try {

        let url = `${await API_SALES_QUOTATION()}`;

        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };


        const response = await request(url, newBody);

        return response
    } catch (err) {
        console.log('err', err)
    }
    return null
}


export async function convertTemplate({ content, data, code, viewConfig, crmSource }) {

    try {
        let newData = dot.object(data);
        newData = convertDot({ ob: data, newOb: data });
        const result = [];
        let extra = [];
        const extraField = extraFields.find(i => i.code === code);

        if (extraField) extra = extraField.data;
        function getName(codeName, refName) {
            const list = viewConfig.find(item => item.code === codeName);
            if (list) {
                list.listDisplay.type.fields.type.columns.forEach(item => {
                    const newItem = { ...item, name: `${refName}.${item.name}` };
                    result.push(newItem);
                });

                list.listDisplay.type.fields.type.others.forEach(item => {
                    const newItem = { ...item, name: `${refName}.${item.name}` };
                    result.push(newItem);
                });
            }
        }

        const viewFind = viewConfig.find(item => item.code === code).listDisplay.type.fields.type;
        const codes = [...viewFind.columns, ...viewFind.others];
        codes.forEach(item => {
            if (item.type.includes('ObjectId')) {
                const ref = item.type.substring(9);
                getName(ref, item.name);
            } else if (item.type.includes('Relation')) {
                const ref = item.type.split("'")[3];
                getName(ref, item.name);
            } else if (item.type.includes('Array')) {
                // eslint-disable-next-line no-useless-escape
                const replaceArr = `<tr>(?:(?!<tr>|<\/tr>).)*?{${item.name}}(?:(?!<tr>|<\/tr>).)*?<\/tr>`;
                const regexArr = new RegExp(replaceArr, 'gs');
                const found = content.match(regexArr);
                if (found) {
                    found.forEach(i => {
                        content = findReplaceArr({ arrName: item.name, content, arrItems: item.type, data: newData[item.name], dataReplace: i });
                    });
                }
            } else if (item.type.length === 24 || item.type.length === 33) {
                if (crmSource[item.type]) {
                    if (crmSource[item.type].data) {
                        const foundItem = crmSource[item.type].data.find(i => i.value === newData[item.name]);
                        if (foundItem) {
                            newData[item.name] = foundItem.title;
                        }
                    }
                } else {
                    // let newCrmSource = _.keyBy(JSON.parse(localStorage.getItem('crmSource')), 'code');
                    let newCrmSource = crmSource
                    if (newCrmSource[item.configCode] && newCrmSource[item.configCode].data) {
                        const foundItem = newCrmSource[item.configCode].data.find(i => i.value === newData[item.name]);
                        if (foundItem) {
                            newData[item.name] = foundItem.title;
                            newData['documentDate'] = moment(newData.receiveDate, 'YYYY/MM/DD').format('DD/MM/YYYY');
                            newData['toBookDate'] = moment(newData.toBookDate, 'YYYY/MM/DD').format('DD/MM/YYYY');
                        }
                    }
                    console.log(newData.toBookDate, item);
                }
            }
        });

        async function replaceExtra() {
            for (const item of extra) {
                const replace = `{${item.name}}`;
                const regex = new RegExp(replace, 'gs');
                const rep = await item.function(newData);
                content = content.replace(regex, rep);
            }
        }

        content = findCal({ content, data: newData });
        const newResult = result.concat(codes);
        newResult.forEach(item => {
            const replace = `{${item.name}}`;
            const regex = new RegExp(replace, 'gs');
            const rep = newData[item.name] ? newData[item.name] : '';
            content = content.replace(regex, rep);
        });
        await replaceExtra();

    } catch (err) {
        console.log('LOIROIeERRR', err)
    }
    return content;
}





function findReplaceArr({ content, arrItems, data, arrName, dataReplace }) {
    if (!data) return content;
    // eslint-disable-next-line no-useless-escape
    let newReplace = '';
    const listItems = arrItems.split('|');
    if (!listItems[1]) return content;
    const items = listItems[1].split(',');
    if (items) {
        data.forEach((ele, index) => {
            let replace = dataReplace;
            replace = findCal({ content: replace, data: ele });
            replace = replace.replace(`{${arrName}}`, index + 1);
            items.forEach(e => {
                const regex = `{${e}}`;
                replace = replace.replace(regex, ele[e]);
            });
            newReplace = `${newReplace}${replace}`;
        });
        return content.replace(dataReplace, newReplace);
    }
    return content;
}

function formula(fn) {
    // console.log(fn);
    // eslint-disable-next-line no-new-func
    return new Function(`return ${fn}`)();
}

export async function getInfo(data, field) {
    switch (field) {
        case 'name': {
            return data && data[field] && data[field].toUpperCase();
        }
        case 'gender': {
            return data && data[field] && data[field] === 1 ? 'Nữ' : 'Nam';
        }
        case 'nation':
        case 'religion': {
            return data && data[field] && data[field].title;
        }
        case 'dateProvide':
        case 'birthday': {
            return data && data[field] && moment(data[field]).format('DD/MM/YYYY');
        }
        default:
            return data && data[field];
    }
}

function findCal({ content, data }) {
    const rex = /CAL\[(?!\]).*?\]/g;
    const found = content.match(rex);

    if (!found) return content;
    found.forEach(item => {
        let newCt = item;
        Object.keys(data).forEach(pro => {
            const reg = `{${pro}}`;
            const reg1 = new RegExp(reg, 'g');
            newCt = newCt.replace(reg1, data[pro]);
        });
        newCt = newCt.substring(4, newCt.length - 1);
        try {
            newCt = formula(newCt);
        } catch (error) {
            // console.log(error);
            newCt = '';
        }

        content = content.replace(item, newCt);
    });
    return content;
}

export function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

export function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

export function tableToPDF(id, code, fileName = 'PDF', title) {
    const sTable = document.getElementById(id).innerHTML;

    const listName = EXPORT_FILE_NAME;
    let newStr = '';
    let titleText = '';
    if (listName[id]) fileName = listName[id];

    if (typeof code === 'number') {
        newStr = `THÁNG ${code}`;
        titleText = `${fileName} - ${newStr}`;
    } else {
        try {
            const allModules = JSON.parse(localStorage.getItem('allModules')) || null;
            if (allModules[code] && allModules[code].title) {
                fileName = allModules[code].title;
            }
        } catch (e) {
            console.log('e', e);
        }
        if (getCurrentUrl() === 'inComingDocument') {
            fileName = 'Công văn đến';
        }
        if (getCurrentUrl() === 'OrderPo') {
            fileName = 'Hóa đơn mua hàng';
        }
        if (getCurrentUrl() === 'outGoingDocument') {
            fileName = 'Công văn đi';
        }
        titleText = fileName;
    }

    const style = `<style>
      table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
      }

      td,
      th {
        word-wrap: break-word;
        max-width: 100px;
        min-width: 40px;
        border: 1px solid #dddddd;
        min-height: 100px;
        padding: 8px;
    }

   
  </style>`;

    // CREATE A WINDOW OBJECT.
    // var win = window.open('', '', 'height=700,width=700');
    // var win = window.open(`${pageNumber}`);
    const fileTitle = title ? title : `${titleText}`;
    const title1 = 'Danh sách khách hàng';
    let html = '<!DOCTYPE html><html><head>';
    html += `<title>${fileTitle}</title>`;
    html += style;
    html += '</head>';
    html += '<body>';
    html += `<h2 style="text-align: center">${fileTitle === 'Khách hàng' ? title1 : fileTitle}</h2>`;
    html += sTable;
    html += '</body></html>';

    const removeContext = 'tfoot';
    if (html.includes(removeContext)) {
        const start = html.indexOf(`<${removeContext}>`);
        const end = html.indexOf(`</${removeContext}>`);
        html = `${html.substr(0, start)}${html.substr(end + removeContext.length + 3)}`;
    }

    return html;
}

export function tableToExcel(id, n, code, fileName = 'download', title) {
    // console.log(id)
    const listName = EXPORT_FILE_NAME;
    if (listName[id]) fileName = listName[id];
    try {
        const allModules = JSON.parse(localStorage.getItem('allModules')) || null;
        if (allModules[code] && allModules[code].title) {
            fileName = allModules[code].title;
        }
    } catch (e) {
        console.log('e', e);
    }
    if (getCurrentUrl() === 'inComingDocument') {
        fileName = 'Công văn đến';
    }
    if (getCurrentUrl() === 'outGoingDocument') {
        fileName = 'Công văn đi';
    }
    if (title) {
        fileName = title;
    }
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<html 
    xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head>
    <!--[if gte mso 9]>
    <xml>
    <x:ExcelWorkbook>
    <x:ExcelWorksheets>
    <x:ExcelWorksheet>
    <x:Name>{worksheet}</x:Name>
    <x:WorksheetOptions>
    <x:DisplayGridlines/>
    </x:WorksheetOptions>
    </x:ExcelWorksheet>
    </x:ExcelWorksheets>
    </x:ExcelWorkbook></xml>
    <![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head><body>
        ${fileName.trim() && fileName !== 'download'
            ? `<table>
          <body>
            <tr rowspan='1'>
              <td></td>
              <td></td>
              <td colspan='5'><h3>${fileName}<h3></td>
            </tr>
          </body>
        </table><br/>`
            : ''
        }
        {table}
    </body></html>`;

    function base64(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    }

    function format(s, c) {
        return s.replace(/{(\w+)}/g, (m, p) => c[p]);
    }

    function getHtml(table) {
        if (!table.nodeType) table = document.getElementById(table);
        table = table.innerHTML;
        table = table.split('<tfoot>');
        // table[0] = table[0].replaceAll('<td>', '<td>="')
        // table[0] = table[0].replaceAll('</td>', '"</td>')
        table = table.join('<tfoot>');
        return table;
    }

    function print(table, name) {
        table = getHtml(table);
        const ctx = { worksheet: name || 'Worksheet', table };
        // window.location.href = uri + base64(format(template, ctx));
        const a = document.createElement('a');
        a.href = uri + base64(format(template, ctx));
        a.download = `${fileName}.xls`;
        a.click();
    }
    print(id, n);
}

export function convertDotOther(others) {
    if (!isObject(others)) return {};
    const newOthers = {};
    Object.keys(others).forEach(key => {
        newOthers[key] = isObject(others[key]) ? others[key].title : others[key];
    });
    return newOthers;
}

export function convertDot({ ob, newOb = {}, prefix = false, convertArr = false }) {
    // eslint-disable-next-line no-restricted-syntax
    for (const property in ob) {
        if (isObject(ob[property])) {
            const newPrefix = prefix ? `${prefix}.${property}` : property;
            convertDot({ ob: ob[property], newOb, prefix: newPrefix, convertArr });
        } else if (isArray(ob[property]) && convertArr) {
            const newPrefix = prefix ? `${prefix}.${property}` : property;
            newOb[newPrefix] = ob[property]
                .map(it => (it ? it.name : null))
                .filter(Boolean)
                .join(', ');
        } else if (prefix) newOb[`${prefix}.${property}`] = ob[property];
        else newOb[property] = ob[property];
    }
    // eslint-disable-next-line no-console
    return newOb;
}

export function serialize(obj, prefix) {
    const str = [];
    let p;
    // eslint-disable-next-line no-restricted-syntax
    for (p in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(p)) {
            const k = prefix ? `${prefix}[${p}]` : p;

            const v = obj[p] || obj[p] === 0 ? obj[p] : '';
            str.push(v !== null && typeof v === 'object' ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }
    }
    return str.join('&');
}

// TINH TOAN CHO DU AN
// eslint-disable-next-line consistent-return
export function convertTree(treeData, startDate, prefix = false, result = [], cv = false, joins = [], joinsData = []) {
    // console.log(treeData,'treeData')
    treeData.forEach((item, index) => {
        // console.log(item,'item')
        item.startDate = convertDate(startDate);
        // const date = new Date(start);
        item.order = index;
        item.endDate = addDate(startDate, item.duration, item.durationUnit);
        item.parent = prefix || null;
        item.id = prefix ? `${prefix}.${index}` : index;
        item.isSmallest = false;
        const str = item.id.split('.');
        if (str.length > 1) item.kanbanCode = `${str[0]}.${str[1]}`;
        const join = item.join.map(i => i.id);
        joins.push(...join);
        joinsData.push(...item.join);
        const newPre = item.id;
        result.push(item);
        if (item.children && item.children.length) {
            convertTree(item.children, startDate, newPre, result, false, joins, joinsData);
        } else item.isSmallest = true;
    });
    if (cv) {
        makeRootDependent(result);
        const rootDependent = result.filter(i => i.isRoot === true);
        rootDependent.forEach(i => {
            caculeDependent(i, result);
        });
        caculateStartDate(treeData, startDate);
        result.forEach(i => {
            if (i.isSmallest) calculateDate(i, result);
        });
        calculateRatio(prefix, result);

        return { array: result, joins, joinsData };
    }
}

function caculateStartDate(treeData, startDate) {
    treeData.forEach((item, index) => {
        const check = dateDiff(item.startDate, startDate);
        if (check > 0) {
            item.startDate = convertDate(startDate);
            item.endDate = addDate(startDate, item.duration);
        }
        if (item.children && item.children.length) {
            caculateStartDate(item.children, item.startDate);
        }
    });
}
// Tao root dependent
function makeRootDependent(result) {
    result.forEach(item => {
        if (!item.dependent && checkRoot(result, item.idTree)) item.isRoot = true;
    });
}

function caculeDependent(rootDependent, result) {
    const data = result.filter(item => item.dependent === rootDependent.idTree);
    if (data.length) {
        data.forEach(i => {
            i.startDate = rootDependent.endDate;
            i.endDate = addDate(rootDependent.endDate, i.duration);
            caculeDependent(i, result);
        });
    }
}

// Kiem tra phan tu cha
function checkRoot(result, dependent) {
    const length = result.length;
    let check = false;
    for (let index = 0; index < length; index++) {
        const element = result[index];
        if (element.dependent === dependent) {
            check = true;
            break;
        }
    }
    return check;
}

export function convertDate(date = new Date()) {
    return new Date(date);
}

function addDate(date, duration, unit) {
    const newDate = new Date(date);
    let d;
    if (unit === 'hour') {
        d = moment(newDate)
            .add(duration, 'hours')
            .toDate();
    } else {
        d = newDate.setDate(newDate.getDate() + duration * 1);
    }
    const result = new Date(d);
    return convertDate(result);
}

function calculateDate(item, list) {
    let startDate = new Date(item.startDate);
    let endDate = new Date(item.endDate);
    // eslint-disable-next-line eqeqeq
    const listChild = list.filter(i => i.parent == item.parent);

    listChild.forEach(e => {
        const durationUnit = e.durationUnit;
        const start = new Date(e.startDate);
        const end = new Date(e.endDate);
        e.duration = dateDiff(start, end, durationUnit);
        if (startDate - start > 0) startDate = start;
        if (end - endDate > 0) endDate = end;
    });
    const parent = list.find(i => i.id === item.parent);
    if (parent) {
        parent.startDate = convertDate(startDate);
        parent.endDate = convertDate(endDate);
        parent.duration = dateDiff(startDate, endDate);
        calculateDate(parent, list);
    }
}

function dateDiff(d1, d2, durationUnit) {
    const start = new Date(d1);
    const end = new Date(d2);
    if (durationUnit === 'day') {
        return (end - start) / 86400000;
    } else {
        return (end - start) / 3600000;
    }
}

function calculateRatio(id, list) {
    const listTask = list.filter(i => i.parent === id);
    let totalDay = 0;
    let totalRatio = 100;
    if (!listTask.length) {
        return;
    }
    listTask.forEach(i => {
        totalDay = i.duration * 1 + totalDay;
    });
    totalDay = totalDay || 1;
    // eslint-disable-next-line array-callback-return
    listTask.map((it, d) => {
        const task = list.find(i => it.id === i.id);
        if (d === listTask.length - 1) task.ratio = totalRatio.toFixed(2);
        else {
            task.ratio = (((it.duration * 1) / totalDay) * 100).toFixed(2);
            totalRatio -= task.ratio;
        }
        // eslint-disable-next-line no-mixed-operators
        calculateRatio(it.id, list);
    });
}

// END

export function convert2Money(number) {
    if (number) return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    // eslint-disable-next-line prettier/prettier
    return 0.0;
}

export function flatChild(data, list = [], level = 0, open = true, slug = '', expand = false) {
    data.forEach(i => {
        const sl = slug ? `${slug}/${i._id}` : i._id;
        if (i.child && i.child.length) {
            list.push({ name: i._id, title: i.name, access: false, _id: i._id, level, id: i._id, open, parent: i.parent, child: true, slug: sl, expand });
            flatChild(i.child, list, level + 1, false, sl);
        } else {
            list.push({ name: i._id, title: i.name, id: i._id, access: false, _id: i._id, level, open, parent: i.parent, slug: sl, expand });
        }
    });
    return list;
}

export function printTemplte(templateId, dataId, moduleCode, isClone = false, data) {
    if (data) {
        const templateData = fetchData(`${API_DYNAMIC_FORM}/${templateId}`);
        Promise.all([templateData, data]).then(result => {
            PrintElem({ content: result[0].content, data: result[1], code: moduleCode, isClone });
        });
    } else {
        const dataItem = fetchData(`${API_COMMON}/${moduleCode}/${dataId}`);
        const templateData = fetchData(`${API_DYNAMIC_FORM}/${templateId}`);
        Promise.all([templateData, dataItem]).then(result => {
            PrintElem({ content: result[0].content, data: result[1], code: moduleCode, isClone });
        });
    }
}
export function printTemplteExcel(templateId, dataId, moduleCode, isClone = false, data) {
    if (data) {
        const templateData = fetchData(`${API_DYNAMIC_FORM}/${templateId}`);
        Promise.all([templateData, data]).then(result => {
            PrintElemExcel({ content: result[0].content, data: result[1], code: moduleCode, isClone });
        });
    } else {
        const templateData = fetchData(`${API_DYNAMIC_FORM}/${templateId}`);
        const dataItem = fetchData(`${API_COMMON}/${moduleCode}/${dataId}`);
        Promise.all([templateData, dataItem]).then(result => {
            PrintElemExcel({ content: result[0].content, data: result[1], code: moduleCode, isClone });
        });
    }
}

export async function getDataBeforeSend({ templateId, dataId, moduleCode, isClone = false }) {
    const templateData = fetchData(`${API_DYNAMIC_FORM}/${templateId}`);
    const dataItem = fetchData(`${API_COMMON}/${moduleCode}/${dataId}`);
    const result = await Promise.all([templateData, dataItem]);
    return convertTemplate({ content: result[0].content, data: result[1], code: moduleCode });
}

async function apiCloneModule(data, moduleCode) {
    const listApi = [];
    const listName = [];

    const viewConfig = JSON.parse(localStorage.getItem('viewConfig')).find(i => i.code === moduleCode);
    if (viewConfig) {
        const list = viewConfig.listDisplay.type.fields.type.columns.filter(i => i.type.includes('Relation'));
        list.forEach(i => {
            if (data[i.name]) {
                const code = i.type.split("'")[3];
                const api = fetchData(`${API_COMMON}/${code}/${data[i.name]}`);
                listApi.push(api);
                listName.push(i.name);
            }
        });
    }
    if (listApi.length) {
        const dataList = await Promise.all(listApi);

        listName.forEach((item, index) => {
            data[item] = dataList[index];
        });
    }

    return data;
}

export async function PrintElem({ content, data, code, isClone }) {
    if (isClone) data = await apiCloneModule(data, code);
    const element = await convertTemplate({ content, data, code });

    const style = `<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  </style>`;
    const script =
        '<script>var img = document.getElementById("avatar"); img.addEventListener("load",function(){ window.focus(); window.print(); window.document.close(); window.close(); }); </script>';
    const mywindow = window.open('');
    mywindow.document.write(`${element}${style}${script}`);
    mywindow.document.write('');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    // mywindow.print();
    // mywindow.close();

    // return true;
}
export async function PrintElemExcel({ content, data, code, isClone }) {
    if (isClone) data = await apiCloneModule(data, code);
    const element = await convertTemplate({ content, data, code });

    let downloadLink = document.createElement('a');
    let block = document.createElement('div');
    block.id = code + 'ST01';
    block.style.cssText = 'display: none;';

    block.innerHTML = element;
    document.body.appendChild(downloadLink);
    document.body.appendChild(block);
    let tdStyles = document.querySelectorAll(`#table-excel tr td`);
    tdStyles.forEach(td => {
        td.style.cssText = 'border: 1px solid; text-align: center';
    });

    let tableSelect = document.getElementById(`${code}ST01`);
    let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // let file = XLSX.utils.table_to_book(tableSelect, {sheet: "hello"});
    // XLSX.write(file, { bookType: 'xlsx', bookSST: true, type: 'base64'  });
    // XLSX.writeFile(file, 'file.xlsx');

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: 'application/vnd.ms-excel',
        });
        navigator.msSaveOrOpenBlob(blob, 'hello');
    } else {
        // Create a link to the file
        downloadLink.href = 'data:application/vnd.ms-excel,' + tableHTML;

        // Setting the file name
        downloadLink.download = code;

        //triggering the function
        downloadLink.click();
    }
}

// eslint-disable-next-line consistent-return
export function sortTask(list, result = [], id, rt = false) {
    const current = list.find(i => i._id === id);
    if (current) result.push(current);
    const child = list.filter(i => i.parentId === id).sort((a, b) => a.order - b.order);
    if (child.length) {
        child.forEach(item => {
            sortTask(list, result, item._id);
        });
    }

    if (rt) return result;
}

export function convertDateFacebook(item) {
    const date = new Date();
    const end = new Date(item.createdAt);
    const diff = ((date - end) / 60000).toFixed();
    // eslint-disable-next-line eqeqeq
    return { ...item, time: convertDateFb(item.createdAt) };
}

// export function convertComment(comments) {
//   const newComments = comments.map(i => {});
// }

export function convertDateFb(d1) {
    const date = new Date();
    const end = new Date(d1);
    const diff = ((date - end) / 60000).toFixed();
    // eslint-disable-next-line eqeqeq
    if (diff == 0) {
        return 'Vừa xong';
    }
    if (diff < 60) return `${diff} phút trước`;
    if (diff < 1440) {
        const h = (diff / 60).toFixed();
        return `${h} giờ trước`;
    }
    const d = (diff / 3600).toFixed();
    return `${d} ngày trước`;
}
export function compareArr(array1, array2) {
    const newArr1 = [...array1];
    const newArr2 = [...array2];
    return newArr1.length === newArr2.length && newArr1.sort().every((value, index) => value === newArr2.sort()[index]);
}
export const taskStatus = ['Đang thực hiện', ' Hoàn thành', 'Đóng dừng', 'Không thực hiện'];
export const taskPrioty = ['Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'];
export const priotyColor = ['#ff0000', '#ffc107', '#03a9f4', '#009688', '#8bc34a'];
export const taskPriotyColor = [
    { name: 'Rất cao', color: '#ff0000' },
    { name: 'Cao', color: '#ffc107' },
    { name: 'Trung bình', color: '#03a9f4' },
    { name: 'Thấp', color: '#009688' },
    { name: 'Rất thấp', color: '#8bc34a' },
];

export function generateId() {
    return `_${Math.random()
        .toString(36)
        .substr(2, 9)}${Math.random()
            .toString(36)
            .substr(2, 9)}`;
}

export function findListDep(idTree, list, listDep) {
    if (listDep.includes(idTree)) return;
    listDep.push(idTree);
    const item = list.find(item => item.idTree === idTree);
    if (item && item.dependent) {
        findListDep(item.dependent, list, listDep);
    }
}

export function checkDuplicate(w) {
    return new Set(w).size !== w.length;
}

export function findChildren(data, filter = 'parentId') {
    data.forEach(item => {
        const child = data.filter(ele => ele[filter] === item._id);
        if (child.length) {
            item.data = child;
        }
    });
    return data.filter(i => i.type === 0);
}

export function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

export function convertOb(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        acc[key] = obj;
        return acc;
    }, {});
}

export function convertTableNested(rows, property) {
    const result = [];
    const newRows = groupBy(rows, property);
    Object.keys(newRows).forEach(item => {
        newRows[item].forEach((element, index) => {
            element.total = newRows[item].length;
            element.ord = index;

            result.push(element);
        });
    });
    return result;
}

export function getDatetimeLocal(time = new Date(), l = -8) {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(new Date(time) - tzoffset).toISOString().slice(0, l);
    return localISOTime;
}

export function toVietNamDate(date = new Date()) {
    return new Date(date).toLocaleDateString('vi', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
}

function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function fetchData(url, method = 'GET', body = null, token = 'token') {
    const head = {
        method,
        headers: {
            Authorization: `Bearer ${localStorage.getItem(token)}`,
            'Content-Type': 'application/json',
        },
    };
    if (body) head.body = JSON.stringify(body);
    return fetch(url, head)
        .then(checkStatus)
        .then(parseJSON);
}

export function removeWaterMark(container, selectorTag = 'g') {
    const list = getElementsByIdStartsWith(container, selectorTag, 'aria-labelledby', '-title');
    list.forEach(i => {
        i.style.display = 'none';
    });
}

function getTotal(cir, oza) {
    let total = 0;
    oza.forEach(i => {
        const idx = cir.detailRanges.findIndex(ele => ele.id === i._id);
        if (idx !== -1) {
            total += cir.detailRanges[idx].plan * 1;
        } else if (i.child && i.child.length) {
            total += getTotal(cir, i.child) * 1;
        }
    });

    return total;
}

function getElementsByIdStartsWith(container, selectorTag, attribute, prefix) {
    const items = [];
    const myPosts = document.getElementsByTagName(selectorTag);
    for (let i = 0; i < myPosts.length; i++) {
        if (myPosts[i].getAttribute(attribute)) {
            if (myPosts[i].getAttribute(attribute).lastIndexOf(prefix) !== -1) {
                items.push(myPosts[i]);
            }
        }
    }

    return items;
}

export function getListOpen(listDer, list = []) {
    listDer.forEach(i => {
        list.push(i);
        if (i.open && i.child && i.child.length) getListOpen(i.child, list);
        else if (i.open) list.push(i);
    });
    return list;
}

export function getPlan(i, item) {
    const reult = i.detailRanges.findIndex(ele => ele.id === item._id);
    if (reult !== -1) return i.detailRanges[reult].plan;
    if (item.child && item.child.length) return getTotal(i, item.child);
    return 0;
}

export function addUserToDepartment(departments, users) {
    if (!users) return departments;
    departments.forEach(item => {
        const userList = users.filter(i => i.organizationUnit && i.organizationUnit.organizationUnitId === item._id);
        if (item.child && item.child.length) addUserToDepartment(item.child, users);
        if (!Array.isArray(item.child)) item.child = [];
        item.child = item.child.concat(userList);
    });
    return departments;
}

export function addHrmToDepartment(departments, users) {
    if (!users) return departments;
    departments.forEach(item => {
        const userList = users.filter(i => i.organizationUnit && i.organizationUnit._id === item._id);
        if (item.child && item.child.length) addHrmToDepartment(item.child, users);
        if (!Array.isArray(item.child)) item.child = [];
        item.child = item.child.concat(userList);
    });
    return departments;
}

export function getKpiPlan(range, kpiId, kpiPlan) {
    const plan = kpiPlan.find(i => i.rangeId === range._id && i.kpi === kpiId);
    const vertical = getVerticalKpiPlan(range.child, kpiId, kpiPlan);
    if (!plan)
        return {
            yearPlan: 0,
            quarterPlan: getArr(4),
            monthPlan: getArr(12),
            horizontalYearPlan: 0,
            horizontalQuarterPlan: 0,
            horizontalMonthPlan: 0,
            ...vertical,
        };
    const quarterPlan = plan.quarter.length ? plan.quarter : [0, 0, 0, 0];
    const monthPlan = plan.month.length ? plan.month : getArr(12);
    const horizontalYearPlan = totalHorizontalArray(quarterPlan);
    const horizontalQuarterPlan = totalHorizontalArray(monthPlan);
    // const horizontalMonthPlan: 0,
    return { yearPlan: plan.plan, quarterPlan, horizontalYearPlan, horizontalQuarterPlan, monthPlan, ...vertical };
}

function getVerticalKpiPlan(range, kpiId, kpiPlan) {
    const total = {
        verticalYearPlan: 0,
        verticalMonthPlan: getArr(12),
        verticalQuarterPlan: getArr(4),
    };
    if (range && range.length)
        range.forEach(i => {
            const find = kpiPlan.find(it => it.rangeId === i._id && it.kpi === kpiId);
            if (find) {
                total.verticalYearPlan += find.plan;
                totalVertialArray(total.verticalQuarterPlan, find.quarter);
                totalVertialArray(total.verticalMonthPlan, find.month);
                // console.log(total);
            } else if (i.child && i.child.length) {
                total.verticalYearPlan += getVerticalKpiPlan(i.child, kpiId, kpiPlan).verticalYearPlan;
                totalVertialArray(total.verticalQuarterPlan, getVerticalKpiPlan(i.child, kpiId, kpiPlan).verticalQuarterPlan);
                totalVertialArray(total.verticalMonthPlan, getVerticalKpiPlan(i.child, kpiId, kpiPlan).verticalMonthPlan);
            }
        });

    return total;
}

function totalVertialArray(array1, array2) {
    array1.forEach((it, id) => {
        array1[id] += array2[id];
    });
}

function totalHorizontalArray(array) {
    let total = 0;
    array.forEach(item => {
        total += item;
    });
    return total;
}

function getArr(number, callback = () => 0) {
    return Array.from({ length: number }, callback);
}

export function totalArray(array, from = 0, to = array.length, property = null) {
    let total = 0;
    for (let index = from; index < to; index++) {
        const element = property ? array[index][property] : array[index];
        total += element * 1;
    }
    return total;
}

// export function tableToExcel(id, n) {
//   const uri = 'data:application/vnd.ms-excel;base64,';
//   const template =
//     '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';

//   function base64(s) {
//     return window.btoa(unescape(encodeURIComponent(s)));
//   }

//   function format(s, c) {
//     return s.replace(/{(\w+)}/g, (m, p) => c[p]);
//   }
//   function print(table, name) {
//     if (!table.nodeType) table = document.getElementById(table);
//     const ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
//     window.location.href = uri + base64(format(template, ctx));
//   }
//   print(id, n);
// }

export function convertRatio(list, id) {
    const listChild = list.filter(i => i.parentId === id).map(i => ({
        name: i.name,
        ratio: i.ratio,
        duration: i.duration,
        costEstimate: i.costEstimate,
        id: i._id,
        costRealityValue: i.costRealityValue,
    }));

    let totalDuration = 0;
    listChild.forEach(i => {
        totalDuration += i.duration * 1;
    });
    totalDuration = totalDuration || 1;
    let leftRatio = 100;

    listChild.forEach((item, index) => {
        const planRatio = ((item.duration * 100) / totalDuration).toFixed();
        // console.log(item, planRatio, totalDuration);

        if (index === listChild.length - 1) item.planRatio = leftRatio;
        else {
            leftRatio -= planRatio;
            item.planRatio = planRatio;
        }
    });
    return listChild;
}

function romanize(num) {
    if (Number.isNaN(Number(num))) return NaN;
    const digits = String(+num).split('');

    const key = [
        '',
        'C',
        'CC',
        'CCC',
        'CD',
        'D',
        'DC',
        'DCC',
        'DCCC',
        'CM',
        '',
        'X',
        'XX',
        'XXX',
        'XL',
        'L',
        'LX',
        'LXX',
        'LXXX',
        'XC',
        '',
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
    ];

    let roman = '';

    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

export function printGroupSaleClosure(lang) {
    return function printGroupSales(data) {
        const contentGroup = groupBy(data.products, 'productGroup');
        let content = '';
        Object.keys(contentGroup).forEach((i, e) => {
            const itemContent = `<tr >
        <td colspan="7"><p>${romanize(e + 1)}. ${i}</p>
        </td>
      </tr>`;
            content = `${content}${itemContent}`;
            contentGroup[i].forEach((ele, eled) => {
                // console.log('ele', ele);
                const eleContent = `<tr class="tr">
          <td>
            <p>${eled + 1}</p>
          </td>
          <td>
            <img src="${ele.logo}" width="150" height="150">
          </td>
          <td>
            <p>${ele.code}</p>
          </td>
          <td style="width: 300px">
            <p>${`
                <b>${ele.productGroup}</b>
                ${ele.description ? `<p>${ele.description}</p>` : ``}
                ${ele.size ? `<p>Kích thước: ${ele.size}</p>` : ``}
              `}</p>
          </td>
          <td>
            <p>${ele.amount || 0}</p>
          </td>
          <td>
            <p>${ele.pricePolicy ? ele.pricePolicy.costPrice || 0 : 0}</p>
          </td>
          <td>
            <p>${(parseFloat(ele.amount) || 0) * (ele.pricePolicy ? parseFloat(ele.pricePolicy.costPrice) || 0 : 0)}</p>
          </td>
        </tr>`;
                content = `${content}${eleContent}`;
            });
        });

        return `<table class="table">
      <tbody>
        <tr class="tr">
          <td>
            <p>${lang === 'en' ? 'NO' : 'STT'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'PICTURE' : 'ẢNH SP'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'CODE' : 'MÃ SP'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'DESCRIPTION' : 'MÔ TẢ'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'QTY' : 'SỐ LƯỢNG'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'UNIT PRICE' : 'ĐƠN GIÁ'}</p>
          </td>
          <td>
            <p>${lang === 'en' ? 'TOTAL' : 'TỔNG TIỀN'}</p>
          </td>
        </tr>
      ${content}
      </tbody>
    </table>`;
    };
}

export async function printSaleOffer(data) {
    // console.log('HATA', data);
    let content = '<table><tbody>';
    data.products.forEach((item, index) => {
        const nameContent = `<tr><td colspan="6"><p><strong>${item.name}</strong></p>
      </td>
      </tr>`;
        content = `${content}${nameContent}`;

        const heightContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
      normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;Khối lượng trên hóa đơn</span></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
      normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${data.relityProducts[index].amount}</span></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Nội dung</span></strong></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Dự kiến</span></strong></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Hợp đồng</span></strong></p>
    </td>
    <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
      text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Chênh lệch</span></strong></p>
    </td>
    </tr>`;
        content = `${content}${heightContent}`;

        const etimasteContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;Khối lượng dự kiến</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${item.amount}</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">Đơn giá vật liệu </span><span style="color: rgb(156, 39, 176); font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none; font-family: 'Times New Roman', Times,serif;">&nbsp;</span><span style="font-family: 'Times New Roman', Times,serif;">(1)</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${convert2Money(item.costPrice)}</span></p>

  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${convert2Money(
            data.relityProducts[index].costPrice,
        )}</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal">${convert2Money(data.relityProducts[index].costPrice - item.costPrice)}</p>
  </td>
  </tr>`;
        content = `${content}${etimasteContent}`;

        const reviseContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;Chênh lệch</span></p>
  </td>
  <td><p>${data.relityProducts[index].amount * 1 - item.amount * 1}</p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">Đơn giá vận chuyển&nbsp; </span><span style="color: rgb(156, 39, 176); font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 700; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none; font-family: 'Times New Roman', Times,serif;">&nbsp;</span><span style="font-family: 'Times New Roman', Times,serif;">(2)</span></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
    normal" class="MsoNormal"></p>
  </td>
  </tr>`;

        content = `${content}${reviseContent}`;

        const percent =
            data.relityProducts[index].amount * 1
                ? convert2Money(((data.relityProducts[index].amount * 1 - item.amount * 1) * 100) / data.relityProducts[index].amount)
                : 0;
        const endContent = `


<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif;">&nbsp;%</span></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">${percent}</span></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif;">Đơn giá (1+2):</span></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal">${convert2Money(item.costPrice)}</p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal">${convert2Money(data.relityProducts[index].costPrice)}</p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
  normal" class="MsoNormal">${convert2Money(data.relityProducts[index].costPrice - item.costPrice)}</p>
</td>
</tr>
`;

        content = `${content}${endContent}`;
    });

    return `${content}</tbody></table>`;
}

export async function addressPoint(data) {
    // console.log('dffdfd', data);
    return data.transports.map(i => i.adress).join();
}

export async function destinationPoint(data) {
    return data.transports.map(i => i.destination).join();
}

export async function getNameByApi(data) {
    console.log(data);
}
export async function getCustomer(data) {
    try {
        const sale1 = await fetchData(`${API_SALES_QUOTATION}/${data.saleQuotation.saleQuotationId._id}`);

        if (sale1) return sale1.customer.name;
        return null;
    } catch (error) {
        return '';
    }
}

export async function getAddress(data) {
    try {
        const customerAddress = await fetchData(`${API_CUSTOMER}/${data.task.taskId.customer}`);
        return customerAddress.address;
    } catch (error) {
        return '';
    }
}

export async function getPhone(data) {
    try {
        const phone = await fetchData(`${API_SALES_QUOTATION}/${data.saleQuotation.saleQuotationId._id}`);
        if (phone) return phone.customer.phoneNumber;
        return null;
    } catch (error) {
        return '';
    }
}

export async function getTax(data) {
    try {
        const tax = await fetchData(`${API_SALES_QUOTATION}/${data.saleQuotation.saleQuotationId._id}`);
        if (tax) return tax.customer.taxCode;
        return null;
    } catch (error) {
        return '';
    }
}

export async function getBank(data) {
    try {
        const bank = await fetchData(`${API_CUSTOMER}/${data.task.taskId.customer}`);
        return bank.bankAccountNumber;
    } catch (error) {
        return '';
    }
}
export function getParentId(item, parents, tasks) {
    if (!item.level) return parents.findIndex(element => element._id === item._id);
    const foundItem = tasks.find(element => element._id === item.parentId);
    return getParentId(foundItem, parents, tasks);
}
export function getOrderCode(item, tasks) {
    if (!item.level) return (tasks.find(element => element._id === item._id).order + 1).toString();
    const foundItem = tasks.find(element => element._id === item.parentId);
    return `${getOrderCode(foundItem, tasks)}.${(item.order + 1).toString()}`;
}
const ROOT_PARENT_LEVEL = 0;
export function assignOrderCode(tasks) {
    const parents = tasks
        .filter(item => item.level === ROOT_PARENT_LEVEL)
        .sort((a, b) => a.order - b.order)
        .map(item => ({ ...item, child: [] }));
    const children = tasks
        .filter(item => item.level !== ROOT_PARENT_LEVEL)
        .sort((a, b) => a.order - b.order)
        .sort((a, b) => a.level - b.level);

    for (const child of children) {
        try {
            const parentIdx = getParentId(child, parents, tasks);
            child.orderCode = getOrderCode(child, tasks);
            parents[parentIdx].child.push(child);
        } catch (e) {
            console.log('Error in assign task code:', e);
        }
    }
}
export async function getRepresent(data) {
    try {
        const Represent = await fetchData(`${API_CUSTOMER}/${data.task.taskId.customer}`);
        return Represent.detailInfo.represent.name;
    } catch (error) {
        return '';
    }
}

export async function getPosition(data) {
    try {
        const Position = await fetchData(`${API_CUSTOMER}/${data.task.taskId.customer}`);
        return Position.detailInfo.represent.position;
    } catch (error) {
        return '';
    }
}

export async function printGroupTask(data) {
    try {
        const filter = { filter: { projectId: data.projectId._id } };
        const query = serialize(filter);
        const projectData = await fetchData(`${API_TASK_PROJECT}/projects?${query}`);

        const project = await fetchData(`${API_TASK_PROJECT}/projects`);

        const arr = await project.data.filter(item => item.projectId._id === data.projectId._id);
        const contenttask = groupBy(projectData.data.filter(i => i.kanbanCode), 'kanbanCode');
        assignOrderCode(projectData.data);
        console.log(Object.values(contenttask));
        Object.values(contenttask).forEach(e =>
            e.sort((a, b) => {
                const x = a.orderCode
                    .substr(4)
                    .split('.')
                    .map(Number);
                const y = b.orderCode
                    .substr(4)
                    .split('.')
                    .map(Number);
                const maxLength = x.length > y.length ? x.length : y.length;
                for (let i = 0; i < maxLength; i++) {
                    if (x[i] > y[i]) return true ? 1 : -1;
                    if (x[i] < y[i]) return true ? -1 : 1;
                    // eslint-disable-next-line
                    if (!isNaN(x[i]) && isNaN(y[i])) return true ? 1 : -1;
                    // eslint-disable-next-line
                    if (isNaN(x[i]) && !isNaN(y[i])) return true ? -1 : 1;
                }
                return 0;
            }),
        );

        const listparent = projectData.data.find(i => i.isProject).kanban;
        // console.log('CONTDDx', listparent);
        const newList = listparent.map(i => ({ ...i, child: contenttask[i.code] }));
        console.log(newList);
        let content = '<table><tbody>';

        // console.log('tTTTTTTTTTTTT', newList);
        const heightContent = `<tr style="background:green"><td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">TT</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Giai đoạn</span></strong></p>
  </td>
  <td rowspan="2" colspan = "2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Nội dung thực hiện</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">BP phụ trách</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Kiểm tra,Tham gia</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Phối hợp</span></strong></p>
  </td>
  <th colspan = "3"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Thời gian thực hiện</span></strong></p>
  </th>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Mức độ đã triển khai</span></strong></p>
  </td>
  <td rowspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Tiến độ (%)</span></strong></p>
  </td>
  <td colspan = "2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Thông tin người liên hệ</span></strong></p>
  </td>
  <td rowspan = "2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Ghi chú</span></strong></p>
  </td>

  </tr>`;

        content = `${content}${heightContent}`;
        const dateContent = `<tr style="background:green"><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Bắt đầu</span></strong></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Ngày thực hiện</span></strong></p></td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Kết thúc</span></strong></p></td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Họ tên</span></strong></p></td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">CV/BP/ĐT</span></strong></p></p>
  </td>
  </tr>`;
        content = `${content}${dateContent}`;
        newList.forEach((item, index) => {
            const dataParent = `<tr><td ${isArray(item.child) ? `rowspan=${item.child.length + 1}` : ''}><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">${index +
                1}</span></strong></p>
  </td>
  <td ${isArray(item.child) ? `rowspan=${item.child.length + 1}` : ''}><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">${item.name
                }</span></strong></p>
  </td>

  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  </tr>`;
            content = `${content}${dataParent}`;
            if (isArray(item.child)) {
                item.child.forEach(it => {
                    const chidData = `<tr>
    <td>${it.orderCode.substr(4)}</td>
    <td>${it.name}</td>
    <td>${mapName(it.inCharge)}</td>
    <td>${mapName(it.join)}</td>
    <td>${mapName(it.support)}</td>
    <td>${it.startDate.slice(0, 10)}</td>
    <td></td>
    <td>${it.endDate.slice(0, 10)}</td>
    <td>${it.kanbanStatus == 1
                            ? 'Công việc mới'
                            : it.kanbanStatus == 2
                                ? 'Đang thực hiện'
                                : it.kanbanStatus == 3
                                    ? 'Không Hoàn thành'
                                    : it.kanbanStatus == 4
                                        ? ' Thất bại'
                                        : it.kanbanStatus == 5
                                            ? 'Tạm dừng'
                                            : 'Không thực hiện'
                        }
    </td>
    <td style = "text-align: center">${it.progress}</td>
      <td></td>
      <td></td>
      <td></td></tr>`;
                    content = `${content}${chidData}`;
                });
            }
        });
        return `${content}</tbody></table>`;
    } catch (error) {
        return '';
    }
}

export async function getIncharge(data) {
    try {
        const filter = { inCharge: { $in: data.inCharge } };
        const query = serialize({ filter });
        const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
        const list = projectData.data.map(i => i.inCharge.map(i => i.name));
        return list;
    } catch (error) {
        return '';
    }
}
function mapName(i) {
    if (isArray(i)) return i.map(iz => iz.name).join();
    return '';
}
export async function getJoin(data) {
    try {
        const filter = { join: { $in: data.join } };
        const query = serialize({ filter });
        const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
        const list = projectData.data.map(i => i.join.map(i => i.name));
        return list;
    } catch (error) {
        return '';
    }
}

export async function getViewable(data) {
    try {
        const filter = { viewable: { $in: data.viewable } };
        const query = serialize({ filter });
        const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
        const list = projectData.data.map(i => i.viewable.map(i => i.name));
        return list;
    } catch (error) {
        return '';
    }
}

export async function getApproved(data) {
    try {
        const app = data.approved.map(i => i.name);
        return app;
    } catch (error) {
        return '';
    }
}

export async function printUndertakingPerson(data) {
    try {
        const responsibility = data.responsibilityPerson.map(i => i.name);
        return responsibility;
    } catch (error) {
        return '';
    }
}

export async function printSupervisor(data) {
    try {
        const listSupervisoer = data.supervisor.map(i => i.name);
        return listSupervisoer;
    } catch (error) {
        return '';
    }
}

export async function printQuotation(data) {
    try {
        const productList = data.products.map(async i => {
            const item = await fetchData(`${API_INVENTORY}/${i.productId}`);
            return item;
        });

        const list = await Promise.all(productList);
        let content = '<table><tbody>';
        const heightContent = `<tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
        normal" class="MsoNormal"><span style="font-size:12.0pt; font-family: 'Times New Roman', Times,serif; font-size: medium;">&nbsp;Product</span></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;line-height:
        normal" class="MsoNormal"><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Specification</span></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif; font-size: medium;">Price CIF</span></strong></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Port of destination</span></strong></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Packing</span></strong></p>
      </td>
      <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
        text-align:center;line-height:normal" class="MsoNormal"><strong><span style="font-family: 'Times New Roman', Times,serif;">Container capacity</span></strong></p>
      </td>
      </tr>`;
        content = `${content}${heightContent}`;

        list.forEach(i => {
            const contentItem = `<tr><td>${i.name}</td><td><p>Moisture:${i.others.Moisture}</p><p>Admixture: ${i.others.Moisture}</p><p>Length: ${i.others.Length
                }</p><p> ${i.others.Fungus}</p><p> ${i.others.Color}</p></td><td>${i.pricePolicy.costPrice}</td><td>${i.others.Portofdestination}</td><td>${i.others.Packing
                }</td><td>${i.others.ContainerCapacity}</td><tr>`;
            content = `${content}${contentItem}`;
        });

        return `${content}</tbody></table>`;
    } catch (error) {
        return '';
    }
}

export async function printContract(data) {
    try {
        const sales = await fetchData(`${API_SALES_QUOTATION}/${data.saleQuotation.saleQuotationId._id}`);
        let headContent = `<table><tbody><tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; font-size: medium; font-family: 'Times New Roman', Times,serif;">No.</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Commodity</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Quantity<br>(MTs)</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Price<br>(USD/MT)</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Total Amount<br>(USD)</span></b></p>
  </td>
  </tr>`;
        let total = 0;
        sales.products.forEach((item, idx) => {
            const content = ` <tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
   text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">${idx + 1}</p>
 </td>
 <td><p>${item.name}</p>
 </td>
 <td><p>${item.amount}</p>
 </td>
 <td><p>${item.costPrice}</p>
 </td>
 <td><p>${item.costPrice * item.amount}</p>
 </td>
 </tr>`;
            headContent = `${headContent}${content}`;
            total += item.costPrice * item.amount;
        });
        const last = ` <tr><td colspan="2"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">TOTAL</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"></p>
  </td>
  <td><p></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
    ${total}
    </p>
  </td>
  </tr>
  </tbody></table>`;
        headContent = `${headContent}${last}`;
        return headContent;
    } catch (error) {
        return '';
    }
}
export async function printCustomerInfo(data) {
    try {
        const customerAddress = await fetchData(`${API_CUSTOMER}/${data.task.taskId.customer}`);
        return customerAddress.name;
    } catch (error) {
        return '';
    }
}
function convertDescription(description) {
    description = description.toString().replace(/\|/g, '<br>');
    return description;
}
function convertCurrency(number) {
    number = number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
    return number;
}
function convertToEuro(number) {
    number = '€' + number.toLocaleString('da-DK', { style: 'currency', currency: 'EUR' }).slice(0, -1);
    return number;
}
function convertToVND(number) {
    number = number.toLocaleString('da-DK', { style: 'currency', currency: 'VND' });
    return number;
}
export async function printPall(data) {
    try {
        const productList = data.products.map(async i => {
            const item = await fetchData(`${API_INVENTORY}/${i.productId}`);
            item.rate = data.rate;
            return { ...item, ...i };
        });
        const list = await Promise.all(productList);
        console.log('dđ', list);

        let headContent = `<table><tbody><tr style="background-color: #A0A09F;-webkit-print-color-adjust: exact;">
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">NO</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
  &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">PICTURE</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; font-size: medium; font-family: 'Times New Roman', Times,serif;">CODE</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">DESCRIPTION</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">QTY</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">UNIT PRICE</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">TOTAL</span></b></p>
</td>
  </tr>`;
        let total = 0;
        list.forEach((i, idx) => {
            const contentItem = `<tr>
      <td><p style="text-align:center">${idx + 1}</p></td>
      <td><img src="${i.logo}" alt="sanpham" style=" height: 200px;"></td>
      <td><p style="text-align:center">${i.tags}</p></td>
      <td><p style="max-width:500px">Tên sản phẩm: <b>${i.name}</b> <br> Nhãn Hiệu: <b>${i.tags}</b> <br> Kích thước: <b>${i.size
                }</b> <br> Mô tả thêm: <br> ${convertDescription(i.description)}</p></td>
      <td><p style="text-align:center">${i.amount}</p></td>
      <td><p style="text-align:center">${convertToEuro(i.costPrice)}</p></td>
      <td><p style="text-align:center">${convertToEuro(i.costPrice * i.amount)}</p> </td>
      <tr>`;
            headContent = `${headContent}${contentItem}`;
            total += i.costPrice * i.amount;
        });
        const last = ` <tr><td colspan="5" style="background-color: #BFBFBE;-webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    -height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm EURO đã bao gồm thuế VAT</span></b></p>
  </td>
  <td colspan="2" style="background-color: #BFBFBE; -webkit-print-color-adjust: exact; "><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
   ${convertToEuro(total)}
  </p>
  </td>
  </tr>`;
        headContent = `${headContent}${last}`;
        const heightContent = ` <tr><td colspan="5" style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
 line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
  &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm VNĐ đã bao gồm thuế VAT</span></b></p>
</td>
<td colspan="2" style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
${convertToVND(total * data.rate)}
</p>
</td>
</tr>
  </tbody></table>`;

        headContent = `${headContent}${heightContent}`;
        return headContent;
    } catch (error) {
        return '';
    }
}
// € ${convertCurrencyEuro(total)}
export async function printName(data) {
    try {
        const filter = { name: { $in: data.name } };
        const query = serialize({ filter });
        const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
        // console.log('aaaa', projectData);
        const list = projectData.data.map(i => i.name);
        return list;
    } catch (error) {
        return '';
    }
}
export async function printCode(data) {
    try {
        const filter = { code: { $in: data.code } };
        const query = serialize({ filter });
        const projectData = await fetchData(`${API_TASK_PROJECT}?${query}`);
        const list = projectData.data.map(i => i.code);
        // console.log('gggg', list);
        return list;
    } catch (error) {
        return '';
    }
}
export async function printRate(data) {
    try {
        return convertCurrency(data.rate);
    } catch (error) {
        return '';
    }
}

export async function printProduct(data) {
    console.log(data);
    try {
        const product = await fetchData(`${API_INVENTORY}/${data._id}`);
        console.log(product);
        let headContent = `<table><tbody><tr><td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; font-size: medium; font-family: 'Times New Roman', Times,serif;">Nhãn hiệu</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">TT</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Hình ảnh minh họa</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
    text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Sản phẩm</span></b></p>
  </td>
  <td><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
  &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Mã SP</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Mô tả chung</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Kích thước (cm)</span></b></p>
</td>

<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">SL</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Giá sản phẩm (EUR)</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Thành tiền (EUR)</span></b></p>
</td>


<td style = "border-style: none">&nbsp&nbsp</td>


<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Giá bán lẻ VN <br> có VAT</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">HS</span></b></p>
</td>
<td><p style="margin-bottom:0in;margin-bottom:.0001pt;
text-align:center;line-height:12.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
&quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Point</span></b></p>
</td>
  </tr>`;

        const contentItem = `<tr>
    <td> ${product.supplier.name}</td>
    <td style="text-align:center">1</td>
    <td style="text-align: center;"> <img src=${product.logo}  style="max-width: 200px;"></td>
    <td>${product.name}</td>
    <td>Mã sp</td>
    <td>${product.description}</td>
    <td>${product.size}</td>
    <td>SL</td>
    <td> €    </td>
    <td> €    </td>
    <td style = "border-style: none"></td>
    <td style="text-align:center">0</td>
    <td></td>
    <td></td>
    <tr>`;
        headContent = `${headContent}${contentItem}`;
        const last = ` <tr><td colspan="9" style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt; 
    -height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
    &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm EUR(không bao gồm VAT)</span></b></p>
  </td>
  <td style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
  text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
  ${convertCurrency(1000)}
  </p>
  </td>
  </tr>`;
        headContent = `${headContent}${last}`;
        const heightContent = ` <tr><td colspan="9" style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt; 
    line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
     &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm VNĐ(không bao gồm VAT)</span></b></p>
   </td>
   <td style="background-color: #BFBFBE; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
   text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
   ${convertCurrency(20000000)} VND
   </p>
   </td>
   </tr>
   <tr><td colspan="9" style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
    line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal"><b><span style="mso-fareast-font-family:
     &quot;Times New Roman&quot;; mso-bidi-font-family:Calibri; mso-bidi-theme-font:minor-latin; color:black; mso-font-width:105%; font-size: medium; font-family: 'Times New Roman', Times,serif;">Tổng giá sản phẩm VNĐ(bao gồm VAT)</span></b></p>
   </td>
   <td style="background-color: #808080; -webkit-print-color-adjust: exact;"><p style="margin-bottom:0in;margin-bottom:.0001pt;
   text-align:center;line-height:18.0pt;mso-line-height-rule:exactly" class="MsoNormal">
   ${convertCurrency(22000000)} VND
   </p>
   </td>
   </tr>
     </tbody></table>`;

        headContent = `${headContent}${heightContent}`;
        // product.forEach((i, idx) => {});
        return headContent;
    } catch (error) {
        return '';
    }
}
export async function printTable() {
    const table = `
  <table id="table-excel" style="border: 1px solid; max-width: 100%;  border-spacing: 0;">
  <thead>
      <!-- row1 -->
      <tr>
          <td rowspan="3">STT</td>
          <td rowspan="3">Họ tên</td>
          <td rowspan="3">Mã số BHXH</td>
          <td colspan="2">Ngày tháng năm sinh</td>
          <td rowspan="3">
              Cấp bậc, chức vụ, chức danh, nghề, nơi làm việc
          </td>
          <td rowspan="3">
              Số CMND/CCCD, Hộ chiếu
          </td>
          <td colspan="6" >Tiền lương</td>
          <td rowspan="2" colspan="2">Ngành nghề nặng nhọc độc hại</td>
          <td colspan="5" rowspan="1" >Loại và hiệu lực hợp đông lao động</td>
          <td rowspan="3">Thời điểm đơn vị bắt đầu đóng BHXH</td>
          <td rowspan="3">Thời điểm đơn vị kết thúc đóng BHXH</td>
          <td rowspan="3">Ghi chú</td>
      </tr>
      <!-- row2 -->
      <tr>
          <td rowspan="2"> Nam</td>
          <td rowspan="2">Nữ</td>
          <td rowspan="2"> Hệ số mức lương</td>
          <td colspan="5" >Phụ cấp</td>
          <td rowspan="2">Ngày bắt đầu HĐLĐ không xác định thời hạn</td>
          <td colspan="2">Hiệu lực HĐLĐ xác định thời hạn</td>
          <td colspan="2">Hiệu lực HĐLĐ khác (dưới 1 tháng, thử việc)</td>
      </tr>
      <tr>
          <td>Chức vụ</td>
          <td>Thâm niên VK(%)</td>
          <td>Thâm niên nghề(%)</td>
          <td>Phụ cấp lương</td>
          <td>Các khoản bổ sung</td>
          <td>Ngày bắt đầu</td>
          <td>Ngày kết thúc</td>
          <td>Ngày bắt đầu</td>
          <td>Ngày kết thúc</td>
          <td>Ngày bắt đầu</td>
          <td>Ngày kết thúc</td>
      </tr>
  </thead>
  <tbody>
      <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
      </tr>

  </tbody>
</table>
<p>Số lao động trên 35 tuổi:</p>
<div style="display: flex; justify-content: space-between;">
  <div style="flex-basis: 70%;">
  </div>
  <div style="flex-basis: 30%; text-align: center; ">
      <h4>
          ĐẠI DIỆN DOANH NGHIỆP, CƠ QUAN, TỔ CHỨC
      </h4>
      <i>(Chữ ký, dấu)</i>
  </div>
</div>
  `;
    return table;
}

export function printContentTable(data) {
    let finalHTML = '';

    let html = `
    <table id="table" border="1" cellpadding="0" cellspacing="0">
    <thead>
    <tr>
        <td rowspan="3">STT</td>
        <td rowspan="3">Họ và tên</td>
        <td rowspan="3">Mã số BHXH</td>
        <td rowspan="3">Ngày tháng năm sinh</td>
        <td rowspan="3">Giới tính</td>
        <td rowspan="3">Số CCCD/CMND/Hộ chiếu(*)</td>
        <td rowspan="3">Cấp bậc, chức vụ, <br>
          chức danh nghề,<br>
          nơi làm việc</td>
        <td colspan="4">Vị trí việc làm</td>
        <td colspan="6">Tiền lương</td>
        <td colspan="2" rowspan="2">Ngành/nghề nặng nhọc, độc hại</td>
        <td colspan="5">Loại và hiệu lực hợp đồng lao động</td>
        <td rowspan="3">Thời điểm đơn vị bắt đầu đóng BHXH (tháng/năm)</td>
        <td rowspan="3">Thời điểm đơn vị kết thúc đóng BHXH (tháng/năm)</td>
        <td rowspan="3">Ghi chú</td>
      </tr>
      <tr>
        <td rowspan="2">Nhà quản lý</td>
        <td rowspan="2">Chuyên môn kĩ thuật bậc cao</td>
        <td rowspan="2">Chuyên môn kĩ thuật bậc trung</td>
        <td rowspan="2">Khác</td>
        <td rowspan="2">Hệ số/Mức lương</td>
        <td colspan="5">Phụ cấp</td>
        <td rowspan="2">Ngày bắt đầu HĐLĐ Không xác định thời hạn</td>
        <td colspan="2">Hiệu lực HĐLĐ Xác định thời hạn</td>
        <td colspan="2">Hiệu lực HĐLĐ Khác (Dưới 1 tháng, thử việc)</td>
      </tr>
      <tr>
        <td>Chức vụ</td>
        <td>Thâm niên VK (%)</td>
        <td>Thâm niên nghề (%)</td>
        <td>Phụ cấp lương</td>
        <td>Các khoản bổ sung</td>
        <td>Ngày bắt đầu</td>
        <td>Ngày  kết thúc</td>
        <td>Ngày bắt đầu</td>
        <td>Ngày kết thúc</td>
        <td>Ngày bắt đầu</td>
        <td>Ngày kết thúc</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>7</td>
        <td>8</td>
        <td>9</td>
        <td>10</td>
        <td>11</td>
        <td>12</td>
        <td>13</td>
        <td>14</td>
        <td>15</td>
        <td>16</td>
        <td>17</td>
        <td>18</td>
        <td>19</td>
        <td>20</td>
        <td>21</td>
        <td>22</td>
        <td>23</td>
        <td>24</td>
        <td>25</td>
        <td>26</td>
        <td>27</td>
      </tr>
    </thead>
    <tbody>
    <tr>
        <td>I</td>
        <td colspan="26" style="text-align: left">Tăng</td>
      </tr>
      <tr>
        <td>I.1</td>
        <td colspan="26" style="text-align: left">Lao động</td>
      </tr>
    ${data && data.type === 1
            ? data.data.map(
                (item, index) =>
                    `<tr>
          <td>${index + 1}</td>
          <td>${item.hrmEmployeeId}</td>
          <td>${item.insuranceNumber}</td>
          <td>${moment(item.birthday).format('DD/MM/YYYY')}</td>
          <td>${item.gender}</td>
          <td>${item.identityCardNumber}</td>
          <td>${item.position}</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td></td>
          <td />
          <td />
          <td />
          <td />
          <td></td>
          <td></td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td></td>
          <td>${item.note}</td>
        </tr>`,
            )
            : ''
        }
  <tr>
      <td>II</td>
      <td colspan="26" style="text-align: left">Giảm</td>
    </tr>
    <tr>
      <td>II.1</td>
      <td colspan="26" style="text-align: left">Lao động</td>
    </tr>
  ${data && data.type === 0
            ? data.data.map(
                (item, index) =>
                    `<tr>
        <td>${index + 1}</td>
        <td>${item.hrmEmployeeId}</td>
        <td>${item.insuranceNumber}</td>
        <td>${moment(item.birthday).format('DD/MM/YYYY')}</td>
        <td>${item.gender}</td>
        <td>${item.identityCardNumber}</td>
        <td>${item.position}</td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td />
        <td></td>
        <td />
        <td />
        <td />
        <td />
        <td></td>
        <td></td>
        <td />
        <td />
        <td />
        <td />
        <td />
        <td></td>
        <td>${item.note}</td>
      </tr>`,
            )
            : ''
        }
    </tbody>
  </table>
  `;
    finalHTML += html;
    return finalHTML;
}

export async function formatTemplateSendEmailSalary(content, data, moduleCode, attribute) {
    const date = new Date();
    const table = `
    <table>
      <tbody>
        <tr class="tr_padding">
          <td colspan="6"></td>
        </tr>
        <tr>
          <td>STT</td>
          <td>Các Khoản Thu Nhập</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          
        </tr>
        ${attribute.map(
        (item, index) =>
            `
            <tr>
              <td>${index + 1}</td>
              <td>${item.name}</td>
              <td>{${item.code}}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            `,
    )}
        <tr>
          <td colspan="2">Tổng cộng</td>
          <td>{total}</td>
          <td colspan="2"></td>
          <td></td>
          
          
        </tr>
        <tr class="tr_padding">
          <td colspan="6"></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td>Tổng Số Tiền Lương Thực Nhận</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td></td>
          <td>Bằng chữ:</td>
          <td colspan="4"></td>
        </tr>
      
      
      </tfoot>
    </table>
  `;
    let newContent = content.replace('{sendEmailSalary}', table);
    console.log(newContent);
    // convertTemplate({ content: newContent, data, code: moduleCode }).then(element => {
    //   newContent = formatTemplateSendEmail(element).then(
    //     result => result
    //   )
    // });

    // async function formatTemplateSendEmail(element) {
    //   const styles = `
    //     table:nth-child(2), tr, td,td{
    //       border: 1px solid black;
    //     }

    //     table{
    //       border-collapse: collapse;
    //       width: 100%
    //     }
    //     .tr_padding td{
    //       padding: 8px;
    //     }
    //   `;

    //   const newEl = `
    //     <html>
    //       <head>
    //         <style>${styles}</style>
    //       </head>
    //       <body>
    //         ${element}
    //       </body>
    //     </html>
    //   `
    //   return newEl;
    // }

    return newContent;
}




export function tableToExcelCustom(id, n, code, fileName = 'download', title) {

    if (title) {
        fileName = title;
    }
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = `<html 
    xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head>
    <!--[if gte mso 9]>
    <xml>
    <x:ExcelWorkbook>
    <x:ExcelWorksheets>
    <x:ExcelWorksheet>
    <x:Name>{worksheet}</x:Name>
    <x:WorksheetOptions>
    <x:DisplayGridlines/>
    </x:WorksheetOptions>
    </x:ExcelWorksheet>
    </x:ExcelWorksheets>
    </x:ExcelWorkbook></xml>
    <![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head><body>
        {table}
    </body></html>`;

    function base64(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    }

    function format(s, c) {
        return s.replace(/{(\w+)}/g, (m, p) => c[p]);
    }

    function getHtml(table) {
        if (!table.nodeType) table = document.getElementById(table);
        table = table.innerHTML;
        table = table.split('<tfoot>');
        // table[0] = table[0].replaceAll('<td>', '<td>="')
        // table[0] = table[0].replaceAll('</td>', '"</td>')
        table = table.join('<tfoot>');
        return table;
    }

    function print(table, name) {
        table = getHtml(table);
        const ctx = { worksheet: name || 'Worksheet', table };
        // window.location.href = uri + base64(format(template, ctx));
        const a = document.createElement('a');
        a.href = uri + base64(format(template, ctx));
        a.download = `${fileName}.xls`;
        a.click();
    }
    print(id, n);
}



export const extraFields = [
    {
        code: 'SalesQuotation',
        data: [
            { name: 'PRODUCT_GROUP', type: 'extra', title: 'BẢNG NHÓM SẢN PHẨM', function: printGroupSaleClosure() },
            { name: 'PRODUCT_GROUP_EN', type: 'extra', title: 'BẢNG NHÓM SẢN PHẨM', function: printGroupSaleClosure('en') },
            { name: 'SALES_VINCAS', type: 'extra', title: 'Bao gia Vincas', function: printQuotation },
            { name: 'SALES_PALL', type: 'extra', title: 'Bao gia PALL', function: printPall },
            { name: 'RATE', type: 'extra', title: 'Tỷ giá ngoại tệ', function: printRate },
        ],
    },
    {
        code: 'CostEstimate',
        data: [
            { name: 'SALE_OFFER', type: 'extra', title: 'MẪU ĐỀ XUẤT BÁN HÀNG', function: printSaleOffer },
            { name: 'DELIVERY_POINT', type: 'extra', title: 'ĐIỂM GIAO HÀNG', function: addressPoint },
            { name: 'DENTINATION_POINT', type: 'extra', title: 'ĐIỂM NHẬN HÀNG', function: destinationPoint },
        ],
    },
    {
        code: 'Stock',
        data: [{ name: 'Product_Pall', type: 'extra', title: 'BIỂU MẪU SẢN PHẨM PALL', function: printProduct }],
    },
    {
        code: 'Contract',
        data: [
            { name: 'CUSTOMER_NAME', type: 'extra', title: 'TÊN KHÁCH HÀNG', function: getCustomer },
            { name: 'ADDRESS', type: 'extra', title: 'ĐỊA CHỈ', function: getAddress },
            { name: 'PHONENUMBER', type: 'extra', title: 'SỐ ĐIỆN THOẠI', function: getPhone },
            { name: 'TAXCODE', type: 'extra', title: 'MÃ SỐ THUẾ', function: getTax },
            { name: 'BANKACCCOUNTNUMBER', type: 'extra', title: 'TÀI KHOẢN', function: getBank },
            { name: 'REPRESENTNAME', type: 'extra', title: 'ĐẠI DIỆN', function: getRepresent },
            { name: 'POSITION', type: 'extra', title: 'CHỨC VỤ', function: getPosition },
            // { name: 'DOB', type: 'extra', title: 'Ngày sinh', function: getDob },
            // { name: 'CARDNUMBER', type: 'extra', title: 'CMTND', function: getCard },
            // { name: 'GENDER', type: 'extra', title: 'GIỚI TÍNH', function: getGender },
        ],
    },
    {
        code: 'hrm',
        data: [
            { name: 'name', type: 'extra', title: 'Họ và tên', function: getInfo },
            { name: 'gender', type: 'extra', title: 'Giới tính', function: getInfo },
            { name: 'phoneNumber', type: 'extra', title: 'Số điện thoại', function: getInfo },
            { name: 'birthday', type: 'extra', title: 'Ngày sinh', function: getInfo },
            { name: 'avatar', type: 'extra', title: 'Ảnh đại diện', function: getInfo },
            { name: 'nation', type: 'extra', title: 'Dân tộc', function: getInfo },
            { name: 'address', type: 'extra', title: 'Địa chỉ', function: getInfo },
            { name: 'religion', type: 'extra', title: 'Tôn giáo', function: getInfo },
            { name: 'locationProvide', type: 'extra', title: 'Nơi cấp', function: getInfo },
            { name: 'dateProvide', type: 'extra', title: 'Ngày cấp', function: getInfo },
            { name: 'identityCardNumber', type: 'extra', title: 'Ngày cấp', function: getInfo },
        ]
    },

    {
        code: 'Task',
        data: [
            { name: 'TASK_GROUP', type: 'extra', title: 'BẢNG NHÓM DỰ ÁN', function: printGroupTask },
            { name: 'INCHARGE', type: 'extra', title: 'NGƯỜI PHỤ TRÁCH', function: getIncharge },
            { name: 'JOIN', type: 'extra', title: 'NGƯỜI THAM GIA', function: getJoin },
            { name: 'VIEWABLE', type: 'extra', title: 'NGƯỜI ĐƯỢC XEM', function: getViewable },
            { name: 'APPROVED', type: 'extra', title: 'NGƯỜI PHÊ DUYỆT', function: getApproved },
        ],
    },
    {
        code: 'ExchangingAgreement',
        data: [
            { name: 'UNDERTAKING_PERSON', type: 'extra', title: 'NGƯỜI CHỐT CHỦ TRƯƠNG', function: printUndertakingPerson },
            { name: 'SUPERVISOR', type: 'extra', title: 'THEO DÕI DỰ ÁN', function: printSupervisor },
        ],
    },
    {
        code: 'BusinessOpportunities',
        data: [{ name: 'CUSTOMER_INFO', type: 'extra', title: 'THÔNG TIN KH', function: printCustomerInfo }],
    },
    {
        code: 'Customer',
        data: [
            { name: 'NAME', type: 'extra', title: 'TÊN DỰ ÁN', function: printName },
            { name: 'CODE', type: 'extra', title: 'Mã DỰ ÁN', function: printCode },
        ],
    },
    {
        code: 'InsuranceInformation',
        data: [
            { name: 'NAME', type: 'extra', title: 'Tên doanh nghiệp', function: getNameByApi },
            { name: 'ADDRESS', type: 'extra', title: 'Địa chỉ', function: getAddress },
            { name: 'PHONENUMBER', type: 'extra', title: 'Số điện thoại', function: getPhone },
            { name: 'CODE', type: 'extra', title: 'Mã số thuế', function: getCustomer },
            { name: 'TABLE', type: 'extra', title: 'Tình hình sử dụng lao động', function: printTable },
            { name: 'contentTable', type: 'extra', title: '', function: printContentTable }
        ],
    },
];
function getCurrentUrl() {
    const res = window.location.pathname.split('/');
    return res[res.length - 1];
}
export const EXPORT_FILE_NAME = {
    excelTableBySign: "BÁO CÁO THỐNG KÊ THEO THÂM NIÊN ",
    excelTableOrg: "BÁO CÁO THỐNG KÊ NHÂN SỰ THEO PHÒNG BAN",
    excelTableWageOrg: "BÁO CÁO LƯƠNG",
    reportsHrmAboutExpireCotract: "BÁO CÁO THỐNG KÊ NHÂN SỰ SẮP HẾT HẠN HỢP ĐỒNG",
    hrm: 'HỒ SƠ NHÂN SỰ',
    Stock: 'KHO',
    excelTableBosReport1: "CHI TIẾT BẢNG LƯƠNG",
    Documentary: 'CÔNG VĂN',
    Delivery: 'GIAO NHẬN',
    RevenueExpenditure: 'TÀI CHÍNH NỘI BỘ',
    DocumentaryST14: 'TÀI CHÍNH NỘI BỘ',
    OrderPoundefined: "MUA Hàng",
    CustomerST18: 'KHÁCH HÀNG',
    excelTableBosReport: 'BÁO CÁO THỐNG KÊ CƠ HỘI KINH DOANH',
    reportMeetingCustomer: 'BÁO CÁO TIẾP XÚC KHÁCH HÀNG',
    reportStatsHrm: 'BÁO CÁO THỐNG KÊ NHÂN SỰ',
    reportDoingTask: 'BÁO CÁO THỜI GIAN THỰC HIỆN CÔNG VIỆC',
    reportsTaskStatus: 'BÁO CÁO TRẠNG THÁI CÔNG VIỆC',
    reportTaskWeek: 'BÁO CÁO CÔNG TÁC TUẦN',
    reportTaskSummary: 'BÁO CÁO TỔNG HỢP CÔNG VIỆC',
    reportContractValueAndPaid: 'BÁO CÁO TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG VÀ THANH TOÁN',
};