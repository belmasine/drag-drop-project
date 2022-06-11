type allowedTypes = [string, string, number] | void;
enum Status { Active, Finished };

abstract class MainProject<T extends HTMLElement> {
    templateInput: HTMLTemplateElement;
    divOutput: HTMLElement;
    element: T;
    constructor(id: string, targetId: string, elementId: string) {
        this.templateInput = document.getElementById(id)! as HTMLTemplateElement;
        this.divOutput = document.getElementById(targetId)! as HTMLElement;
        //deep copy
        const copyTemplateInput = document.importNode(
            this.templateInput.content,
            true
        );
        this.element = copyTemplateInput.firstElementChild as T;
        this.element.id = elementId;
    }
    abstract joinTo(): any;
}

function Bounder(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}
interface Validator {
    value: string | number;
    required?: boolean;
    min?: number;
    max?: number;
    positive?: boolean;
}

function validate(validInput: Validator) {
    let isValid = true;
    if (validInput.required) {
        isValid = isValid && !!validInput.value.toString().trim().length;
    }
    if (validInput.positive) {
        isValid = isValid && validInput.value > 0;
    }
    if (validInput.min) {
        isValid = isValid && validInput.value > validInput.min;
    }
    if (validInput.max) {
        isValid = isValid && validInput.value < validInput.max;
    }

    return isValid;
}

class Project {
    constructor(
        public title: string,
        public description: string,
        public people: number,
        public status: Status
    ) { }
}

class FormInput extends MainProject<HTMLFormElement> {

    formInputs: {
        title: HTMLInputElement;
        description: HTMLInputElement;
        people: HTMLInputElement;
    };

    constructor() {
        super("form-input", "app", "user-input");

        this.formInputs = {
            title: <HTMLInputElement>this.element.querySelector("#title"),
            description: <HTMLInputElement>this.element.querySelector("#description"),
            people: <HTMLInputElement>this.element.querySelector("#people"),
        };

        this.element.addEventListener("submit", this.handleSubmit);

        this.joinTo();
    }

    joinTo() {
        this.divOutput.insertAdjacentElement("afterbegin", this.element);
    }

    private getDataInputs(): allowedTypes {
        const inputs = Object.values(this.formInputs).map((input) => input.value);
        const [title, description, people] = inputs;
        const titleValidator: Validator = {
            value: title,
            required: true,
        };
        const descriptionValidator: Validator = {
            value: description,
            required: true,
        };
        const peopleValidator: Validator = {
            value: +people,
            required: true,
            positive: true,
            min: 1,
            max: 5,
        };

        if (
            !validate(titleValidator) ||
            !validate(descriptionValidator) ||
            !validate(peopleValidator)
        ) {
            return;
        }

        return [title, description, +people];
    }

    @Bounder
    private handleSubmit(e: Event) {
        e.preventDefault();
        const result = this.getDataInputs();
        if (result !== undefined) {
            const [title, description, people] = result;
            stateProject.addProject(title, description, people);
            this.reset();
            console.log('stateProject', stateProject)
        }
        // ajouter projects ici
    }

    private reset() {
        this.formInputs.title.value = "";
        this.formInputs.description.value = "";
        this.formInputs.people.value = "";
    }
}

type Listener<T> = (items: T[]) => void;
class State<T> {
    listeners: Listener<T>[] = []
    constructor() {
    }

    addListener(l: Listener<T>) {
        this.listeners.push(l);
    }
}
class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

     constructor() {
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

class ProjectList extends MainProject<HTMLElement> {
    registeredProjects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        super("project-list", "app", `${type}-projects`);
        this.joinTo();
        this.renderSection();
        stateProject.addListener((projs: Project[]) => {
            const filteredProjects = projs.filter(proj => {
                if (this.type === 'active') {
                    return proj.status === Status.Active;
                }

                return proj.status === Status.Finished
            })
            this.registeredProjects = filteredProjects;
            this.showProjects()
        })
    }
    joinTo() {
        this.divOutput.insertAdjacentElement("beforeend", this.element);
    }

    private showProjects() {
        const projectElements = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        projectElements.innerHTML = '';
        for (const proj of this.registeredProjects) {
            const liItem = document.createElement('li');
            liItem.textContent = proj.title;
            projectElements.appendChild(liItem);
        }
    }

    private renderSection() {
        const idList = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = idList;
        this.element.querySelector("h2")!.textContent = this.type + " projects ";
    }
}

const stateProject = ProjectState.getInstance();
const formInput = new FormInput();
const projFinished1 = new ProjectList("active");
const projFinished = new ProjectList("finished");
