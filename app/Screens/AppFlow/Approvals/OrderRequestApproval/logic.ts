const newLoadData = (
  screen: number,
  limit: number,
  selectedIndex:any,
  totalCount: any,
  dispatch: (action: any) => void,
  getConsumeList: any,
  getOrderList: any,
  getPOUList: any,
  searchKey:any,
  setLimit: any
) => {
  if (screen === 1) {
    if (selectedIndex == 1 && limit < totalCount) {
      let url = `?limit=${limit + 10}&sortBy=createdDate:desc`;
      if (searchKey) {
        url += `&multiSearchKey=${searchKey}`;
      }
      setLimit();
      dispatch(getConsumeList(url, "", true));
    }
  } else if (screen === 2) {
    if (selectedIndex == 1 && limit < totalCount) {
      let url = `?limit=${limit + 10}&sortBy=createdDate:desc`;
      if (searchKey) {
        url += `&multiSearchKey=${searchKey}`;
      }
      setLimit();
      dispatch(getOrderList(url, "", true));
    }
  } else {
    if (selectedIndex == 1 && limit < totalCount) {
      let url = `?limit=${limit + 10}&sortBy=createdDate:desc`;
      if (searchKey) {
        url += `&multiSearchKey=${searchKey}`;
      }
      setLimit();
      dispatch(getPOUList(url, "", true));
    }
  }
};

const onChangeBtnPress = (
    screen: number,
    item: any,
    dispatch: (action: any) => void,
    getDetail: any,
    routeParams: any
  ) => {
    if (screen === 1) {
      dispatch(
        getDetail(
          `api/stock/consume/requests/${item?.consumeRequestId}`,
          routeParams?.type,
          item,
          screen
        )
      );
    }
    if (screen === 2) {
      dispatch(
        getDetail(
          `api/approvals/orders/${item?.orderId}`,
          routeParams?.type,
          item,
          screen
        )
      );
    }
    if (screen === 3) {
      dispatch(
        getDetail(
          `api/approvals/pouOrders/${item?.orderId}`,
          routeParams?.type,
          item,
          screen
        )
      );
    }
  };
  

export { newLoadData,onChangeBtnPress };
