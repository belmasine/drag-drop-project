function Bounder(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    console.log("originalMethod", originalMethod);
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
type allowedTypes = [string, string, number] | void;
type status = "active" | "finished";

abstract class MainProject {
    templateInput: HTMLTemplateElement;
    divOutput: HTMLElement;
    constructor(id: string, targetId: string) {
        this.templateInput = document.getElementById(id)! as HTMLTemplateElement;

        this.divOutput = document.getElementById(targetId)! as HTMLElement;
    }
    abstract joinTo(): any;
}

class ProjectList extends MainProject {
    section: HTMLElement;

    constructor(private type: status) {
        super("project-list", "app");

        // deep copy
        const copyTemplateInput = document.importNode(
            this.templateInput.content,
            true
        );

        this.section = copyTemplateInput.firstElementChild as HTMLElement;
        this.section.id = `${this.type}-projects-list`;

        this.joinTo();
        this.renderSection();
    }
    joinTo() {
        this.divOutput.insertAdjacentElement("beforeend", this.section);
    }

    private renderSection() {
        const idList = `${this.type}-projects-list`;
        this.section.querySelector("ul")!.id = idList;
        this.section.querySelector("h2")!.textContent = this.type + " projects ";
    }
}

class FormInput extends MainProject {
    form: HTMLFormElement;
    formInputs: {
        title: HTMLInputElement;
        description: HTMLInputElement;
        people: HTMLInputElement;
    };

    constructor() {
        super("form-input", "app");
        // deep copy
        const copyTemplateInput = document.importNode(
            this.templateInput.content,
            true
        );
        this.form = copyTemplateInput.firstElementChild as HTMLFormElement;
        this.form.id = "user-input";
        this.formInputs = {
            title: <HTMLInputElement>this.form.querySelector("#title"),
            description: <HTMLInputElement>this.form.querySelector("#description"),
            people: <HTMLInputElement>this.form.querySelector("#people"),
        };

        this.form.addEventListener("submit", this.handleSubmit);

        this.joinTo();
    }

    joinTo() {
        this.divOutput.insertAdjacentElement("afterbegin", this.form);
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

        if (this.getDataInputs() !== undefined) {
            this.reset();
        }
    }

    private reset() {
        this.formInputs.title.value = "";
        this.formInputs.description.value = "";
        this.formInputs.people.value = "";
    }
}

const formInput = new FormInput();
const projLActive = new ProjectList("active");
const projLFinished = new ProjectList("finished");
