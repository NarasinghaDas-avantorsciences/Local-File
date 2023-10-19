import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, TouchableOpacity, View } from "react-native";
import Text from "../../../Components/CustomText";
import styles from "./styles";
import { Header, Loader, Subheader } from "../../../Components";
import { ArrowRight } from "../../../Utils/images";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FONTS } from "../../../Utils/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  OutofstockList,
  PartialApprovedList,
  ReadytobeApprovedList,
  getConsumeList,
  getCount,
  getOrderList,
  getPOUList,
} from "../../../Redux/Action/approvalsAction";
import * as storage from "../../../Service/AsyncStoreConfig";
import {
  checkUserPrevilageForApprovals,
  handleApprovals,
  handleApprovalsPOU,
} from "../../../Utils/globalFunction";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { setIsShowConfirmationAlert } from "../../../Redux/Action/userAction";
import ConfirmationAlert from "../../../Components/ConfirmationPopup";
import { API_CONSTANTS } from "../../../Constants/ApiConstant";

const Approvals = (props: any) => {
  const dispatch = useDispatch<any>();
  const Strings = useSelector((state: any) => state.languageReducer?.data);
  const { userPrivilege, stockRoomDetail, confirmationAlertInfo } = useSelector(
    (state: any) => state.userReducer
  );
  const { consumeCount, orderRequestCount, pouCount, loader, approvalCount } =
    useSelector((state: any) => state.approvalsReducer);
  const [hidePOU, setHidePOU] = useState(false);
  const stockRoomsData = useSelector(
    (state: any) => state.userReducer?.stockRooms
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    props.navigation.navigate("Dashboard");
    return true;
  };
  useFocusEffect(
    useCallback(() => {
      dispatch(setIsShowConfirmationAlert({}));
    }, [])
  );

  const getItemCount = (hidePou: boolean) => {
    const pou = handleApprovalsPOU(userPrivilege);
    const hide =
      (hidePou || !pou) &&
      stockRoomDetail?.stockRoomMode?.toLowerCase() == "master";
    dispatch(getCount(hide, approvalCount));
  };

  const __renderItem = (title: string, total: number, type: number) => (
    <TouchableOpacity
      disabled={total == 0}
      style={styles.itemMain}
      onPress={() => {
        onPressItem(type, title);
      }}
      accessible={true}
      accessibilityLabel={
        type == 1
          ? "consume-request-approval-btn"
          : type == 2
          ? "order-request-approval-btn"
          : "pou-order-request-approval-btn"
      }
    >
      <Text
        style={styles.title}
        numberOfLines={1}
        accessible={true}
        accessibilityLabel={
          type == 1
            ? "consume-request-approval-text"
            : type == 2
            ? "order-request-approval-text"
            : "pou-order-request-approval-text"
        }
      >
        {title}
      </Text>
      <View style={styles.itemEnd}>
        <View
          style={[
            styles.circle,
            total?.toString()?.length == 3 && {
              height: hp(4.5),
              width: hp(4.5),
            },
            total?.toString()?.length > 3 && {
              height: hp(5),
              width: hp(5),
            },
          ]}
        >
          <Text style={[styles.title, { fontSize: FONTS.h1_8 }]}>
            {total?.toString()}
          </Text>
        </View>
        <ArrowRight />
      </View>
    </TouchableOpacity>
  );

  const onPressItem = (type: number, title: string) => {
    if (type == 1) {
      let url = `?limit=${10}&sortBy=createdDate:desc`;
      dispatch(getConsumeList(url, title));
    let Ready_Url = API_CONSTANTS.CONSUME_READY_URL;
    let Partial_Url = API_CONSTANTS.CONSUME_PARTIAL_URL;
    let OutofStock_Url = API_CONSTANTS.CONSUME_OUTOF_STOCK_URL;
    let Type_req = "CONSUME";
    dispatch(ReadytobeApprovedList(Ready_Url, Type_req));
    dispatch(PartialApprovedList(Partial_Url, Type_req));
    dispatch(OutofstockList(OutofStock_Url, Type_req));
    } else if (type == 2) {
      let url = `?limit=${10}&sortBy=createdDate:desc`;
      dispatch(getOrderList(url, title));
      let Ready_Url = API_CONSTANTS.ORDER_READY_URL;
      let Partial_Url = API_CONSTANTS.ORDER_PARTIAL_URL;
  
      dispatch(ReadytobeApprovedList(Ready_Url, ""));
      dispatch(PartialApprovedList(Partial_Url, ""));
    } else {
      let url = `?limit=${10}&sortBy=createdDate:desc`;
      dispatch(getPOUList(url, title));
      let Ready_Url = API_CONSTANTS.POU_READY_URL;
      let Partial_Url = API_CONSTANTS.POU_PARTIAL_URL;
      let OutofStock_Url = API_CONSTANTS.POU_OUTOF_STOCK_URL;
      dispatch(ReadytobeApprovedList(Ready_Url, ""));
      dispatch(PartialApprovedList(Partial_Url, ""));
      dispatch(OutofstockList(OutofStock_Url, ""));
    }
  };
  
  useEffect(() => {
    getOrg();
  }, [isFocused]);

  const getOrg = () => {
    storage.getItem("org").then((res: any) => {
      const orgData = JSON.parse(res);
      const currentstockRooms = stockRoomsData;
      for (let i = 0; i < currentstockRooms?.stockroomHierarchy?.length; i++) {
        if (
          currentstockRooms?.stockroomHierarchy[i]?.id == orgData?.stockroomId
        ) {
          getItemCount(false);
        } else {
          for (
            let k = 0;
            k <
            currentstockRooms?.stockroomHierarchy[i]?.childStockroom?.length;
            k++
          ) {
            if (
              currentstockRooms?.stockroomHierarchy[i]?.childStockroom[k]?.id ==
              orgData?.stockroomId
            ) {
              getItemCount(true);
              setHidePOU(true);
            }
          }
        }
      }
    });
  };

  const check = (type: string) => {
    const requestData = userPrivilege?.filter((item) => item?.name === type);
    return requestData?.length ? true : false;
  };

  return (
    <View style={styles.container}>
      <Header
        title={Strings["ime.scanner.approvals"] ?? "Approvals"}
        onLeftIconPress={() =>
          props.navigation.getParent("Drawer").openDrawer()
        }
        statusBar={true}
        statusBarColor={"blue"}
        iconLeft={true}
        iconRight={true}
      />
      <Subheader distance={10} rowContainer={styles.rowContainer} />
      <View style={{ marginTop: hp(1) }}>
        {checkUserPrevilageForApprovals(userPrivilege, "consume.request") &&
          consumeCount?.count > 0 &&
          __renderItem(
            Strings["ime.consume.request.approval"],
            consumeCount?.count,
            1
          )}

        {checkUserPrevilageForApprovals(userPrivilege, "order.request") &&
          orderRequestCount?.count > 0 &&
          __renderItem(
            Strings["ime.order.request.approval"],
            orderRequestCount?.count,
            2
          )}
        {handleApprovals(userPrivilege, pouCount) &&
          !hidePOU &&
          stockRoomDetail?.stockRoomMode?.toLowerCase() == "master" &&
          __renderItem(
            Strings["ime.pou.order.request.approval"],
            pouCount?.count,
            3
          )}
      </View>
      <Loader show={loader} />
      <ConfirmationAlert
        onTapNo={() => {}}
        onTapYes={() =>
          dispatch(
            setIsShowConfirmationAlert({
              isShow: false,
              data: confirmationAlertInfo?.data,
            })
          )
        }
        onBack={() => {}}
      />
    </View>
  );
};

export default Approvals;
