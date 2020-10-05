import Model from "../../../Core/data/Model.js";
import { BuildMinimalProject } from "./ProjectMixin.js";
export const SchedulerProjectMixin = (base) => {
    class SchedulerProjectMixin extends base {
    }
    return SchedulerProjectMixin;
};
export const BuildMinimalSchedulerProject = (base = Model) => SchedulerProjectMixin(BuildMinimalProject(base));
export class MinimalSchedulerProject extends BuildMinimalSchedulerProject() {
}
//# sourceMappingURL=SchedulerProjectMixin.js.map