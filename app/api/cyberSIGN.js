import { v4 as uuid } from 'uuid'
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";
import base64 from 'react-native-base64'

// POST /api/office/sign/hashdata HTTP/1.1
// Host: api.hsm.cyberlotus.com:8080
// CyberLotus123:515919404b16472485ec496a32d58178:3JiCBWv84CCj6dtg28TY2Kpmb1fwTfsiGuC4jiFuEho=:1558523152
// {\"base64digest\":\"SGFja2VyUmFuaw==\",\"hashalg\":\"SHA-1\"}
// Authorization: HmacSHA256 
// {hmac_algorithm} {api_id}:{nonce}:{signature digest}:{timestamp}

// const host = 'https://api.cyberhsm.vn'
// const host = 'api.hsm.cyberlotus.com:8080'
// const api_id = 'CyberLotus123'                          //Được cấp bởi nhà cung cấp/ Issued by vendor
// const secretKey = 'Q3liZXJMb3R1c0AxMjM='

const host = 'https://demoapi.cyberhsm.vn:80'
const api_id = '5acbe670e699459c8be670e699e59cb6'
const secretKey = 'Y2IzZjAwMGE4N2I5NjVlZWM0Mzc2ZGM2NjQwNDI1YzRhZWU0ZWJlZDJiZTc5NDFlOWEzNmJkNDBiZDc4ODg3YQ=='

const API_ACCOUNT_INFO = 'api/account/info'
const API_ACCOUNT_ENDCERT = 'api/account/endcert'
const API_ACCOUNT_SUBCERT = 'api/account/subcert'
const API_ACCOUNT_ROOTCERT = 'api/account/rootcert'
const API_ACCOUNT_CERTCHAIN = 'api/account/certchain'
const API_GET_SAMPLE_ACCOUNT = 'api/account/info-extend'
const API_SIGN_PDF = 'api/pdf/sign/originaldata'
const API_SIGN_PDF_HASH = 'api/pdf/sign/hashdata'
const API_SIGN_PDF_MULTIPLE = 'api/pdf/sign/listhashv2'
const API_SIGN_PDF_BERSIGN = 'api/pdf/sign/pdfforcybersign'
const API_SIGN_OFFICE = 'api/office/sign/originaldata'
const API_SIGN_OFFICE_HASH = 'api/office/sign/hashdata'
const API_SIGN_XML = 'api/xml/sign/defaultdata'
const API_SIGN_PURE_SIGNATURE = 'api/bin/sign/base64'
const API_SIGN_NONE_WITH_RSA = 'api/bin/sign/base64nonewithrsa'
const API_CERTIFICATE_VERIFY = 'api/certificate/verify'
const API_SIGNED_PDF_VERIFY = 'api/pdf/verify'
const API_SIGNED_OFFICE_VERIFY = 'api/office/verify'
const API_SIGNED_XML_VERIFY = 'api/xml/verify'
const API_OTP_REQUEST = 'api/otp/requestsign'


const sha1 = CONSTANTS.HashAlgorithms.sha1

const hashalg = sha1

const testCyber = async (base64) => {
    const result = await getAccountInfo()
}

const signature = async (sign) => {
    // const signature = Base64ENCODE(HMAC-SHA256(Base64DECODE(secretKey), signature)));
    const decode = base64.decode(secretKey)
    const hash = await JSHmac(sign, decode, CONSTANTS.HmacAlgorithms.HmacSHA256)
    const encode = base64.encode(hash)
    return encode
}

const authorization = (sign) => {
    const nonce = uuid().replace(/-/g, '')      //Chuỗi ngẫu nhiên độ dài tối đa 128 bit
    return `HmacSHA256 ${api_id}:${nonce}:${sign}:${new Date().getTime()}`
}

const createSignatureRaw = ({ method, link, body, date }) => {
    let result = [method, host, link, 'application/json; charset=utf-8', api_id, date]
    if (body) result.push(body)
    result = `${result.join('\n')}\n`
    return result
}

