import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { PhotoContextProvider } from "./context/PhotoContext";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { TaskContextProvider } from "./context/TaskContext";

ReactDOM.render(
	<React.StrictMode>
		<TaskContextProvider>
			<PhotoContextProvider>
				<App />
			</PhotoContextProvider>
		</TaskContextProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Call the element loader after the app has been rendered the first time
defineCustomElements(window);
