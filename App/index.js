import "react-native-reanimated";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import NewRelic from 'newrelic-react-native-agent';
import * as appVersion from './package.json';
import {Platform} from 'react-native';

let appToken;
if (Platform.OS === 'ios') {
    appToken = 'AAa0f77b6bc8d5f330c3f8f1088754fd281527633c-NRMA';
} else {
    appToken = 'AA2148acc1e0cfbcbb2eaa631e0149ffe1b6a025f9-NRMA';
}

const agentConfiguration = {
  analyticsEventEnabled: true,
  crashReportingEnabled: true,
  interactionTracingEnabled: true,
  networkRequestEnabled: true,
  networkErrorRequestEnabled: true,
  httpResponseBodyCaptureEnabled: true,
  loggingEnabled: true,
  logLevel: NewRelic.LogLevel.INFO,
  webViewInstrumentation: true,
};


NewRelic.startAgent(appToken,agentConfiguration);
NewRelic.setJSAppVersion(appVersion.version);
AppRegistry.registerComponent(appName, () => App);