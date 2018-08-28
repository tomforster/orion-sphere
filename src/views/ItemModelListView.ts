import {ListView} from "./ListView";
import {ItemModel} from "../index";

export class ItemModelListView extends ListView<ItemModel>
{
    getColumns():string[]
    {
        return ["Item Type", "Name", "Base Cost"];
    }
    
    getRowTemplate():(item:ItemModel) => (number | string)[]
    {
        return (item:ItemModel) => [item.itemType && item.itemType.name || "", item.name, ""];
    }
    
    getUrlPath():string
    {
        return "item-definition";
    }
    
    getTitle():string
    {
        return "Models";
    }
}