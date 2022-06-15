/// <reference path="./decorators/binder.ts" />

/// <reference path="./state/state.ts" />
/// <reference path="./models/Project.ts" />
/// <reference path="./components/FormInput.ts" />
/// <reference path="./components/ProjectList.ts" />

namespace App {
    new FormInput();
    new ProjectList("active");
    new ProjectList("finished");
}
