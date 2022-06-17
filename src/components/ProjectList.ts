import Main from "../components/MainProject"
import { stateProject } from "../state/state"
import { Project, Status } from "../models/Project"
    export class ProjectList extends Main<HTMLElement> {
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

