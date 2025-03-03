import membersFile from "./members.json";
export default {
    ERA_DEFAULT_VALUE: "TSB",
    CATEGORY_DEFAULT_VALUE: "Korean Albums",
    MEMBERS_DEFAULT_VALUE: membersFile.map(_member => _member.name),
    BENEFITS_DEFAULT_VALUE: ["Original"],
    POSITION_DEFAULT_VALUE: "/",
    DISPLAY_DEFAULT_VALUE: "0"
}