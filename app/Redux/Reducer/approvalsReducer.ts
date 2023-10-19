import { actionTypes } from "../Action/approvalsAction";

interface ActionProps {
  data: any;
  type: any;
  showToast: string;
  value: any;
}
const initialState = {
  showToast: "",
  consumeCount: 0,
  orderRequestCount: 0,
  pouCount: 0,
  loader: false,
  consumeList: {},
  orderList: {},
  pouList: {},
  hidePOU:false,
  approvalCount:0
};

const approvalsReducer = (state = initialState, action: ActionProps) => {
  switch (action.type) {
    case actionTypes.TOGGLE_APPROVAL_SUCCESS_TOAST:
      return {
        ...state,
        showToast: action.value,
      };
    case actionTypes.CONSUME_COUNT:
      return {
        ...state,
        consumeCount: action.value,
      };
    case actionTypes.SET_APPROVAL_LOADER:
      return {
        ...state,
        loader: action.value,
      };
    case actionTypes.ORDER_REQUEST_COUNT:
      return {
        ...state,
        orderRequestCount: action.value,
      };
    case actionTypes.POU_COUNT:
      return {
        ...state,
        pouCount: action.value,
      };
    case actionTypes.CONSUME_LIST:
      return {
        ...state,
        consumeList: action.value,
        loader: false,
      };
    case actionTypes.ORDER_LIST:
      return {
        ...state,
        orderList: action.value,
        loader: false,
      };
      case actionTypes.HIDEPOU:
        return {
          ...state,
          hidePOU: true,
          loader: false,
        };
    case actionTypes.POU_LIST:
      return {
        ...state,
        pouList: action.value,
        loader: false,
      };
      case actionTypes.APPROVAL_COUNT:
        return {
          ...state,
          approvalCount: action.data,
          loader: false,
        };
        case actionTypes.READY_TOBE_APPROVED_LIST:
          return {
            ...state,
            readyApprovedList: action.data,
            loader: false,
          };
          case actionTypes.PARTIAL_APPROVED_LIST:
          return {
            ...state,
            partialApprovedList: action.data,
            loader: false,
          };
          case actionTypes.OUTOF_STOCK_LIST:
          return {
            ...state,
            outofStockList: action.data,
            loader: false,
          };
    default:
      return state;
  }
};

export default approvalsReducer;
