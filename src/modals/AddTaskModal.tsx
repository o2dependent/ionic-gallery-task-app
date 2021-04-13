import React, { ReactElement, useState } from "react";
import {
	IonButton,
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonFabList,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonModal,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { add, clipboardOutline, clipboardSharp } from "ionicons/icons";
import useTask, { TaskTypes } from "../context/TaskContext";

interface Props {}

export default function AddTaskModal({}: Props): ReactElement {
	// --- hooks ---
	// state
	const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
	const [taskText, setTaskText] = useState<string>("");
	const [taskType, setTaskType] = useState<TaskTypes>("Tasks");
	// tasks
	const { addTask } = useTask();

	// --- functions ---
	// reset modal
	const resetModal = () => {
		setIsAddTaskOpen(false);
		setTaskText("");
	};

	return (
		<>
			{/* camera fab */}
			<IonFab vertical="bottom" horizontal="start" slot="fixed">
				<IonFabButton>
					<IonIcon ios={add} md={add} />
				</IonFabButton>
				<IonFabList side="top">
					<IonFabButton onClick={() => setIsAddTaskOpen(true)}>
						<IonIcon ios={clipboardOutline} md={clipboardSharp} />
					</IonFabButton>
				</IonFabList>
			</IonFab>
			{/* add photo modal */}
			<IonModal isOpen={isAddTaskOpen}>
				<IonContent>
					<IonToolbar color="none">
						<IonButtons slot="start">
							<IonButton
								onClick={resetModal}
								color="danger"
								fill="clear"
								expand="full"
								slot="start"
							>
								Cancel
							</IonButton>
						</IonButtons>
						<IonTitle>Add new task</IonTitle>
						<IonButtons style={{ margin: "1rem" }} slot="end">
							<IonButton
								onClick={async () => {
									try {
										await addTask(taskText, taskType);
										resetModal();
									} catch (err) {
										console.error(err);
									}
								}}
								color="primary"
								fill="clear"
								expand="block"
								slot="end"
							>
								Save
							</IonButton>
						</IonButtons>
					</IonToolbar>
					<IonItem color="none">
						<IonLabel position="floating">Text</IonLabel>
						<IonInput
							value={taskText}
							onIonChange={(e) => setTaskText(e?.detail?.value!)}
						/>
					</IonItem>
					{/* <IonItem color="none">
						<IonLabel position="floating">Type</IonLabel>
						<IonTextarea
							rows={6}
							value={userPhotoDesc}
							onIonChange={(e) => setUserPhotoDesc(e?.detail?.value!)}
						/>
					</IonItem> */}
				</IonContent>
			</IonModal>
		</>
	);
}
