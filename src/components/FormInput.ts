/// <reference path="./MainProject.ts" />
/// <reference path="../utils/validations.ts" />

namespace App {
    type allowedTypes = [string, string, number] | void;

    export class FormInput extends MainProject<HTMLFormElement> {
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

        @binder
        private handleSubmit(e: Event) {
            e.preventDefault();
            const result = this.getDataInputs();
            if (result !== undefined) {
                const [title, description, people] = result;
                stateProject.addProject(title, description, people);
                this.reset();
            }
        }

        private reset() {
            this.formInputs.title.value = "";
            this.formInputs.description.value = "";
            this.formInputs.people.value = "";
        }
    }
}
