import extension, { init } from "../../frontEndApi.js";
function File({ item }) {
  //cannot be async
  init("Nato2"); //just add your extension folder name here
  //console.log(extension.run("search")) // use hooks to make work
  //console.log(extension.getStoredInfo(item.id)) //but this is basically just item
  return <>hello world</>;
}
export default File;
