export enum Status { Active, Finished };
export class Project {
    constructor(
        public title: string,
        public description: string,
        public people: number,
        public status: Status
    ) { }
}


