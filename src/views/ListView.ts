import {Children, ClassComponent, Vnode} from "mithril";
import * as m from "mithril";
import {DomainObject, Page} from "../index";

export abstract class ListView<T extends DomainObject> implements ClassComponent
{
    page:Page<T> | undefined;
    loaded:boolean = false;
    pageable:any = {};
    selectedItems:any[] = [];
    
    async fetch()
    {
        this.page = await m.request<Page<T>>({
            method: "get",
            url: this.getUrl() + "?page=" + this.pageable.page + "&size=50"
        });
        this.loaded = true;
    }
    
    selectRow(item:any)
    {
        const index = this.selectedItems.findIndex(selectedItem => item.id == selectedItem.id);
        
        if(index > -1)
        {
            this.selectedItems.splice(index, 1);
        }
        else
        {
            this.selectedItems.push(item);
        }
    }
    
    isSelected(item:any)
    {
        const index = this.selectedItems.findIndex(selectedItem => item.id == selectedItem.id);
        return index > -1;
    }
    
    async handleLammiesButtonClick()
    {
        console.log("lammies", this.selectedItems);
        await m.request("http://localhost:3000/lammies", {method: "post", data: this.selectedItems.map(i => i.id)});
    }
    
    abstract getColumns():string[];
    
    abstract getRowTemplate():(item:T) => (number | string)[];
    
    getUrl():string
    {
        return "http://localhost:3000/" + this.getUrlPath();
    }
    
    abstract getUrlPath():string;
    
    abstract getTitle():string;
    
    oninit(vnode:Vnode):any
    {
        this.pageable.page = (vnode.attrs as any).key - 1;
        this.fetch();
    }
    
    onupdate(vnode:Vnode):any
    {
    
    }
    
    view(vnode:Vnode):Children | void | null
    {
        if(this.page)
        {
            const controls = m(".level",
                m(".level-left", m("h1.subtitle", this.getTitle())),
                m(".level-right", m(`a.button.level-item`, {onclick: this.handleLammiesButtonClick.bind(this), disabled: !this.selectedItems.length}, "Print Lammies")));
            
            const filters = m(".box", m(".field", [
                m('.control', m("input.input[type='text']", {placeholder: 'Filter by definition name or serial'}))
            ]));
            
            const paging = m(".level",
                m(".level-left", m(`a.button.level-item[href=/${this.getUrl()}/${this.page.number}]`, {oncreate: m.route.link, disabled: this.page.first}, "Previous")),
                m(".level-right", m(`a.button.level-item[href=/${this.getUrl()}/${this.page.number+2}]`, {oncreate: m.route.link, disabled: this.page.last}, "Next")));
            
            const table = m("table.table.is-fullwidth.is-narrow",
                m("thead", m("tr", [m("th"), ...this.getColumns().map(h => m("th", h))])),
                m("tbody", this.page.content.map((r:any) =>
                    m("tr",
                        {
                            onclick: this.selectRow.bind(this, r),
                            class: this.isSelected(r) ? "is-selected" : ""
                        },
                        [
                            m("td", m("input[type='checkbox']", {checked: this.isSelected(r)})),
                            ...this.getRowTemplate()(r).map((t:any) => m("td", t))]))));
            
            return m(".container", controls, filters, table, paging);
        }
        
        return m(".container");
    }
}