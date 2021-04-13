import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import Images from "./pages/Images";
import AddPhotoModal from "./modals/AddPhotoModal";
import AddTaskModal from "./modals/AddTaskModal";
import Tasks from "./pages/Tasks";

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId="main">
					<Menu />
					<IonRouterOutlet id="main">
						<Route path="/" exact={true}>
							<Redirect to="/images" />
						</Route>
						<Route path="/images" exact>
							<Images />
						</Route>
						<Route path="/tasks" exact>
							<Tasks />
						</Route>
						<Route path="/page/:name" exact={true}>
							<Page />
						</Route>
					</IonRouterOutlet>
				</IonSplitPane>
			</IonReactRouter>
			<AddPhotoModal />
			<AddTaskModal />
		</IonApp>
	);
};

export default App;
