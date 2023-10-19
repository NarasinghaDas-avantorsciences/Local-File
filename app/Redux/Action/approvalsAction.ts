import { ApiConfig } from "../../Service/Api";
import {
  baseUrl,
  approvals,
  pouOrdersCount,
  ordersCount,
  consumeRequestsCount,
  consumeRequestsList,
  pouOrdersList,
  ordersList,
  consumeApprove,
  POUApprove,
  consumeApproval,
} from "../../Service/ApiConfig";
import NavigationService from "../../Navigation/NavigationService";
export const actionTypes = {
  TOGGLE_APPROVAL_SUCCESS_TOAST: "TOGGLE_APPROVAL_SUCCESS_TOAST",
  SET_APPROVAL_LOADER: "SET_APPROVAL_LOADER",
  ORDER_REQUEST_COUNT: "ORDER_REQUEST_COUNT",
  CONSUME_COUNT: "CONSUME_COUNT",
  POU_COUNT: "POU_COUNT",
  CONSUME_LIST: "CONSUME_LIST",
  ORDER_LIST: "ORDER_LIST",
  POU_LIST: "POU_LIST",
  HIDEPOU: "HIDEPOU",
  APPROVAL_COUNT: "APPROVAL_COUNT",
  READY_TOBE_APPROVED_LIST: "READY_TOBE_APPROVED_LIST",
  PARTIAL_APPROVED_LIST: "PARTIAL_APPROVED_LIST",
  OUTOF_STOCK_LIST: "OUTOF_STOCK_LIST",
};
export const toggleApprovalToast = (value: any) => {
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.TOGGLE_APPROVAL_SUCCESS_TOAST,
      value: value,
    });
  };
};
export const getCountApproval = () => {
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .getJSON(baseUrl + approvals + "/count")
      .then((res: any) => {
        console.log("res", res?.data);
        dispatch({
          type: actionTypes.APPROVAL_COUNT,
          data: res?.data,
        });
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getCount = (hidePou: boolean, approvalCount: number) => {
  console.log("get pou--", hidePou, approvalCount);
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .getJSON(baseUrl + approvals + consumeRequestsCount)
      .then((res: any) => {
        const count = {
          count:
            res?.data?.readyToBeReceivedCount +
              res?.data?.outOfStockCount +
              res?.data?.partiallyAvailableCount || 0,
          data: res?.data,
        };
        if (approvalCount != count?.count) {
          dispatch(getOrderRequestCount(hidePou, count?.count, approvalCount));
        } else {
          dispatch({
            type: actionTypes.SET_APPROVAL_LOADER,
            value: false,
          });
        }
        dispatch({
          type: actionTypes.CONSUME_COUNT,
          value: count,
        });
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getOrderRequestCount = (
  hidePou: boolean,
  consumeCount: number,
  total: number
) => {
  return async (dispatch: any) => {
    new ApiConfig()
      .getJSON(baseUrl + approvals + ordersCount)
      .then((res: any) => {
        const count = {
          count:
            res?.data?.readyToBeReceivedCount +
              res?.data?.outOfStockCount +
              res?.data?.partiallyApprovedCount || 0,
          data: res?.data,
        };
        dispatch({
          type: actionTypes.ORDER_REQUEST_COUNT,
          value: count,
        });
        if (hidePou || consumeCount + count?.count == total) {
          dispatch({
            type: actionTypes.HIDEPOU,
          });
          const count = {
            count: 0,
            data: null,
          };
          dispatch({
            type: actionTypes.POU_COUNT,
            value: count,
          });
        } else {
          dispatch(getPOUCount());
        }
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getPOUCount = () => {
  return async (dispatch: any) => {
    new ApiConfig()
      .getJSON(baseUrl + approvals + pouOrdersCount)
      .then((res: any) => {
        const count = {
          count:
            res?.data?.readyToBeReceivedCount +
              res?.data?.outOfStockCount +
              res?.data?.partiallyApprovedCount || 0,
          data: res?.data,
        };
        dispatch({
          type: actionTypes.POU_COUNT,
          value: count,
        });
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getConsumeList = (
  url: string,
  title: string,
  loadData = false,
  callBack: any = null
) => {
  return async (dispatch: any) => {
    if (callBack == null) {
      dispatch({
        type: actionTypes.SET_APPROVAL_LOADER,
        value: true,
      });
    }
    new ApiConfig()
      .getJSON(baseUrl + consumeRequestsList + url)
      .then((res: any) => {
        if (callBack) {
          callBack(res?.data);
        } else {
          dispatch({
            type: actionTypes.CONSUME_LIST,
            value: res?.data,
          });
          !loadData &&
            title &&
            NavigationService.navigate("OrderRequestApproval", {
              type: title,
              screen: 1,
            });
        }
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};

export const getOrderList = (
  url: string,
  title: string,
  loadData = false,
  callBack: any = null
) => {
  return async (dispatch: any) => {
    if (callBack == null) {
      dispatch({
        type: actionTypes.SET_APPROVAL_LOADER,
        value: true,
      });
    }
    new ApiConfig()
      .getJSON(baseUrl + approvals + ordersList + url)
      .then((res: any) => {
        if (callBack) {
          callBack(res?.data);
        } else {
          if (callBack) {
            callBack(res?.data);
          } else {
            dispatch({
              type: actionTypes.ORDER_LIST,
              value: res?.data,
            });
            !loadData &&
              title &&
              NavigationService.navigate("OrderRequestApproval", {
                type: title,
                screen: 2,
              });
          }
        }
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getPOUList = (
  url: string,
  title: string,
  loadData = false,
  callBack: any = null
) => {
  return async (dispatch: any) => {
    if (callBack == null) {
      dispatch({
        type: actionTypes.SET_APPROVAL_LOADER,
        value: true,
      });
    }
    new ApiConfig()
      .getJSON(baseUrl + approvals + pouOrdersList + url)
      .then((res: any) => {
        if (callBack) {
          callBack(res?.data);
        } else {
          dispatch({
            type: actionTypes.POU_LIST,
            value: res?.data,
          });
          !loadData &&
            title &&
            NavigationService.navigate("OrderRequestApproval", {
              type: title,
              screen: 3,
            });
        }
      })
      .catch((ERROR) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getDetail = (
  url: string,
  title: string,
  item: any,
  screen: number
) => {
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .getJSON(baseUrl + url)
      .then((res: any) => {
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
        NavigationService.navigate("ApprovalDetails", {
          type: title,
          data: res?.data,
          selectedItem: item,
          screen: screen,
        });
      })
      .catch((ERROR) => {
        console.log("getDetail --- ERROR ", ERROR);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const onComsueApprove = (
  body: any,
  successCallBack: any,
  errorCallBack: Function
) => {
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .postJSON(body, baseUrl + consumeApprove)
      .then((res: any) => {
        successCallBack(res);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      })
      .catch((ERROR) => {
        errorCallBack(ERROR);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const onPouApprove = (
  body: any,
  successCallBack: any,
  errorCallBack: Function
) => {
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .postJSON(body, baseUrl + POUApprove)
      .then((res: any) => {
        successCallBack(res);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      })
      .catch((ERROR) => {
        errorCallBack(ERROR);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const getCostCenterList = (url: string, CallBack: any) => {
  return async (dispatch: any) => {
    // dispatch({
    //   type: actionTypes.SET_APPROVAL_LOADER,
    //   value: true,
    // });
    new ApiConfig()
      .getJSON(baseUrl + users + url)
      .then((res: any) => {
        CallBack(res?.data);
      })
      .catch((ERROR) => {
        console.log("ERROR in getOrderList", ERROR.response?.data);
        // dispatch({
        //   type: actionTypes.SET_APPROVAL_LOADER,
        //   value: false,
        // });
      });
  };
};

// Api Add for Approval Module

export const ReadytobeApprovedList = (Ready_Url:any,Type_req:string) => {
  let RefURL = Type_req === "CONSUME" ? consumeApproval :approvals;
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .getJSON(baseUrl + RefURL + Ready_Url)
      .then((res: any) => {
        console.log("ReadytobeApprovedList Api---> res", res?.data);
        dispatch({
          type: actionTypes.READY_TOBE_APPROVED_LIST,
          data: res?.data,
        });
      })
      .catch((ERROR) => {
        console.log("ReadytobeApprovedList Api is Faill ---->",ERROR);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};

export const PartialApprovedList = (Partial_Url:any,Type_req:string) => {
  let RefURL = Type_req === "CONSUME" ? consumeApproval :approvals;
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .getJSON(baseUrl + RefURL + Partial_Url)
      .then((res: any) => {
        console.log("PartialApprovedList Api---> res", res?.data);
        dispatch({
          type: actionTypes.PARTIAL_APPROVED_LIST,
          data: res?.data,
        });
      })
      .catch((ERROR) => {
        console.log("PartialApprovedList Api is Faill ---->",ERROR);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};
export const OutofstockList = (OutofStock_Url:any,Type_req:string) => {
  let RefURL = Type_req === "CONSUME" ? consumeApproval :approvals;
  return async (dispatch: any) => {
    dispatch({
      type: actionTypes.SET_APPROVAL_LOADER,
      value: true,
    });
    new ApiConfig()
      .getJSON(baseUrl + RefURL + OutofStock_Url)
      .then((res: any) => {
        console.log("OutofstockList Api---> res", res?.data);
        dispatch({
          type: actionTypes.OUTOF_STOCK_LIST,
          data: res?.data,
        });
      })
      .catch((ERROR) => {
        console.log(" OutofstockList Api is Faill ---->",ERROR);
        dispatch({
          type: actionTypes.SET_APPROVAL_LOADER,
          value: false,
        });
      });
  };
};


