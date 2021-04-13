import {
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { ReactElement } from "react";
import useTask from "../context/TaskContext";

interface Props {}

export default function Tasks({}: Props): ReactElement {
	// --- hooks ---
	// tasks
	const { tasks } = useTask();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Tasks</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{tasks.map((task) => (
					<IonItemSliding>
						<IonItemOptions side="start">
							<IonItemOption onClick={() => console.log("favorite clicked")}>
								1 day
							</IonItemOption>
							<IonItemOption
								color="secondary"
								onClick={() => console.log("favorite clicked")}
							>
								1 week
							</IonItemOption>
							<IonItemOption
								color="tertiary"
								onClick={() => console.log("favorite clicked")}
							>
								Later
							</IonItemOption>
							<IonItemOption
								color="danger"
								onClick={() => console.log("share clicked")}
							>
								Undo
							</IonItemOption>
						</IonItemOptions>

						<IonItem>
							<IonLabel>{task.text}</IonLabel>
						</IonItem>

						<IonItemOptions side="end">
							<IonItemOption onClick={() => console.log("unread clicked")}>
								Unread
							</IonItemOption>
						</IonItemOptions>
					</IonItemSliding>
				))}
			</IonContent>
		</IonPage>
	);
}
