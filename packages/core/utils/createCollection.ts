import { Schema, TSchemaUnit, IOperation } from "@nishans/types";
import { ICollectionBlockInput, ITView, NishanArg, UpdateCacheManuallyParam } from "../types";
import { parseFormula, createViews, Operation,generateId } from "../utils";
import { slugify } from "./slugify";

export function createCollection(param: ICollectionBlockInput, parent_id: string, props: Omit<NishanArg, "id">) {
  const schema: Schema = {}, collection_id = generateId(param.collection_id), schema_map: Map<string, TSchemaUnit & {property: string}> = new Map();

  param.schema.forEach(opt => {
    const schema_id = slugify(opt.type === "title" ? "Title" : opt.name);
    schema[schema_id] = opt as any;
    const schema_map_value = {...opt, property: schema_id} as any
    schema_map.set(opt.name,  schema_map_value)
    schema_map.set(schema_id, schema_map_value)
  });

  Object.values(schema).forEach((schema_unit)=>{
    if(schema_unit.type === "formula") schema_unit.formula = parseFormula(schema_unit.formula as any, schema_map)
  })

  const [created_view_ops, view_ids, view_map, view_records] = createViews(schema, param.views, collection_id, parent_id, props);
  created_view_ops.unshift(Operation.collection.update(collection_id, [], {
    id: collection_id,
    schema,
    format: {
      collection_page_properties: []
    },
    cover: param?.format?.page_cover ?? "",
    icon: param?.format?.page_icon ?? "",
    parent_id,
    parent_table: 'block',
    alive: true,
    name: param.properties.title
  }));

  return [collection_id, created_view_ops, view_ids, view_map, view_records] as [string, IOperation[], string[], ITView, UpdateCacheManuallyParam]
}