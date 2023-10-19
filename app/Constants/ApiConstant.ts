export const API_CONSTANTS = {
    //consume
  CONSUME_READY_URL: `requests?limit=10&offset=0&sortBy=createdDate:desc&consumeApprovalStatus=Ready%20To%20Be%20Approved`,
  CONSUME_PARTIAL_URL: `requests?limit=10&offset=0&sortBy=createdDate:desc&consumeApprovalStatus=Partially%20Available`,
  CONSUME_OUTOF_STOCK_URL: `requests?limit=10&offset=0&sortBy=createdDate:desc&consumeApprovalStatus=Out%20of%20Stock`,
   //order
  ORDER_READY_URL: `orders?limit=10&offset=0&sortBy=createdDate:desc&orderApprovalStatus=Ready%20To%20Be%20Approved`,
  ORDER_PARTIAL_URL: `orders?limit=102&offset=0&sortBy=createdDate:desc&orderApprovalStatus=Partially%20Approved`,
  //pou
  POU_READY_URL: `pouOrders?limit=10&offset=0&sortBy=createdDate:desc&pouOrderApprovalStatus=AVAILABLE&limit=10`,
  POU_PARTIAL_URL: `pouOrders?limit=10&offset=0&sortBy=createdDate:desc&pouOrderApprovalStatus=Partial%20Available`,
  POU_OUTOF_STOCK_URL: `pouOrders?limit=10&offset=0&sortBy=createdDate:desc&pouOrderApprovalStatus=Not%20Available`,
};

export const SEARCH_KEY =  "&multiSearchKey=";