const signOfficeHash = async (base64) => {
    const api = API_SIGN_OFFICE_HASH
    const body = JSON.stringify({
        base64digest: await JSHash(base64, hashalg),
        hashalg,
    })
    const method = 'POST'

    let sign = createSignatureRaw({ method, api, body })
    sign = await signature(sign)

    const url = `${host}/${api} `
    const options = {
        method,
        headers: {
            'Authorization': authorization(sign),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result

}

const getAccountInfo = async () => {
    try {
        const api = API_ACCOUNT_INFO
        const method = 'GET'
        const date = new Date().toGMTString()
        let sign = createSignatureRaw({ method, api, date })
        sign = await signature(sign)

        const url = `${host}/${api} `
        const options = {
            method,
            headers: {
                'Authorization': authorization(sign),
                'Content-Type': 'application/json',
            },
        };

        const json = await fetch(url, options)
        let result = json.json()
        result = JSON.parse(result)
        return result
    } catch (error) { }
}

const getDigitalCerInfo = async () => {
    const url = `${host}/${API_ACCOUNT_ENDCERT} `
    const options = {
        method: 'GET',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const getSubDigitalCerInfo = async () => {
    const url = `${host}/${API_ACCOUNT_SUBCERT} `
    const options = {
        method: 'GET',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const getRootDigitalCerInfo = async () => {
    const url = `${host}/${API_ACCOUNT_ROOTCERT} `
    const options = {
        method: 'GET',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    // string
    return result
}

const getChainDigitalCerInfo = async () => {
    const url = `${host}/${API_ACCOUNT_CERTCHAIN} `
    const options = {
        method: 'GET',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    // string
    return result
}

const verifyDigitalCer = async (base64Cert) => {
    const url = `${host}/${API_CERTIFICATE_VERIFY} `
    const options = {
        method: 'GET',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ base64Cert })
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const signPDF = async (data) => {
    // const data = {
    //     “base64pdf”: “String”,
    //     “hashalg”: “String”,
    //     “typesignature”: “int”,
    //     “signaturename”: “String”,
    //     “base64image”: “String”,
    //     “textout”: “String”,
    //     “pagesign”: “int”,
    //     “xpoint”:“int”,
    //     “ypoint”: “int”,
    //     “width”: “int”,
    //     “height”: “int”
    // }

    // base64pdf Base64 của file PDF cần ký / Base64 of the PDF file needs to be signed

    // hashalg Thuật toán hàm băm: SHA1,SHA256,SHA512

    // typesignature
    // 0 - Không hiển thị chữ ký/ 0 - Does not show signature
    // 1 - Hiển thịdưới dạng text/ 1 - Display as text
    // 2 - Hiển thị dưới dạng hình ảnh/ 2 - Display as an image
    // 3 - Hiển thị cả hình ảnh và text/ 3 - Display both images and text

    // signaturename Tên của vị trí ký (trường hợp có vị trí)/ Name of the signed position (where there is a place)

    // base64image Base64 của hình ảnh (trong trường hợp muốn hiển thị hình ảnh)/ Base64 of the image (in case you want to display an image)

    // textout Chuỗi text sẽ hiển thị lên(trongtrường hợp muốn hiển thị text)/ Text string will be displayed(in case you want to display text)

    // pagesign Trang hiển thị chữ ký, trong trường hợp chọn có hiển thị/ The page displays the signature, in which case it is displayed

    const url = `${host}/${API_SIGN_PDF} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ data })
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    // string
    return result
}

const signPDFhash = async (data) => {
    // const data = {
    //      “base64hash”: “String”,
    //      “hashalg”: “String”
    // }

    // base64hash  Base64 của dữ liệu băm file PDF cần ký/ Base64 of the PDF file hash needs to be signed

    const url = `${host}/${API_SIGN_PDF_HASH} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ data })
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    // string
    return result
}

const signMutiPDF = async (data) => {
    // const data = {
    //     “base64hash”: [“String”,”String”,..], 
    //     “hashalg”: “String” 
    // }

    // base64hash Base64 của file cần ký/ Base64 of the xml file to sign 

    const url = `${host}/${API_SIGN_PDF_MULTIPLE} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ data })
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const signOffice = async (data) => {
    // const data = {
    //     “base64office”: “String”, 
    //     “hashalg”: “String” 
    // }

    // base64office Base64 của file PDF cần ký/ Base64 of the PDF file needs to be signed 

    const url = `${host}/${API_SIGN_OFFICE} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ data })
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const signXML = async (data) => {
    // const data = {
    //     “base64xml”: “String”, 
    //     “hashalg”: “String” 
    // }

    // base64xml Base64 của file xml cần ký/ Base64 of the xml file to sign 

    const url = `${host}/${API_SIGN_XML} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ data })
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}


const verifySignedPDF = async (str) => {
    // str Dữ liệu file / Data file 
    const url = `${host}/${API_SIGNED_PDF_VERIFY} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(str)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const verifySignedOffice = async (str) => {
    // str Dữ liệu file / Data file 
    const url = `${host}/${API_SIGNED_OFFICE_VERIFY} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(str)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const verifySignedXML = async (str) => {
    // str Dữ liệu file / Data file 
    const url = `${host}/${API_SIGNED_XML_VERIFY} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(str)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const requestOTP = async (str) => {
    // -Các tài khoản đã kích hoạt xác thực ký bằng SMS OTP thì sẽ cần làm những bước sau/ Accounts that have enabled SMS OTP signing authentication will need to do the following steps: B1: Dùng apikey và Pass để tạo ra Authorization hmac/ Use apikey and Pass to create Authorization hmac. 
    // B2: Gọi tới https://api.cyberhsm.vn/api/otp/requestsign (2.19) để yêu cầu lấy dc OTP/ Call https://api.cyberhsm.vn/api/otp/requestsign (2.19) to request DC OTP B3 
    // B3: Nhận SMS OTP về số điện thoại đã đăng ký/ Receive SMS OTP on registered phone number 
    // B4: Gọi các hàm ký trên tài liệu nhưng header thêm param/ Call the signing functions on the document but the header adds param otp={otp người dùng nhận được} / otp={otp the user received} 
    // -Các tài khoản đã kích hoạt xác thực ký bằng Google Authen thì sẽ cần làm những bước sau/ Accounts that have enabled Google Authen signing authentication will need to do the following steps: 
    // B1: Kích hoạt google authen app mobile bằng QRcode trên userhsm web/ Activate google authen app mobile by QRcode on userhsm web 
    // B2: Nhận OTP từ app google authen/ Get OTP from Google authen app 
    // B3: Gọi các hàm ký trên tài liệu nhưng header thêm param/ Call the signing functions on the document but the header adds param 
    //             otp={otp người dùng nhận được} / otp={otp the user received} 

    // Các tài khoản đã kích hoạt xác thực ký bằng SMS OTP thì sẽ cần làm những bước sau/ Accounts that have enabled SMS OTP signing authentication will need to do the following steps: 
    // B1: Dùng apikey và Pass để tạo ra Authorization hmac/ Use apikey and Pass to create Authorization hmac. 
    // B2: Gọi tới https://api.cyberhsm.vn/api/otp/requestsign (2.19) để yêu cầu lấy dc OTP/ Call https://api.cyberhsm.vn/api/otp/requestsign (2.19) to request DC OTP B3 
    // B3: Nhận SMS OTP về số điện thoại đã đăng ký/ Receive SMS OTP on registered phone number 
    // B4: Gọi các hàm ký trên tài liệu nhưng header thêm param/ Call the signing functions on the document but the header adds param 
    // otp={otp người dùng nhận được} 

    const url = `${host}/${API_OTP_REQUEST} `
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(str)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const signNoneWithRSA = async (data) => {
    // alg: NONEwithRSA,
    // payload: data
    const url = `${host}/${API_SIGN_NONE_WITH_RSA}`
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const signPureSignature = async (data) => {
    // alg: SHA1withRSA, SHA256withRSA ,
    // payload: data
    const url = `${host}/${API_SIGN_PURE_SIGNATURE}`
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

const signPDFBersign = async (data) => {
    // const data = {
    //     base64pdf:”String”,
    //     hashalg:”String”,
    //     base64image:”String”,
    //     textout:”String”,
    //     pagesign:”int”,
    //     xpoint:”int”,
    //     ypoint:”int”,
    //     width:”int”,
    //     height:”int”,
    //     typesignature:”int”
    // }

    // typesignature    Loại hiện thị chữ ký 
    // 1: cả text+hình ảnh 
    // 2: Chỉ hiện thị hình ảnh 
    // 3: chỉ hiện thị text 

    const url = `${host}/${API_SIGN_PDF_BERSIGN}`
    const options = {
        method: 'POST',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}


const getSampleAccountInfo = async () => {
    // Mô tả
    // • Typeotp: Loại phương thức xác thực (-1: không sử dụng OTP,10: Sử dụng passcode,3: Sử
    // dụng Google Authen)/ Type of authentication method (-1: do not use OTP,10: Use passcode,3:
    // Use Google Authen)
    // • Nameotp: Tên loại xác thực OTP(GoogleAuthen,passcode,không sử dụng)/ Name of OTP
    // authentication type (GoogleAuthen,passcode,don't use)
    // • Typethemesign: Mã loại mẫu chữ ký(-1:Chưa cấu hình mẫu chữ ký,1:Hình ảnh và Text,2: chỉ
    // hình ảnh, 3: Chỉ text)/ Signature template type code(-1:No signature template
    // configured,1:Image and Text,2:image only, 3:Text only)
    // • base64image: Base64 của file hình ảnh/ Base64 of the image file
    // textsign: Text được cấu hinh trong mẫu chữ ký/ Text is configured in the signature template
    // • status: Mã response.(401: Tài khoản không hợp lệ,200: Thành công,201: Lỗi cần kiểm tra phía
    // nhà cung cấp)/ Code response.(401: Invalid account, 200: Success, 201: Error need to check
    // provider side)
    // • description: Mô tả nếu có lỗi/ Describe if there is an error

    const url = `${host}/${API_GET_SAMPLE_ACCOUNT}`
    const options = {
        method: 'GET',
        headers: {
            'Authorization': authorization(),
            'Content-Type': 'application/json; charset=utf-8',
        },
    };
    const json = await fetch(url, options)
    let result = json.json()
    result = JSON.parse(result)
    return result
}

export {
    testCyber,

    createSignatureRaw,
    getSampleAccountInfo,
    getAccountInfo,

    getDigitalCerInfo,
    getSubDigitalCerInfo,
    getRootDigitalCerInfo,
    getChainDigitalCerInfo,
    verifyDigitalCer,

    signPDF,
    signPDFhash,
    signPDFBersign,
    signPureSignature,
    signNoneWithRSA,
    signMutiPDF,
    signOffice,
    signXML,
    verifySignedPDF,
    verifySignedOffice,
    verifySignedXML,

    requestOTP,
}