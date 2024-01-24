import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  BackHandler,
  AppState,
  Keyboard,
  SafeAreaView,
  Linking,
} from "react-native";
//@ts-ignore
import LinearGradient from "react-native-linear-gradient";
import { LogoHorizontal, BiometricsImg } from "../../../Utils/images";
import {
  dEcryptData,
  filterByMultipleKeys,
  filterByMultipleKeysBarcode,
  hp,
  wp,
} from "../../../Utils/globalFunction";

import AuthInputBox from "../../../Components/Auth/AuthInputBox";
import CheckButton from "../../../Components/Auth/CheckButton";
import EmptyDivider from "../../../Components/Common/EmptyDivider";
import FlatButton from "../../../Components/Common/FlatButton";
import styles from "./styles";
import { FONTS, SIZES } from "../../../Utils/theme";
import TermsOfUse from "../../AppFlow/TermsOfUse";
import {
  setLogin,
  logout,
  setBiometrics,
  setToken as setTokenUser,
  hideBiometricsFirstTime,
  setBiometricsStatus,
  setLoginBiometric,
  setInternet,
  resetTokenExpireState,
} from "../../../Redux/Action/loginAction";
import {
  getStockroomsnew,
  getUserPrivilege,
  setSelectedOrgandStockRoom,
  getOrgDetails,
  getStockroomDetail,
  setStockroomDetail,
  getOrg,
} from "../../../Redux/Action/userAction";
import {
  clearAccountData,
  getAccountDetails,
  showTermsAgreedPage,
} from "../../../Redux/Action/accountAction";
import { useDispatch, useSelector } from "react-redux";
import {
  BottomSheetComponent,
  Loader,
  TextInputComponent,
  AlertModal,
  AnimatedSearch,
} from "../../../Components";
import { getAppVersion } from "../../../Redux/Action/loginAction";
import Toast from "react-native-toast-message";
import * as storage from "../../../Service/AsyncStoreConfig";
import * as EncryptedStorage from "../../../Service/EncryptedStorageConfig";
import { ArrowDown, TickIcon } from "../../../Utils/images";
import MainButton from "../../../Components/MainButton";
import OutlinedButton from "../../../Components/OutlinedButton";
import { COLORS, FONTFAMILY } from "../../../Utils/theme";
import { setLanguageData } from "../../../Redux/Action/languageAction";
import * as Keychain from "react-native-keychain";
import CustomText from "../../../Components/CustomText";

