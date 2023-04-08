////////////////////////////////////// Global Requires \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
import { Menu } from "electron";
import * as R from "ramda";
import _ from "lodash";
import { arrayToTree, treeToArray } from "../utils";

////////////////////////////////////// Global Constants \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const isMac = process.platform === "darwin";

////////////////////////////////////// Global Variables \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let defaultTemplate = [];
let template = [];
let window = null;
let clickCallback = null;

////////////////////////////////////// Global Functions \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export function buildMenuFromTemplate(window, template) {
  const menu = Menu.buildFromTemplate(template);
  window.setMenu(menu);
}

/* CREATE MENU */
export function create(win, onClickItem) {
  window = win;
  clickCallback = onClickItem;
  let __template = [
    {
      id: "file",
      parentId: null,
      label: "File",
      submenu: [
        {
          id: "file/new",
          parentId: "file",
          label: "New",
          accelerator: "Ctrl + N",
          click: (menuItem) => clickCallback({...optionsFiltered(menuItem)}),
        },
        {
          id: "file/open",
          parentId: "file",
          label: "Open",
          accelerator: "Ctrl + O",
          click: (menuItem) => clickCallback({...optionsFiltered(menuItem)})
        },
        {
          id: "file/separator-1",
          parentId: "file",
          type: "separator",
        },
        {
          id: "file/save",
          parentId: "file",
          label: "Save",
          accelerator: "Ctrl + S",
          click: (menuItem) => clickCallback({...optionsFiltered(menuItem)})
        },
        {
          id: "file/saveas",
          parentId: "file",
          label: "Save as..",
          accelerator: "Ctrl + Shift + S",
          click: (menuItem) => clickCallback({...optionsFiltered(menuItem)})
        },
        {
          id: "file/separator-2",
          parentId: "file",
          type: "separator",
        },
        {
          id: "file/preferences",
          parentId: "file",
          label: "Preferences",
          click: (menuItem) => onClickItem({...optionsFiltered(menuItem)})
        },
        {
          id: "file/separator-3",
          parentId: "file",
          type: "separator",
        },
        {
          id: "file/quit",
          parentId: "file",
          role: "quit",
        },
      ],
    }
  ];
  template = R.clone(__template);
  defaultTemplate = R.clone(__template);
  buildMenuFromTemplate(window, template); 
}

/* GET ITEM FROM MENU BY ID */
export function getItem(id = null) {
  const array = treeToArray(template);
  return array.find((item) => item.id === id);
}

/* UPDATE ITEM FROM MENU BY ID */
export function updateItem(id = null, item = {}) {
  const array = treeToArray(template);
  const idx = array.findIndex((item) => item.id === id);
  if (idx >= 0) {
    array[idx] = { ...array[idx], ...item };
  }
  const tree = arrayToTree(array);
  buildMenuFromTemplate(window, tree);
}

/* DELETE ITEM FROM MENU BY ID */
export function deleteItem(id = null) {
  const array = treeToArray(template);
  const idx = array.findIndex((item) => item.id === id);
  if (idx >= 0) {
    array.splice(idx, 1);
  }
  const tree = arrayToTree(array);
  buildMenuFromTemplate(window, tree);
}

/* FILTER DATA FROM EVENT CLICK */
function optionsFiltered(menuItem) {
  return {
    id: menuItem.id || null,
    label: menuItem.label || null,
    type: menuItem.type || null,
    checked: menuItem.checked || null,
    role: menuItem.role || null,
    accelerator: menuItem.accelerator || null,
    sublabel: menuItem.sublabel || null,
    toolTip: menuItem.toolTip || null,
    enabled: menuItem.enabled || null,
    visible: menuItem.visible || null,
    acceleratorWorksWhenHidden: menuItem.acceleratorWorksWhenHidden || null,
    registerAccelerator: menuItem.registerAccelerator || null,
    commandId: menuItem.commandId || null,
  };
}
