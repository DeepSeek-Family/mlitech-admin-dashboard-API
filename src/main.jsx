import i18next from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import App from "./App.jsx";
import global_en from "./Translation/en/en.global.json";
import global_es from "./Translation/es/es.global.json";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./provider/User.jsx";
import { ConfigProvider } from "antd";

i18next.init({
  interpolation: {
    escapeValue: false,
  },
  lng: "en",
  resources: {
    en: {
      global: global_en,
    },
    es: {
      global: global_es,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3fae6a",
          colorBorder: "#3fae6a",
        },
        components: {
          Input: {
            activeBorderColor: "#3fae6a",
            hoverBorderColor: "#3fae6a",
            activeShadow: "0 0 0 2px rgba(232, 80, 91, 0.1)",
          },
        },
        Button: {
          colorPrimary: "#3fae6a",
        },
      }}
    >
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <UserProvider>
            <App />
          </UserProvider>
          <Toaster />
        </Provider>
      </I18nextProvider>
    </ConfigProvider>
  </React.StrictMode>
);
