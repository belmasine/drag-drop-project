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
    console.log("adjDescriptor", adjDescriptor);
    return adjDescriptor;
}

class FormInput {
    templateInput: HTMLTemplateElement;
    divOutput: HTMLElement;
    form: HTMLFormElement;

    formInputs: {
        title: HTMLInputElement;
        description: HTMLInputElement;
        people: HTMLInputElement;
    };

    constructor() {
        this.templateInput = document.getElementById(
            "form-input"
        )! as HTMLTemplateElement;
        this.divOutput = document.getElementById("app")! as HTMLElement;
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

    private joinTo() {
        this.divOutput.insertAdjacentElement("afterbegin", this.form);
    }

    @Bounder
    private handleSubmit(e: Event) {
        console.log("*******");
        e.preventDefault();

        console.log("formInputs", this.formInputs.title.value);
    }
}

const formInput = new FormInput();
