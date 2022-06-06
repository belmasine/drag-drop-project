class FormInput {
    templateInput: HTMLTemplateElement;
    divOutput: HTMLElement;
    form: HTMLFormElement;

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
        this.joinTo();
    }

    private joinTo() {
        this.divOutput.insertAdjacentElement("afterbegin", this.form);
    }
}

const formInput = new FormInput();

