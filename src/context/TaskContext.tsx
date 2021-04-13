import React, { createContext, useContext, useState, useEffect } from "react";
import { useCamera } from "@ionic/react-hooks/camera";
import { useFilesystem, base64FromPath } from "@ionic/react-hooks/filesystem";
import { useStorage } from "@ionic/react-hooks/storage";
import { isPlatform } from "@ionic/react";
import {
	Capacitor,
	FilesystemDirectory,
	FilesystemEncoding,
	Plugins,
} from "@capacitor/core";
const { Toast } = Plugins;

// --- ts types ---
// task types
export type TaskTypes = "Big 3" | "Tasks" | "Later";
// photo
export interface Task {
	completed: boolean;
	text: string;
	type: TaskTypes;
	filepath: string;
}

// content interface
export interface I_PhotoContext {
	addTask: (text: string, type: TaskTypes) => void;
	deleteTask: (filePath: string) => void;
	tasks: Task[];
}

// task storage key
const TASK_STORAGE = "tasks";
// create task context
const TaskContext = createContext({} as I_PhotoContext);

// use photo context
export default function useTask() {
	return useContext(TaskContext);
}

export const TaskContextProvider: React.FC = ({ children }) => {
	// --- hooks ---
	// > camera
	const { getPhoto } = useCamera();

	// > storage
	const { get, set } = useStorage();

	// > file system
	const { deleteFile, readFile, writeFile } = useFilesystem();

	// > state
	// photos
	const [tasks, setTasks] = useState<Task[]>([]);

	// > use effect
	useEffect(() => {
		const loadSaved = async () => {
			// get photo string from storage
			const tasksString = await get(TASK_STORAGE);
			// parse photo string
			const tasksInStorage = (tasksString
				? JSON.parse(tasksString)
				: []) as Task[];
			// if not hybrid -> add webview path to photos
			if (!isPlatform("hybrid")) {
				for (let task of tasksInStorage) {
					// read file data from photo path
					try {
						const file = await readFile({
							path: task.filepath,
							directory: FilesystemDirectory.Data,
						});
						task = JSON.parse(file.data);
					} catch (err) {
						console.error(err);
					}
				}
			}
			setTasks(tasksInStorage);
		};
		loadSaved();
	}, [get, readFile]);

	useEffect(() => {
		const setPhotosStorage = async () => {
			// - set storage
			await set(TASK_STORAGE, JSON.stringify(tasks));
		};
		// set photo storage
		setPhotosStorage();
	}, [tasks, set]);

	// --- functions ---

	// > take photo
	const addTask = async (text: string, type: TaskTypes) => {
		// add task to tasks folder
		try {
			// create file name
			const filepath = "/tasks/" + new Date().getTime() + ".txt";
			// create task obj
			const task = {
				text,
				type,
				completed: false,
				filepath,
			};
			// write to tasks folder
			const savedFile = await writeFile({
				path: filepath,
				data: JSON.stringify(task),
				directory: FilesystemDirectory.Data,
				encoding: FilesystemEncoding.UTF8,
			});
			task.filepath = savedFile.uri;
			// add to tasks
			const newTasks = [task, ...tasks];
			setTasks(newTasks);
		} catch (err) {
			console.error(err);
		}
	};

	// // > delete task
	const deleteTask = async (filepath: string) => {
		try {
			// - delete file
			await deleteFile({
				path: filepath,
				directory: FilesystemDirectory.Data,
			});
			// create new photos
			const newTasks = tasks.filter((task) => task.filepath !== filepath);
			// - set new photos arr
			setTasks(newTasks);
		} catch (err) {
			console.error(err);
		}
	};

	// value
	const value = {
		tasks,
		addTask,
		deleteTask,
	};

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
