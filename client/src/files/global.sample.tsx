import membersFile from "./members.json";
import albumsFile from "./albums.json";
import categoriesFile from "./categories.json";
import benefitsFile from "./benefits.json";
export default {
  ERA_DEFAULT_VALUE: albumsFile[0].code,
  ALBUM_DEFAULT_VALUE: albumsFile[0].name,
  CATEGORY_DEFAULT_VALUE: categoriesFile[0].name,
  MEMBERS_DEFAULT_VALUE: membersFile.map((_member) => _member.name),
  BENEFITS_DEFAULT_VALUE: [benefitsFile[0].name],
  POSITION_DEFAULT_VALUE: "/",
  DISPLAY_DEFAULT_VALUE: "0",
  DATABASE_NAME: "YOURDB",
  DATABASE_VERSION: 1,
  STORAGE_NAME: "cards",
  OPTION_DEFAULT_VALUE: "all",
};
