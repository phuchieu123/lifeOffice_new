
import { GET_CONTRACT_DETIAILS,GET_CONTRACT_DETIAILS_SUCCESS,GET_CONTRACT_DETIAILS_FAILURE } from "./constants";


export function getContractDetiails(data){
    return {
        type:GET_CONTRACT_DETIAILS,
        data
    }
}
export function getContractDetiailsSuccess(data){
    return{
        type:GET_CONTRACT_DETIAILS_SUCCESS,
        data
    }
}
export function getContractDetiailsFailure(data){
    return {
        type:GET_CONTRACT_DETIAILS_FAILURE,
        data
    }
}