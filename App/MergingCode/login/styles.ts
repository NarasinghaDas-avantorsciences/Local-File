import { Platform, StyleSheet } from "react-native";
import { FONTS, COLORS, FONTFAMILY, SIZES } from "../../../Utils/theme";
import { hp, wp } from "../../../Utils/globalFunction";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: { alignItems: "center", justifyContent: "center" },
  emptyText: {
    color: COLORS.lightGray,
    fontFamily: FONTFAMILY.averta_semibold,
    marginTop: wp(8),
  },

  modalHeaderText: {
    ...FONTS.heading,
    color: COLORS.scienceBlue,
    marginBottom: SIZES.tip,
  },
  biometricLogoStyle: {
    resizeMode: "contain"
  },
  biometicContainer: {
    alignContent:"center",
    alignSelf:"center",
    alignItems:"center",
    width:wp(30),
  },
  loginWithBioText: {
    color: COLORS.scienceBlue,
    fontFamily: FONTFAMILY.averta_bold,
    fontSize: FONTS.h1_6,
    alignSelf: "center",
    marginVertical: hp(0.6),
  },
  modalBodyText: {
    ...FONTS.title,
    fontFamily: FONTFAMILY.averta_regular,
    textAlign: "center",
    color: COLORS.black,
    marginVertical: SIZES.radius,
  },
  modalMainButton: {
    width: SIZES.width * 0.9 - SIZES.padding * 2,
    marginTop: SIZES.base,
  },
  modalSecondaryButton: {
    padding: SIZES.padding,
    width: SIZES.width * 0.9 - SIZES.padding * 2,
    alignItems: "center",
  },
  modalSecondaryButtonText: { ...FONTS.title, color: COLORS.gray },
  modalFooterText: {
    ...FONTS.body2,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: SIZES.tip,
  },
  linear: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: hp(5),
    paddingHorizontal: wp(5),
  },
  subContainer: {
    backgroundColor: COLORS.white,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    shadowColor: "rgba(0,0,0,0.15)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 14,
    width: wp(90),
    alignSelf: "center",
  },
  logoStyle: {
    resizeMode: "contain",
    width: wp(82),
    height: hp(6),
    marginVertical: hp(1),
  },
  resetText: {
    color: COLORS.scienceBlue,
    fontFamily: FONTFAMILY.averta_bold,
    fontSize: FONTS.h1_8,
  },
  changeLanguageText: {
    color: COLORS.white,
    fontFamily: FONTFAMILY.averta_semibold,
    fontSize: FONTS.h1_8,
  },
  resetButton: {
    alignSelf: "center",
    marginVertical: hp(3),
  },
  loginButton: {
    paddingVertical: hp(2),
  },
  loginButtonText: {
    fontSize: FONTS.h1_9,
  },
  orgTxtContainerStyle: {
    width: wp(80),
    alignSelf: "center",
    backgroundColor: COLORS.white,
  },
  inputStyle: {
    height: hp(4),
    padding: 0,
    fontSize: FONTS.h1_9,
    color: COLORS.gray,
    left: -wp(2),
    marginRight: wp(4),
    fontFamily: FONTFAMILY.averta_regular,
  },
  inputMainStyle: {
    height: hp(5),
    top: 0,
    borderColor: COLORS.gray,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: hp(1),
  },
  outlinedBtnTextStyle: {
    color: COLORS.gray,
    fontSize: FONTS.h1_9,
  },
  mainBtnText: {
    fontSize: FONTS.h1_9,
  },
  btnWidth: {
    backgroundColor: COLORS.scienceBlue,
    flex: 1,
  },
  outlinedBtnContainerStyle: {
    borderWidth: 0,
    flex: 1,
  },

  bottomSheetContainer: {
    borderTopLeftRadius: hp(1),
    borderTopRightRadius: hp(1),
  },

  headerText: {
    fontSize: FONTS.h2_3,
    fontFamily: FONTFAMILY.averta_bold,
    color: COLORS.doveGray,
    textAlign: "center",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: Platform.OS == "ios" ? hp(4) : 0,
    paddingBottom: Platform.OS == "ios" ? hp(2) : 0,
  },
  closeBtn: {
    padding: 0,
    fontSize: FONTS.h2,
    color: COLORS.blue,
    fontFamily: FONTFAMILY.averta_regular,
  },
  itemMain: {
    borderBottomWidth: 0.4,
    borderBottomColor: COLORS.alto,
    paddingVertical: hp(1.3),
    flexDirection: "row",
  },
  itemTitle: {
    fontFamily: FONTFAMILY.averta_regular,
    fontSize: FONTS.h1_8,
    color: COLORS.abbey,
  },
  listMain: {
    width: "90%",
    alignSelf: "center",
  },
  searchMain: {
    paddingHorizontal: wp(3),
  },
  offlineText: {
    marginTop: hp(5),
    position: "absolute",
    alignSelf: "center",
    width: wp(90),
  },
});
