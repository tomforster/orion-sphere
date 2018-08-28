import {ListView} from "./ListView";
import {Item} from "../index";

export class ItemListView extends ListView<Item>
{
    getColumns():string[]
    {
        return ["Serial", "Model", "Mod", "Type"];
    }
    
    getRowTemplate():(item:Item) => (number | string)[]
    {
        return (item:Item) => [item.serial, item.itemDefinition && item.itemDefinition.name || "", "",( item.itemDefinition && item.itemDefinition.itemType && item.itemDefinition.itemType.name) || ""];
    }
    
    getUrlPath():string
    {
        return "item";
    }
    
    getTitle():string
    {
        return "Items";
    }
}