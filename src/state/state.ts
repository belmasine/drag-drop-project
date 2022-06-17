import { Project, Status } from "../models/Project"

type Listener<T> = (items: T[]) => void;
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(l: Listener<T>) {
        this.listeners.push(l);
    }
}
class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(t: string, d: string, n: number) {
        const proj = new Project(t, d, n, Status.Active);
        this.projects.push(proj);
        for (const listener of this.listeners) {
            listener(this.projects.slice());
        }
    }
}
export const stateProject = ProjectState.getInstance();

