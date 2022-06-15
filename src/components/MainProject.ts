namespace App {
    export abstract class MainProject<T extends HTMLElement> {
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
}