import {
  loginLogic,
  changeLanguageLogic,
  onResetLogic,
  saveUserLogic,
  removeUserLogic,
  getRememberStoreLogic,
  saveStoreLogic,
  applyPushNotification,
} from "./logic";
import { getReceiveHeaderKPIs } from "../../../Redux/Action/receiveAction";
import OfflineToast from "../../../Components/Offline";
import { emailValadation } from "../../../Utils/validation";
import ReactNativeBiometrics from "react-native-biometrics";
import UpdateAlertBox from "../../../Components/AppUpdateAlert";
import { hasNotificaitonPermission } from "../../../Service/PushNotificationServiceHandler";
let hasOnlyOneStockOrg = false;
let logIndata: any;
let notificationloggedUserID: any;
import RNPERMISSIONS from "react-native-permissions";
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/native";
import authenticate from "../../../Service/Biometric";
import { SECURE_PASSWORD_KEY, SECURE_USER_KEY } from "../../../Constants/GlobalConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const Login = () => {
  const appState = React.useRef(AppState.currentState);
  const { showTermsAgreed } = useSelector((state: any) => state.accountReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [isEnableBiometrics, setIsEnableBiometrics] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [biomatricButtonShow,setBiomatricButtonShow] = useState(false);
  const dispatch = useDispatch<any>();
  const disabledLoginButton = !email || !password;
  const {
    userToken,
    biometricsAvailable,
    internet,
    biometrics,
    biometricsHide,
  } = useSelector((state: any) => state.loginReducer);
  const Strings = useSelector((state: any) => state.languageReducer?.data);
  const { languageLoader, languageList } = useSelector(
    (state: any) => state.languageReducer
  );
  const refRBSheet_list: any = useRef();
  const languageRef: any = useRef();
  const [sel_str, setSel_str] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [store, setStore] = useState<any>(false);
  const [token, setToken] = useState<any>(null);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [searckKey, setSearchKey] = useState("");
  const [selectedRoomChild, setSelectedChildRoom] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const [showUpdateAlertLoader, setShowUpdateAlertLoader] = useState(false);
  const [isRememberStore, setIsRememberStore] = useState(false);
  const [org, setOrg] = useState<any>(null);
  const [stockRooms, setStockRooms] = useState<any>(null);
  const isFocused = useIsFocused();
  const [previousUsername, setPreviousUsername] = useState("");
  const [credentialErrorText, setCredentialErrorText] = useState("");
  const [numberOfFailedAttempt, setNumberOfFailedAttempt] = useState(0);
  const [barcodeData, setBarcodeData] = useState<any>(false);
  const [count, setCount] = useState<any>(20);
  const [faceId, setFaceId] = useState<any>(0);
  const [refresh, doRefresh] = useState(0);

  useEffect(() => {
    //checkPErmission();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  // useEffect(() => {
  //   //dispatch(setBiometrics(true));
  //   _handleAppStateChange();
  // }, []);

  // useEffect(() => {
  //   // if (biometrics) {
  //   //   _handleAppStateChange();
  //   // }
  // }, [refresh]);

  const getOrganizations = () => {
    dispatch(getUserPrivilege());
    NetInfo.fetch().then((state) => {
      dispatch(getOrg(state.isConnected));
    });
    // dispatch(getStockrooms());
  };

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       doRefresh((prv) => prv + 1);
  //     } else {
  //       appState.current == "active" &&
  //         rnBiometrics.isSensorAvailable().then((res) => {
  //           dispatch(setBiometricsStatus(res?.available));
  //         });
  //     }
  //     NetInfo.fetch().then(state => {
  //       dispatch(setInternet(state.isConnected && state?.isInternetReachable));
  //     });
  //     appState.current = nextAppState;
  //   });
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const checkAuth1 = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      const decryptedUser = dEcryptData(credentials?.username, SECURE_USER_KEY);
      if (credentials && emailValadation(decryptedUser)) {
        setSelectedOrg("");
        setSelectedRoom("");
        setLoader(true);
        dispatch(
          setLoginBiometric(async (data: any) => {
            if (data?.stockRooms?.stockroomHierarchy?.length) {
              const org = await storage.getItem("org").then((res) => {
                return JSON.parse(res);
              });
              const filteredStock =
                data?.stockRooms?.stockroomHierarchy?.filter(
                  (stockroom) => stockroom?.id === org?.stockroomId
                );
              if (filteredStock?.length) {
                setToken(data?.token);
                await callPushnotificaitonAPIBackground(data?.accountData?.id ?? "");
                saveStoreLoginBiometric(data);
                await storage.setItem(
                  "isLoggedOut",
                  JSON.stringify(false)
                );
              } else {
                checkStockRommStatus(data);
                setStore(true);
              }
              setLoader(false);
            } else {
              setLoader(false);
              console.log("stockroomHierarchy []");
            }
          }, errorCallBack)
        );
      } else {
        const NewUserToken = await EncryptedStorage.getItem("userToken");
        const org: any = await storage.getItem("org");
        dispatch(setTokenUser(NewUserToken, org));
        // getRooms();
        // checkLanguage();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const _handleAppStateChange = async () => {
  //   const biometrics = await storage.getItem("biometrics");
  //   if (biometrics == "true" && !biometricsHide) {
  //     console.log('Login._handleAppStateChange')

      // authenticate(async (result: any) => {
      //   const { error, success } = result;
      //   if (success == true) {
      //     if (!userToken) {
      //       checkAuth1();
      //     }
      //     //dispatch(setBiometrics(false));
      //   } else {
      //     dispatch({
      //       type: "SET_ACCOUNT_DATA",
      //       data: null,
      //     });
      //     dispatch(setTokenUser(null, {}));
      //     dispatch(setTokenUser(null, {}));
      //     // if (error == "User cancellation") {
      //     //   dispatch(setBiometrics(false));
      //     // } else {
      //     //   dispatch(setBiometrics(true));
      //     // }
      //   }
      // });
  //   }
  // };

  // check permission for faceID in ios
  const checkBiometricPermission = async () => {
    try {
      const granted = await RNPERMISSIONS.request(
        RNPERMISSIONS.PERMISSIONS.IOS.FACE_ID
      );
      if (granted == "granted") {
        setFaceId(1);
        return;
      } else if (granted == "unavailable") {
        setFaceId(0);
        return;
      } else if (granted == "blocked" || granted == "denied") {
        setFaceId(2);
        return;
      }
      console.log("granted-->>>", granted);
    } catch (err) {
      setFaceId(0);
      return;
      console.log("err", err);
    }
  };

  useEffect(() => {
    // check if Biometrics is enabled
    rnBiometrics.isSensorAvailable().then((res) => {
      dispatch(setBiometricsStatus(res?.available));
    });
  }, [isFocused]);

  const backAction = () => {
    setStore(false);
    return true;
  };
//Verify This needed or not ?
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("AppState ", nextAppState);
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        internet && setShowUpdateAlertLoader(true);
        internet &&
          dispatch(
            getAppVersion((val: boolean) => {
              setShowUpdateAlertLoader(false);
            })
          );
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const checkProfile = (data: { licenseAgreed: boolean }) => {
    if (data) {
      if (data.licenseAgreed == false) {
        setStore(false);
      } else {
        setStore(true);
      }
    }
  };

  useEffect(() => {
    if (!userToken) {
      checkFirstLaunch();
    }
  }, [userToken]);

  useEffect(() => {
    getRememberStore();
    internet && setShowUpdateAlertLoader(true);
    internet &&
      dispatch(
        getAppVersion((val: boolean) => {
          setShowUpdateAlertLoader(false);
        })
      );
  }, [isFocused]);

  useEffect(() => {
    if (!store) {
      //call when cancelling the org/store selcetion page
      internet && setShowUpdateAlertLoader(true);
      internet &&
        dispatch(
          getAppVersion((val: boolean) => {
            setShowUpdateAlertLoader(false);
          })
        );
    }
  }, [store]);

  useEffect(() => {
    storage.getItem("language").then((res) => {
      if (res) {
        for (let i = 0; i < languageList.length; i++) {
          if (languageList[i]?.languageName == res?.replace("/labels", "")) {
            setSelected(i);
          }
        }
      } else {
        for (let i = 0; i < languageList.length; i++) {
          if (languageList[i]?.languageName == "EN_US") {
            setSelected(i);
          }
        }
      }
    });
  }, [languageList]);

  // check is user coming in app firstime
  const checkFirstLaunch = async () => {
    try {
      const isFirstLaunch = await storage.getItem("firstLaunch");
      if (isFirstLaunch === null) {
        //const isPinOrFingerprintSet = await DeviceInfo.isPinOrFingerprintSet()
        const biometricResult = await rnBiometrics.isSensorAvailable()
        if (biometricResult?.available) {
            setIsEnableBiometrics(true);
            setShowModal(true);
        }
        // .then((res) => {
        //   // res?.available && setShowModal(true);
        //   console.log('res?.available',res)
        //   if (res?.available) {
        //     setIsEnableBiometrics(true);
        //     setShowModal(true);
        //   }
        // });
        await removeUser();
        await storage.clear();
        await EncryptedStorage.clear();
        await storage.setItem("firstLaunch", "false");
      } else {
        fillUserData();
      }
    } catch (error) {}
  };

  const getRememberStore = () => {
    getRememberStoreLogic(
      storage,
      setSelectedOrg,
      setSelectedRoom,
      setSelectedChildRoom,
      setIsRememberStore
    );
  };

  const fillUserData = async () => {
    const credentials = await Keychain.getGenericPassword();
    const dEUserName = dEcryptData(credentials?.username, SECURE_USER_KEY);
    const dEPassword = dEcryptData(credentials?.password, SECURE_PASSWORD_KEY);
    let isRememberData: any = await storage.getItem("isRemember");
    if (credentials && emailValadation(dEUserName) && isRememberData) {
      setEmail(dEUserName);
      setPassword(dEPassword);
      setIsRemember(true);
    }
    const biometrics = await storage.getItem("biometrics");
    if (biometrics == "true" && credentials) {
      setIsEnableBiometrics(true);
    } else if (biometrics == "true") {
      disableAuth();
    }
  };

  // logic api calling
  const login = () => {
    loginLogic({
      email,
      password,
      Strings,
      doLogin,
      setLoader,
      showErrorToast,
    });
  };

  const checkStockRommStatus = (data: any) => {
    setOrg(data?.org);
    setStockRooms(data?.stockRooms);
    setToken(data?.token);
    setPreviousUsername("");
    setNumberOfFailedAttempt(0);
    setCredentialErrorText("");
    setSelectedChildRoom(null);
    let prevSelectedOrg = data.org?.rememberOrganization?.id ?? "";
    let isPOU = data?.org?.rememberStockrooms?.isPOU ?? false;
    let prevSelectedStkRoom = data?.org?.rememberStockrooms?.id ?? "";

    if (!isPOU) {
      //Sometimes the stock room will be deleted from the backend so we do this check
      if (data?.stockRooms?.stockroomHierarchy?.length > 0) {
        let isStkRmAvailable = data?.stockRooms?.stockroomHierarchy.some(
          (stkRm: any) => stkRm?.id == prevSelectedStkRoom
        );
        prevSelectedStkRoom = isStkRmAvailable ? prevSelectedStkRoom : "";
      } else {
        prevSelectedStkRoom = "";
      }
    }
    notificationloggedUserID = data?.accountData?.id ?? "";

    const isRemb = prevSelectedOrg.length > 0 && prevSelectedStkRoom.length > 0;
    setIsRememberStore(isRemb);
    if (prevSelectedOrg.length != 0) {
      setSelectedOrg(prevSelectedOrg);
    }

    if (prevSelectedStkRoom.length != 0) {
      if (isPOU) {
        for (let stckRoomDetails of data?.stockRooms?.stockroomHierarchy) {
          //[index, item]
          for (let [
            index,
            childRmDetail,
          ] of stckRoomDetails?.childStockroom.entries()) {
            if (childRmDetail?.id == prevSelectedStkRoom) {
              setSelectedRoom(stckRoomDetails?.id);
              setSelectedChildRoom(index); //Index of the child room
              break;
            }
          }
        }
      } else {
        setSelectedRoom(prevSelectedStkRoom);
      }
    }
    if (prevSelectedOrg == "" && prevSelectedStkRoom == "" && isRemb) {
      if (data?.org?.imeorganizationBaseDTO?.length > 0) {
        setSelectedOrg(data?.org?.imeorganizationBaseDTO[0]?.id);
      }
      if (data?.stockRooms?.stockroomHierarchy?.length > 0) {
        setSelectedRoom(data?.stockRooms?.stockroomHierarchy[0]?.id);
      }
    } else if (data?.org?.imeorganizationBaseDTO?.length == 1) {
      setSelectedOrg(data?.org?.imeorganizationBaseDTO[0]?.id);
    }
  };

  // logic api calling with store data handling and token handling
  const doLogin = () => {
    const data = {
      username: email,
      password: password,
    };
    logIndata = null;
    setSelectedOrg("");
    setSelectedRoom("");
    dispatch(
      setLogin(
        data,
        (data: any) => {
          // on login success below logic is implemented for store handling
          checkStockRommStatus(data);
          if (data?.accountData?.licenseAgreed == false) {
            dispatch(showTermsAgreedPage(true));
          } else {
            dispatch(showTermsAgreedPage(false));
          }

          // org and stockroom has only single value, it will automatically redirect to org/stockroom selection page
          if (
            data?.org?.imeorganizationBaseDTO?.length == 1 &&
            data?.stockRooms?.stockroomHierarchy?.length == 1 &&
            !data?.stockRooms?.stockroomHierarchy?.filter(
              (item: { childStockroom: string | any[] }) =>
                item?.childStockroom?.length
            )?.length
          ) {
            setSelectedOrg(data?.org?.imeorganizationBaseDTO[0]?.id);
            setSelectedRoom(data?.stockRooms?.stockroomHierarchy[0]?.id);

            //If terms of use is showing, then it will not navigate to Dashboard screen
            if (data?.accountData?.licenseAgreed == false) {
              hasOnlyOneStockOrg = true;
              logIndata = data;
            } else {
              onConfirmLogin(data);
              hasOnlyOneStockOrg = false;
            }
          } else {
            checkProfile(data?.accountData);
          }
          setLoader(false);
        },
        errorCallBack,
        (accountData: any) => {}
      )
    );
  };

  const showErrorToast = (text1, text2) => {
    Toast.show({
      type: "alertToast",
      text1: text1,
      text2: text2,
    });
  };

  const getRooms = (id) => {
    setLoader(true);
    dispatch(
      getStockroomsnew(id, (res: any) => {
        setSelectedRoom(res?.stockroomHierarchy[0]["id"]);
        setStockRooms(res);
        setLoader(false);
      })
    );
  };

  //Auto login when only have 1 stockroom and org
  const onConfirmLogin = async (data) => {
    isEnableBiometrics && enableAuth();
    saveUser(password);
    saveStoreLogin(data);
    await EncryptedStorage.setItem("userToken", data?.token);
    hasOnlyOneStockOrg = false;
  };

  // after selecting org and store this method is being called for login and store selecting
  const onConfirm = async () => {
    if (selectedOrg?.length == 0 || selectedRoom?.length == 0) {
      const msg =
        selectedOrg?.length == 0
          ? Strings["alert.please.select.organization"]
          : Strings["ime.select.stockroom.message"];
      showErrorToast(Strings["ime.attention"], msg);
      return;
    }
    isEnableBiometrics && enableAuth();
    saveUser(password);
    saveStore();
    await EncryptedStorage.setItem("userToken", token);
    dispatch(resetTokenExpireState());
  };

  // error handling for backend response on login
  const errorCallBack = (err) => {
    setLoader(false);
    if (err?.errorCode == 404 || err?.errorCode == 503) {
      Toast.show({
        type: "alertToast",
        text1: Strings["ime.error.occured"],
        text2: "Server is down",
      });
      return;
    }
    if (err?.errorMessage) {
      Toast.show({
        type: "alertToast",
        text1: Strings["ime.error.occured"],
        text2: err?.errorMessage?.split(" : ")[1],
      });
    } else if ((err?.error ?? "") == "too_many_attempts") {
      setNumberOfFailedAttempt(3);
      setPreviousUsername(email);
      setCredentialErrorText(
        err?.error_description ??
          "Your account has been blocked after multiple consecutive login attempts. We've sent you an email with instructions on how to unblock it."
      );
      Toast.show({
        type: "alertToast",
        text1: "Invalid credentials",
        text2: err?.error_description?.split(" : ")[1],
        position: "bottom",
      });
    } else {
      if (err?.toLowerCase() == "network error") {
        Toast.show({
          type: "alertToast",
          text1: Strings["ime.error.occured"] || "Error Occurred",
          text2: err,
        });
      } else {
        if ((err?.error ?? "") == "invalid_grant") {
          if (previousUsername == email) {
            setNumberOfFailedAttempt(numberOfFailedAttempt + 1);
          } else {
            setPreviousUsername(email);
            setNumberOfFailedAttempt(1);
            setCredentialErrorText("Not found");
          }
        }
        if (numberOfFailedAttempt == 0) {
          setCredentialErrorText("");
        }

        if (err?.errorMessage?.includes("html")) {
          Toast.show({
            type: "alertToast",
            text1: Strings["ime.error.occured"],
            text2: Strings["internal.server.error"] ?? "Internal Server Error",
            position: "bottom",
          });
        } else {
          Toast.show({
            type: "alertToast",
            text1: Strings["ime.error.occured"],
            text2: Strings["internal.server.error"] ?? "Internal Server Error",
            position: "bottom",
          });
        }
      }
    }
  };

  // biometrics handle
  const enableAuth = async () => {
    dispatch(hideBiometricsFirstTime(true));
    await storage.setItem("biometrics", "true");
    dispatch(setBiometrics(true));
  };
useEffect(()=>{
  BiomatricButton();
},[]);

useEffect(()=>{
  BiomatricButton();
},[isEnableBiometrics]);
  const BiomatricButton = async () =>{
    const iSbiomatric = await storage.getItem("biometrics");
    if (iSbiomatric == "true"){
   setBiomatricButtonShow(true);
    }else{
      setBiomatricButtonShow(false);
    }
  };
  const disableAuth = async () => {
    await storage.removeData("biometrics");
    dispatch(setBiometrics(false));
  };

  const getTitle = () => {
    if (sel_str == "org") {
      return Strings["organization"];
    } else if (sel_str == "stockroom") {
      return Strings["stockroom"];
    }
  };

  const onSelectCat = (str: string) => {
    setSel_str(str);
    refRBSheet_list.current.open();
    setCount(20);
  };

  const onReset = () => {
    onResetLogic(setEmail, setPassword, setIsRemember, setIsEnableBiometrics,storage);
  };

  // save user data in keychain
  const saveUser = async (pass: string) => {
    await callPushnotificaitonAPIBackground(notificationloggedUserID);
    await storage.setItem(
      "isLoggedOut",
      JSON.stringify(false)
    );
    notificationloggedUserID = null;
    saveUserLogic(
      email,
      isRemember,
      pass,
      storage,
      async (username: string, password: string) => {
        // await Keychain.setGenericPassword(username, password);
        await Keychain.setGenericPassword(username, password, {
          //accessControl:Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        });
      }
    );
  };

  // remove user data from keychain
  const removeUser = async () => {
    const credentials = await Keychain.getGenericPassword();
    removeUserLogic(
      credentials,
      async () => {
        await Keychain.resetGenericPassword();
      },
      (err: string) => {
        console.log("Error on remove user", err);
      }
    );
  };

  // barcode search logic for store/orgs
  const onSearchBarCode = (res) => {
    let blockData: any =
      sel_str == "stockroom"
        ? stockRooms?.stockroomHierarchy
        : sel_str == "org"
        ? org?.imeorganizationBaseDTO
        : null;

    let sampleArr: any = [];
    if (sel_str == "stockroom") {
      blockData?.map((item: any, index: number) => {
        blockData?.map(
          (item: { childStockroom: { id: any }[]; id: any }, index: any) => {
            if (item.childStockroom?.length > 0) {
              item.childStockroom?.map((childData: { id: any }) => {
                let childDataSet = {
                  ...childData,
                  isChild: true,
                  parentId: item.id,
                };
                let selectedIndex = sampleArr.findIndex(
                  (sampleItem: any) => sampleItem.id == childData.id
                );
                selectedIndex == -1 && sampleArr.push(childDataSet);
              });
            }
            let selectedIndex = sampleArr.findIndex(
              (sampleItem: any) => sampleItem.id == item.id
            );
            selectedIndex == -1 && sampleArr.push(item);
          }
        );
      });
    }

    const filteredData = filterByMultipleKeysBarcode(
      sel_str == "stockroom" ? sampleArr.reverse() : blockData,
      sel_str == "org" ? "orgName" : "stockroomName",
      "id",
      res
    );
    if (filteredData?.length) {
      setBarcodeData(true);
      const item = filteredData[0];
      if (sel_str == "org") {
        setSearchKey(item?.orgName);
      } else {
        if (item.id == res || item.stockroomName == res) {
          setSearchKey(item?.stockroomName);
        } else if (
          item?.childStockroom?.length &&
          item?.childStockroom?.filter((item: { id: any }) => item?.id == res)
        ) {
          const name = item?.childStockroom?.filter((cItem: any) => {
            if (cItem?.id == res) {
              return cItem?.stockroomName;
            }
          });
          setSearchKey(name);
        } else {
          setSearchKey(res);
        }
      }
    } else {
      setBarcodeData(false);
      setSearchKey(res);
    }
  };
  async function callPushnotificaitonAPIBackground(userId: any) {
    // this will call the pushnotification api if the user has already logged in and then logOut
    const isIntialLogin: any = await storage.getItem("firstLogin");
     
    if (isIntialLogin == null) {
      return;
    } else {
      const isshownotification = (await storage.getItem(
        "show_notification_modal"
      )) as string;
      const boolshownotificationValue = JSON.parse(
        isshownotification
      ) as boolean;

      const isEnablednotification = (await storage.getItem(
        "enabled_push_notification"
      )) as string;
      const boolEnabledNotificationValue = JSON.parse(
        isEnablednotification
      ) as boolean;
      if (!boolshownotificationValue || !boolEnabledNotificationValue) {
        /*If user not enabled the device notificaiton or doesnot show the notificaiton
        perimission popup at all then return
        */
        return;
      }else{
        const biometrics = await storage.getItem("biometrics");
        const stringLoggedOut = (await storage.getItem(
          "isLoggedOut"
        )) as string;
        const isLoggedOut = JSON.parse(
          stringLoggedOut
        ) as boolean;
        if (!isLoggedOut) {
          /*
          if the user is not logged out return frommthis function
          */ 
          return
        }
      }

      const hasOsPermission = await hasNotificaitonPermission();
      if (hasOsPermission) {
        await storage.setItem(
          "out_of_stock_notification_enabled",
          JSON.stringify(true)
        );
        await storage.setItem(
          "approvals_notification_enabled",
          JSON.stringify(true)
        );
        await storage.setItem(
          "running_low_notification_enabled",
          JSON.stringify(true)
        );
        await applyPushNotification(userId, dispatch, storage);
      } else {
        console.log("Notificaiton permission not enable");
      }
    }
  }

  // save store logic
  const saveStore = async () => {
    saveStoreLogic(
      storage,
      EncryptedStorage,
      selectedRoomChild,
      _selectedStoreRoom,
      selectedRoom,
      selectedOrg,
      _selectedStoreOrg,
      dispatch,
      setTokenUser,
      setSelectedOrgandStockRoom,
      getOrgDetails,
      getUserPrivilege,
      getStockroomDetail,
      setStockroomDetail,
      isRememberStore,
      token,
      getReceiveHeaderKPIs
    );
  };

  //Auto login when only have 1 stockroom and org
  const saveStoreLogin = async (alldata) => {
    const data: any = {
      stockroomId: alldata?.stockRooms?.stockroomHierarchy[0]?.id,
      orgId: alldata?.org?.imeorganizationBaseDTO[0].id,
    };
    const details = {
      selectedStockRoom: alldata?.stockRooms?.stockroomHierarchy[0],
      selectedOrg: alldata?.org?.imeorganizationBaseDTO[0],
    };
    await dispatch(setTokenUser(alldata?.token, JSON.stringify(data)));
    if (isRememberStore) {
      await dispatch(
        setStockroomDetail({
          rememberOrgId: data?.orgId ?? "",
          rememberStockRoomId: data?.stockroomId ?? "",
        })
      );
    } else {
      await dispatch(
        setStockroomDetail({
          rememberOrgId: "",
          rememberStockRoomId: "",
        })
      );
    }
    await dispatch(setSelectedOrgandStockRoom(details));
    await dispatch(getUserPrivilege());
    await dispatch(getStockroomDetail());
    await dispatch(getReceiveHeaderKPIs());
    await storage.setItem("org", JSON.stringify(data));
    await EncryptedStorage.setItem("orgDetails", JSON.stringify(details));
    const dataStoreSave = {
      stockroomId: alldata?.stockRooms?.stockroomHierarchy[0]?.id,
      orgId: alldata?.org?.imeorganizationBaseDTO[0].id,
      child: "",
    };
    if (isRememberStore) {
      await storage.setItem("dataStoreSave", JSON.stringify(dataStoreSave));
    } else {
      await storage.removeData("dataStoreSave");
    }
  };
  const saveStoreLoginBiometric = async (alldata) => {
    const org = await storage.getItem("org");
    const orgObject = JSON.parse(org);
    const data: any = {
      stockroomId: orgObject?.stockroomId,
      orgId: orgObject?.orgId,
    };
    const details = {
      selectedStockRoom: alldata?.org?.rememberStockrooms,
      selectedOrg: alldata?.org?.remeberOrganization,
    };
    await dispatch(setTokenUser(alldata?.token, JSON.stringify(data)));
    if (isRememberStore) {
      await dispatch(
        setStockroomDetail({
          rememberOrgId: alldata?.org?.rememberOrganization?.id ?? "",
          rememberStockRoomId: alldata?.org?.rememberStockrooms?.id ?? "",
        })
      );
    } else {
      await dispatch(
        setStockroomDetail({
          rememberOrgId: "",
          rememberStockRoomId: "",
        })
      );
    }
    await dispatch(setSelectedOrgandStockRoom(details));
    await dispatch(getUserPrivilege());
    await dispatch(getStockroomDetail());
    await dispatch(getReceiveHeaderKPIs());
    await storage.setItem("org", JSON.stringify(data));
    await EncryptedStorage.setItem("orgDetails", JSON.stringify(details));
    const dataStoreSave = {
      stockroomId: alldata?.org?.rememberStockrooms?.id,
      orgId: alldata?.org?.rememberOrganization?.id,
      child: "",
    };
    if (isRememberStore) {
      await storage.setItem("dataStoreSave", JSON.stringify(dataStoreSave));
    } else {
      await storage.removeData("dataStoreSave");
    }
    await EncryptedStorage.setItem("userToken", data?.token);
    hasOnlyOneStockOrg = false;
  };

  const _selectedStoreOrg = () => {
    const data = org?.imeorganizationBaseDTO?.filter(
      (item: any) => item?.id == selectedOrg
    );
    return data?.length ? data[0] : [];
  };
  const _selectedStoreRoom = () => {
    const data = stockRooms?.stockroomHierarchy?.filter(
      (item: any) => item?.id == selectedRoom
    );
    return data?.length ? data[0] : [];
  };

  const onBarcodeDetected = (barcode) => {
    setEmail(barcode);
  };

  const onCancel = () => {
    dispatch(clearAccountData());
    dispatch(logout());
    setSelectedOrg(null);
    setSelectedRoom(null);
    setStore(false);
    rnBiometrics.isSensorAvailable().then((res) => {
      dispatch(setBiometricsStatus(res?.available));
    });
  };

  const licenseAgreed = (isAgreed: boolean) => {
    const isUserMovingTermsView = false;
    if (isAgreed) {
      if (hasOnlyOneStockOrg) {
        hasOnlyOneStockOrg = false;
        onConfirmLogin(logIndata);
      } else {
        logIndata = null;
        setStore(true);
      }
    } else {
      onCancel();
    }
  };

  const noDataFound = () => {
    return (
      <View style={styles.emptyContainer}>
        <CustomText style={styles.emptyText}>
          {Strings["no.records.found"]}
        </CustomText>
      </View>
    );
  };

  // render org/store list
  const __renderStore = () => (
    <View>
      <TextInputComponent
        idLabel={Strings["vcm.report.pi.organization"]}
        title={Strings["organization"]}
        onPressRightIcon={() => onSelectCat("org")}
        onPressLeftIcon={() => console.log("left icon pressed")}
        RightIcon={ArrowDown}
        value={_selectedStoreOrg()?.orgName ? _selectedStoreOrg()?.orgName : ""}
        editable={false}
        main={styles.orgTxtContainerStyle}
        inputStyle={styles.inputStyle}
        inputMain={styles.inputMainStyle}
        pointerEvents="none"
      />
      <TextInputComponent
        idLabel={Strings["stockroom"]}
        title={Strings["stockroom"]}
        onPressRightIcon={() => onSelectCat("stockroom")}
        onPressLeftIcon={() => console.log("left icon pressed")}
        RightIcon={ArrowDown}
        value={
          selectedRoomChild != null &&
          selectedRoomChild != -1 &&
          _selectedStoreRoom()?.childStockroom?.length
            ? _selectedStoreRoom()?.childStockroom[selectedRoomChild]
                ?.stockroomName
            : _selectedStoreRoom()?.stockroomName
        }
        editable={false}
        main={[
          styles.orgTxtContainerStyle,
          {
            marginVertical: wp(5),
          },
        ]}
        disabled={selectedOrg ? false : true}
        inputStyle={styles.inputStyle}
        inputMain={styles.inputMainStyle}
        pointerEvents="none"
      />
      <CheckButton
        accessibilityLabel={"org-stock-remember-selection"}
        label={Strings["remember.my.selection"] ?? "Remember selection"}
        value={isRememberStore}
        onChange={setIsRememberStore}
      />
      <View style={styles.btnContainer}>
        <OutlinedButton
          accessibilityLabel={"org-stock-cancel"}
          title={Strings["ime.cancel"] || "cancel"}
          onChangeBtnPress={() => {
            onCancel();
          }}
          mainContainerStyle={styles.outlinedBtnContainerStyle}
          mainTextStyle={styles.outlinedBtnTextStyle}
        />

        <MainButton
          accessibilityLabel={"org-stock-continue"}
          title={Strings["ime.continue"] || "ime.continue"}
          buttonTextStyle={[styles.mainBtnText]}
          buttonStyle={[
            styles.btnWidth,
            (selectedOrg?.length == 0 || selectedRoom?.length == 0) && {
              backgroundColor: COLORS.gray,
            },
          ]}
          onChangeBtnPress={() => onConfirm()}
          disabled={selectedOrg?.length == 0 || selectedRoom?.length == 0}
        />
      </View>
    </View>
  );

  const __renderCheck = () => (
    <TickIcon
      accessible={true}
      accessibilityLabel={`${getTitle()}-language-tick`}
      height={hp(2)}
      width={hp(2)}
      fill={COLORS.scienceBlue}
      style={{
        marginRight: wp(2),
      }}
    />
  );

  const _renderList = (language: Boolean) => {
    let blockData: any =
      sel_str == "stockroom"
        ? stockRooms?.stockroomHierarchy
        : sel_str == "org"
        ? org?.imeorganizationBaseDTO
        : null;
    const filteredData1 = filterByMultipleKeys(
      blockData,
      sel_str == "org" ? "orgName" : "stockroomName",
      "id",
      searckKey
    );
    const filteredData = filteredData1?.slice(0, count);
    let sampleArr: any = [];

    if (language) {
      return languageList?.map((item: any, index: number) =>
        __renderItem(item, index, language)
      );
    } else if (sel_str == "stockroom") {
      blockData?.map((item: any, index: number) => {
        blockData?.map((item, index) => {
          if (item.childStockroom?.length > 0) {
            item.childStockroom?.map((childData) => {
              let childDataSet = {
                ...childData,
                isChild: true,
                parentId: item.id,
              };
              let selectedIndex = sampleArr.findIndex(
                (sampleItem: any) => sampleItem.id == childData.id
              );
              selectedIndex == -1 && sampleArr.push(childDataSet);
            });
          }
          let selectedIndex = sampleArr.findIndex(
            (sampleItem: any) => sampleItem.id == item.id
          );
          selectedIndex == -1 && sampleArr.push(item);
        });
      });

      const filteredData_new = barcodeData
        ? filterByMultipleKeysBarcode(
            sampleArr.reverse(),
            "stockroomName",
            "id",
            searckKey
          )
        : filterByMultipleKeys(
            sampleArr.reverse(),
            "stockroomName",
            "id",
            searckKey
          );

      if (searckKey.length > 0) {
        if (filteredData_new?.length) {
          return (
            <>
              {filteredData_new?.map((i, key) => {
                let filterSet = blockData?.filter(
                  (item) => item.id == (i.isChild ? i.parentId : i.id)
                );
                return <>{__renderItem(i, key, language, filterSet)}</>;
              })}
            </>
          );
        } else {
          return noDataFound();
        }
      } else {
        return filteredData?.map((item: any, index: number) => (
          <>
            {__renderItem(item, index, language)}
            {sel_str == "stockroom" &&
              filteredData[index]?.childStockroom?.map((i: any, key: number) =>
                __renderChildItem(i, item?.id, key)
              )}
          </>
        ));
      }
    } else {
      if (filteredData?.length) {
        {
          return filteredData?.map((item: any, index: number) => (
            <>{__renderItem(item, index, language)}</>
          ));
        }
      } else {
        return noDataFound();
      }
    }
  };

  const __renderItem = (
    item: any,
    index: number,
    language: Boolean,
    filterDataSet?: any
  ) => {
    return (
      <TouchableOpacity
        onPress={() => {
          refRBSheet_list?.current.close();
          setSearchKey("");
          if (language) {
            languageRef?.current?.close();
            setSelected(index);
            changeLanguage(index);
          } else if (sel_str == "org") {
            setSelectedOrg(item?.id);
            getRooms(item?.id);
            return;
          } else if (sel_str == "stockroom") {
            let firstIndex =
              filterDataSet &&
              filterDataSet?.findIndex((element) =>
                element.id == item.isChild ? item.parentId : item?.id
              );
            let secondIndex =
              filterDataSet &&
              filterDataSet[firstIndex]?.childStockroom?.findIndex(
                (element: { id: any }) => element.id == item.id
              );
            setSelectedRoom(item.isChild ? item.parentId : item?.id);
            setSelectedChildRoom(secondIndex == -1 ? null : secondIndex);
          }
        }}
        accessibilityLabel={
          language
            ? `login-labgugage-selected`
            : sel_str == "org"
            ? `${getTitle()}-login-selected`
            : `${getTitle()}-login-selected`
        }
        key={index}
        style={[
          styles.itemMain,
          language &&
            selected === index && {
              justifyContent: "space-between",
              alignItems: "center",
            },
          !language &&
            sel_str == "org" &&
            selectedOrg === item?.id && {
              justifyContent: "space-between",
              alignItems: "center",
            },
          !language &&
            sel_str == "stockroom" &&
            selectedRoom === item?.id &&
            selectedRoomChild == null && {
              justifyContent: "space-between",
              alignItems: "center",
            },
        ]}
      >
        <CustomText
          style={[
            styles.itemTitle,
            { width: "85%", marginLeft: item?.isChild ? 20 : 0 },
            language &&
              selected === index && {
                color: "#53565A",
                fontFamily: FONTFAMILY.averta_semibold,
              },
            !language &&
              sel_str == "org" &&
              selectedOrg === item?.id && {
                color: "#53565A",
                fontFamily: FONTFAMILY.averta_semibold,
              },
            !language &&
              sel_str == "stockroom" &&
              selectedRoom === item?.id &&
              selectedRoomChild == null && {
                color: "#53565A",
                fontFamily: FONTFAMILY.averta_semibold,
              },
          ]}
          accessibilityLabel={
            language ? "language-items" : `${getTitle()}-list-items`
          }
        >
          {language
            ? item?.languageDescription
            : sel_str == "org"
            ? item?.orgName
            : item?.stockroomName}
        </CustomText>
        {language && selected === index && __renderCheck()}
        {!language &&
          sel_str == "org" &&
          selectedOrg === item?.id &&
          __renderCheck()}
        {!language &&
          sel_str == "stockroom" &&
          selectedRoom === item?.id &&
          selectedRoomChild == null &&
          __renderCheck()}
      </TouchableOpacity>
    );
  };

  const __renderChildItem = (item: any, id: number, i: number) => (
    <TouchableOpacity
      onPress={() => {
        refRBSheet_list.current.close();
        setSearchKey("");
        setSelectedRoom(id);
        setSelectedChildRoom(i);
      }}
      key={i}
      style={[
        styles.itemMain,
        selectedRoomChild === i &&
          selectedRoom == id && {
            justifyContent: "space-between",
            alignItems: "center",
          },
      ]}
      accessible={true}
      accessibilityLabel={"login-child-stockroom-selected"}
    >
      <CustomText
        style={[
          styles.itemTitle,
          { width: "85%", marginLeft: 10 },
          selectedRoomChild === i &&
            selectedRoom == id && {
              color: "#53565A",
              fontFamily: FONTFAMILY.averta_semibold,
            },
        ]}
      >
        {item?.stockroomName}
      </CustomText>
      {selectedRoomChild === i && selectedRoom == id && __renderCheck()}
    </TouchableOpacity>
  );

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const LoginWithBiomatricfn = () => {
    authenticate(async (result: any) => {
      const { error, success } = result;
      if (success == true) {
        if (!userToken) {
          checkAuth1();
        }
        dispatch(setBiometrics(false));
      } else {
        dispatch({
          type: "SET_ACCOUNT_DATA",
          data: null,
        });
        dispatch(setTokenUser(null, {}));
        dispatch(setTokenUser(null, {}));
        if (error == "User cancellation") {
          dispatch(setBiometrics(false));
        } else {
          dispatch(setBiometrics(true));
        }
      }
    });
  };
const LoginWithBiomatricRender = () => {
    return (
      <>
        <CustomText style={styles.loginWithBioText}>{"OR"}</CustomText>
        <CustomText style={styles.loginWithBioText}>
          {"Login with Biometrics"}
        </CustomText>
        <TouchableOpacity
          onPress={() => LoginWithBiomatricfn()}
          accessibilityLabel="login-with-biomatric"
          accessible={true}
          style={styles.biometicContainer}
        >
          <BiometricsImg
            style={styles.biometricLogoStyle}
            height={hp(10)}
            width={wp(80)}
          />
        </TouchableOpacity>
      </>
    );
  };
const BiomatricOnchangeFn = async()=>{
    if (isEnableBiometrics) {
      setIsEnableBiometrics(false);
      disableAuth();
  let isRememberData: any = await storage.getItem("isRemember");
  if (!isRememberData && !isEnableBiometrics){
    await removeUser();
  }
    } else{
      setShowModal(true);
    }
};

  const __renderStocks = () => (
    <BottomSheetComponent
      customStyles={{ container: styles.bottomSheetContainer }}
      bottomSheetRef={refRBSheet_list}
      height={hp(80)}
      didCloseModal={() => {
        setSearchKey("");
      }}
    >
      <SafeAreaView>
        <View
          style={styles.headerContainer}
          accessible={true}
          accessibilityLabel={`${getTitle()}-sheet-container`}
        >
          <CustomText
            style={styles.headerText}
            accessibilityLabel={`${getTitle()}-selection-sheet`}
          >
            {getTitle()}
          </CustomText>
          <CustomText
            adjustsFontSizeToFit={false}
            accessible={true}
            accessibilityLabel={`${getTitle()}-close-bottomSheet`}
            style={styles.closeBtn}
            onPress={() => refRBSheet_list.current.close()}
          >
            {Strings["close"] || "close"}
          </CustomText>
        </View>
        <AnimatedSearch
          idLabel={`${getTitle()}`}
          search={searckKey ?? ""}
          onSearch={(text: string) => {
            setBarcodeData(false);
            setSearchKey(text);
          }}
          containerStyle={[styles.searchMain]}
          cancelBtnStyle={{ paddingRight: wp(5) }}
          placeholder={Strings["search"] ?? "Search"}
          clearText={() => {
            setSearchKey("");
            setCount(20);
          }}
          onBarcodeDetected={(barcode) => onSearchBarCode(barcode)}
          onCancel={() => {
            setSearchKey("");
            setCount(20);
            Keyboard.isVisible() && Keyboard?.dismiss();
          }}
          from="login"
        />
        <ScrollView
          style={styles.listMain}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          onScroll={({ nativeEvent }) => {
            Keyboard.dismiss();
            if (isCloseToBottom(nativeEvent)) {
              setCount((prv: number) => prv + 10);
            }
          }}
          scrollEventThrottle={400}
        >
          {_renderList(false)}
        </ScrollView>
      </SafeAreaView>
    </BottomSheetComponent>
  );

  // change language logic
  const changeLanguage = (selected: string) => {
    changeLanguageLogic(
      selected,
      dispatch,
      setLanguageData,
      languageList,
      storage
    );
  };

  const __renderLanguages = () => (
    <BottomSheetComponent
      customStyles={{ container: styles.bottomSheetContainer }}
      bottomSheetRef={languageRef}
      height={hp(80)}
    >
      <View style={styles.headerContainer}>
        <CustomText style={styles.headerText}>
          {Strings["ime.change.language"]}
        </CustomText>
        <CustomText
          adjustsFontSizeToFit={false}
          style={styles.closeBtn}
          onPress={() => languageRef.current.close()}
        >
          {Strings["close"]}
        </CustomText>
      </View>
      <ScrollView style={styles.listMain} showsVerticalScrollIndicator={false}>
        {_renderList(true)}
      </ScrollView>
    </BottomSheetComponent>
  );

  const __renderLoginView = () => {
    return (
      <>
        <AuthInputBox
          lable={Strings["email.address"] || "email.address"}
          keyboardType="email-address"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
          }}
          onBarcodeDetected={onBarcodeDetected}
        />
        <AuthInputBox
          lable={Strings["ime.password"]}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <EmptyDivider height={hp(1)} />
        <CheckButton
          accessibilityLabel={"login-remember-me"}
          label={Strings["remember.me"]}
          value={isRemember}
          onChange={async () => {
            isRemember && (await storage.removeData("isRemember"));
            setIsRemember(!isRemember);
          }}
        />
        { biometricsAvailable && (
          <CheckButton
            accessibilityLabel={"Enable-biometrics-to-login"}
            label={
              Strings["ime.enable.biometrics.login"] ??
              "Enable biometrics to login"
            }
            value={isEnableBiometrics}
            onChange={BiomatricOnchangeFn}
          />
        )}

        <EmptyDivider height={hp(3)} />
        <FlatButton
          text={Strings["im.login"] || "im.login"}
          onPress={() => login()}
          disabled={disabledLoginButton || !internet}
          container={[
            styles.loginButton,
            !internet && {
              backgroundColor: "#f7f7f9",
            },
          ]}
          textStyle={[
            styles.loginButtonText,
            !internet && {
              color: "#53565A",
            },
          ]}
          accessibilityLabel={"login-user"}
        />
    {biomatricButtonShow && LoginWithBiomatricRender()}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => onReset()}
          accessibilityLabel="login-reset-btn"
          accessible={true}
        >
          <CustomText
            style={styles.resetText}
            accessibilityLabel="login-reset-text"
          >
            {Strings["reset"]}
          </CustomText>
        </TouchableOpacity>
      </>
    );
  };

  return showTermsAgreed ? (
    <TermsOfUse licenseAgreed={(val: boolean) => licenseAgreed(val)} />
  ) : (
    <LinearGradient
      colors={["#00D649", "#2EC4FF"]}
      style={[styles.linear, store && { justifyContent: "center" }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView
        style={[styles.linear, store && { justifyContent: "center" }]}
      >
        <StatusBar translucent={true} backgroundColor={"transparent"} />
        <View />
        {!internet && <OfflineToast login={true} main={styles.offlineText} />}
        <View style={[styles.subContainer,!internet && biomatricButtonShow? { position: 'absolute', top: '15%' }:null]}>
          <LogoHorizontal
            style={styles.logoStyle}
            height={hp(6)}
            width={wp(82)}
          />
          {store ? __renderStore() : __renderLoginView()}
        </View>

        {!store && (
          <View>
            <FlatButton
              text={Strings["ime.change.language"]}
              onPress={() => {
                languageRef.current.open();
              }}
              isImage={true}
              image="https://avantor-patternlab.netlify.app/images/globe-icon.png"
              textStyle={styles.changeLanguageText}
              accessibilityLabel={"login-change-language"}
            />
          </View>
        )}
        {__renderStocks()}
        {__renderLanguages()}
        <AlertModal
          isShow={showModal}
          customStyles={{ width: SIZES.width * 0.9 }}
        >
          <CustomText style={styles.modalHeaderText}>
            {Strings["ime.enable.biometric.authentication"] ??
              "Enable Biometric Authentication?"}
          </CustomText>
          <CustomText style={styles.modalBodyText}>
            {Strings["scanner.biometric.message1"] ??
              "Use your preferred biometric to login to Inventory Manager."}
          </CustomText>
          {faceId == 2 ? (
            <MainButton
              title={"Enable FaceID"}
              buttonTextStyle={{ ...FONTS.title }}
              onChangeBtnPress={() => {
                setShowModal(!showModal);
                Linking.openSettings();
              }}
              buttonStyle={styles.modalMainButton}
            />
          ) : (
            <MainButton
              title={"Enable Biometrics"}
              buttonTextStyle={{ ...FONTS.title }}
              onChangeBtnPress={async () => {
                await checkBiometricPermission();
                setIsEnableBiometrics(true);
                setShowModal(!showModal);
              }}
              buttonStyle={styles.modalMainButton}
            />
          )}

          <TouchableOpacity
            style={styles.modalSecondaryButton}
            onPress={() => {
              setShowModal(!showModal);
              setIsEnableBiometrics(false);
            }}
            accessible={true}
            accessibilityLabel={"login-close-biometrics-modal"}
          >
            <CustomText style={styles.modalSecondaryButtonText}>
              {Strings["scanner.notnow"] ?? "Not Now"}
            </CustomText>
          </TouchableOpacity>

          <CustomText style={styles.modalFooterText}>
            {Strings["scanner.biometric.message2"] ??
              "You can change biometric preferences at any time in your account settings."}
          </CustomText>
        </AlertModal>
        <UpdateAlertBox />
      </SafeAreaView>
      <Loader show={loader || languageLoader || showUpdateAlertLoader} />
    </LinearGradient>
  );
};

export default Login;
