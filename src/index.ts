import * as m from "mithril";
import "./styles/app.less"
import "bulma/css/bulma.css";
import {ItemListView} from "./views/ItemListView";
import {ItemModelListView} from "./views/ItemModelListView";

export interface Page<T> {
    content:T[];
    number:number;
    size:number;
    first:boolean;
    last:boolean;
    totalPages:number;
}

export interface DomainObject
{
    id:number;
    type:string;
}

export interface Item extends DomainObject
{
    itemModel:ItemModel | undefined;
    serial:string;
}

export interface ItemModel extends DomainObject
{
    itemType:string | undefined;
    name:string;
    baseCost:number;
}

export interface ItemType
{
    key:string;
    name:string;
}

(async function init()
{
    const itemTypePromise = m.request({url:"http://localhost:3000/item-type", method:"get"})
        .then(res => res as ItemType[]);
    
    m.route(document.getElementById("content") as Element, "/models/1", {
        "/models/:key": new ItemModelListView(itemTypePromise),
        "/items/:key": new ItemListView(itemTypePromise),
    });
    
    m.render(document.getElementById("nav") as Element, m(".navbar-brand", [
        m("a.navbar-item", m("h1.subtitle", "OSLRP Admin")),
        m("a[href=/models/1].navbar-item", {oncreate: m.route.link}, "Models"),
        m("a[href=/items/1].navbar-item", {oncreate: m.route.link}, "Items"),
        m("a[href=/mods/1].navbar-item", {oncreate: m.route.link}, "Mods"),
        
        // m("a.navbar-burger", [
        //     m("span", "Models"),
        //     m("span", "Items"),
        //     m("span", "Mods"),
        // ])
    ]));
})();