import { UserCredentials } from "react-native-keychain";
import { emailValadation } from "../../../Utils/validation";
import { pushNotificationAction } from "../../../Redux/Action/pushNotificationAction";
import { eNcryptData } from "../../../Utils/globalFunction";
import { SECURE_PASSWORD_KEY, SECURE_USER_KEY } from "../../../Constants/GlobalConstants";

const loginLogic = ({
  email,
  password,
  Strings,
  doLogin,
  setLoader,
  showErrorToast,
}: any) => {
  if (email && password) {
    if (!emailValidation(email)) {
      showErrorToast(
        Strings["Invalid Email"] || "Invalid Email",
        Strings["alert.enter.valid.email.address"]
      );
    } else {
      setLoader(true);
      doLogin();
    }
  } else {
    showErrorToast("Please fill all fields");
  }
};

const emailValidation = (email: string) => {
  return emailValadation(email);
};
// change language logic
const changeLanguageLogic = async (
  selected: string | number,
  dispatch: (arg0: any) => void,
  setLanguageData: (arg0: string) => any,
  languageList: any,
  storage: { setItem: (arg0: string, arg1: string) => any }
) => {
  const languageName = languageList[selected]?.languageName;
  const languageDataKey = `${languageName}/labels`;
  dispatch(setLanguageData(languageDataKey));
  try {
    await storage.setItem("language", languageDataKey);
  } catch (error) {
    onError(error);
  }
};

const onError = (error: any) => {
  console.error("Error storing language data:", error);
};
// clear states
const onResetLogic = async (
  setEmail: any,
  setPassword: any,
  setIsRemember: any,
  setIsEnableBiometrics: any,
  storage:any,
) => {
  setEmail("");
  setPassword("");
  setIsRemember(false);
  setIsEnableBiometrics(false);
  await storage.setItem("biometrics", "false");
};

const saveUserLogic = async (
  email: string,
  isRemember: boolean,
  pass: string,
  storage: any,
  setGenericPassword: (username: string, password: string) => Promise<void>
) => {
  if (isRemember) {
    const username = email;
    const password = pass;
    const eNcryptUserName = eNcryptData(username, SECURE_USER_KEY);
    const eNcryptPassWord = eNcryptData(password, SECURE_PASSWORD_KEY);
    await setGenericPassword(eNcryptUserName.toString(), eNcryptPassWord.toString());
    await storage.setItem("isRemember", "true");
  } else {
    const username = email;
    const password = pass;
    const eNcryptUserName = eNcryptData(username, SECURE_USER_KEY);
    const eNcryptPassWord = eNcryptData(password, SECURE_PASSWORD_KEY);
    await setGenericPassword(eNcryptUserName.toString(), eNcryptPassWord.toString());
  }
};

const removeUserLogic = async (
  credentials: boolean | UserCredentials,
  resetGenericPassword: () => Promise<void>,
  onErrorUser: any
) => {
  try {
    if (credentials) {
      await resetGenericPassword();
    } else {
    }
  } catch (error) {
    onErrorUser(error);
  }
};

const getRememberStoreLogic = (
  storage: any,
  setSelectedOrg: any,
  setSelectedRoom: any,
  setSelectedChildRoom: any,
  setIsRememberStore: any
) => {
  storage.getItem("dataStoreSave").then((res: any) => {
    let data = JSON.parse(res);
    if (data) {
      setSelectedOrg(data.orgId);
      setSelectedRoom(data?.stockroomId);
      setSelectedChildRoom(data?.child);
      setIsRememberStore(true);
    } else {
      setIsRememberStore(false);
    }
  });
};
const applyPushNotification = async (
  userId: string,
  dispatch: (arg0: any) => void,
  storage: any,
) => {
  dispatch(
    pushNotificationAction(
      userId,
      true,
      true,
      true,
      true,
      async (data: boolean) => {
        if (data) {
          await storage.setItem(
            "show_notification_modal",
            JSON.stringify(true)
          );
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
        } else {
        }
      }
    )
  );
};

const saveStoreLogic = async (
  storage: any,
  EncryptedStorage:any,
  selectedRoomChild: any,
  _selectedStoreRoom: any,
  selectedRoom: any,
  selectedOrg: any,
  _selectedStoreOrg: any,
  dispatch: any,
  setTokenUser: any,
  setSelectedOrgandStockRoom: any,
  getOrgDetails: any,
  getUserPrivilege: any,
  getStockroomDetail: any,
  setStockroomDetail: any,
  isRememberStore: boolean,
  token: string,
  getReceiveHeaderKPIs: any
) => {
  const data = {
    stockroomId:
      selectedRoomChild != null && selectedRoomChild != -1
        ? _selectedStoreRoom()?.childStockroom[selectedRoomChild]?.id
        : selectedRoom,
    orgId: selectedOrg,
  };
  const details = {
    selectedStockRoom:
      selectedRoomChild != null && selectedRoomChild != -1
        ? _selectedStoreRoom()?.childStockroom[selectedRoomChild]
        : _selectedStoreRoom(),
    selectedOrg: _selectedStoreOrg(),
  };
  await dispatch(setTokenUser(token, JSON.stringify(data)));
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
  await dispatch(getOrgDetails());
  await dispatch(getUserPrivilege());
  await dispatch(getStockroomDetail());
  await dispatch(getReceiveHeaderKPIs());
  await storage.setItem("org", JSON.stringify(data));
  await EncryptedStorage.setItem("orgDetails", JSON.stringify(details));
  const dataStoreSave = {
    stockroomId: selectedRoom,
    orgId: selectedOrg,
    child: selectedRoomChild,
  };
  if (isRememberStore) {
    await storage.setItem("dataStoreSave", JSON.stringify(dataStoreSave));
  } else {
    await storage.removeData("dataStoreSave");
  }
};

export {
  loginLogic,
  changeLanguageLogic,
  onResetLogic,
  saveUserLogic,
  removeUserLogic,
  getRememberStoreLogic,
  saveStoreLogic,
  applyPushNotification,
};
