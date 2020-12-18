import { warn } from '../utils';

import Data from "./Data";
import SchemaUnit from "./SchemaUnit";

import { ICollection, IPageInput, UpdatableCollectionParam, NishanArg, IPage, FilterTypes, TSchemaUnit, FilterType, UpdateTypes, UpdateType, } from "../types";
import Page from './Page';

/**
 * A class to represent collection of Notion
 * @noInheritDoc
 */
class Collection extends Data<ICollection> {
  constructor(args: NishanArg) {
    super({ ...args, type: "collection" });
  }

  #getRowPages = () => {
    const page_ids: string[] = [];
    for (let [_, page] of this.cache.block)
      if (page?.type === "page" && page.parent_id === this.id && !page.is_template) page_ids.push(page.id);
    return page_ids;
  }

  /**
   * Update the collection
   * @param opt `CollectionUpdateParam`
   */
  async update(opt: UpdatableCollectionParam, execute?: boolean) {
    const [op, update] = this.updateCacheLocally(opt, ["description", "name", "icon"])
    await this.executeUtil([
      op
    ], [], execute);
    update();
  }

  /**
   * Create multiple templates for the collection
   * @param opts Array of Objects for configuring template options
   */
  async createTemplates(rows: (Omit<Partial<IPageInput>, "type">)[], execute?: boolean) {
    const [ops, sync_records, block_map] = await this.nestedContentPopulate(rows.map((row) => ({ ...row, is_template: true })) as any, this.id, "collection");
    await this.executeUtil(ops, sync_records, execute);
    return block_map;
  }

  /**
   * Get a single template page of the collection
   * @param args string id or a predicate function
   * @returns Template page object
   */
  async getTemplate(args?: FilterType<IPage>) {
    return (await this.getTemplates(typeof args === "string" ? [args] : args, false))[0]
  }

  /**
   * Get multiple template pages of the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   * @returns An array of template pages object
   */
  async getTemplates(args?: FilterTypes<IPage>, multiple?: boolean) {
    return (await this.filterIterate<IPage>(args, this.getCachedData()?.template_pages ?? [], multiple ?? true, "Page", (page_id) => this.cache.block.get(page_id) as IPage)).map(id => new Page({ ...this.getProps(), id }))
  }

  async updateTemplate(args: UpdateType<IPage, Omit<IPageInput, "type">>, execute?: boolean) {
    return (await this.updateTemplates(typeof args === "function" ? args : [args], execute, false))[0]
  }

  async updateTemplates(args: UpdateTypes<IPage, Omit<IPageInput, "type">>, execute?: boolean, multiple?: boolean) {
    return (await this.updateItems<IPage, Omit<IPageInput, "type">>(args, this.getCachedData()?.template_pages ?? [], "Page", execute, multiple)).map(block_id => new Page({ ...this.getProps(), id: block_id }));
  }

  /**
   * Delete a single template page from the collection
   * @param args string id or a predicate function
   */
  async deleteTemplate(args?: FilterType<IPage>, execute?: boolean) {
    return await this.deleteTemplates(typeof args === "string" ? [args] : args, execute, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deleteTemplates(args?: FilterTypes<IPage>, execute?: boolean, multiple?: boolean) {
    await this.deleteItems<IPage>(args, execute, multiple)
  }

  /**
   * Add rows of data to the collection block
   * @param rows
   * @returns An array of newly created page objects
   */
  async createPages(rows: Omit<IPageInput, "type">[], execute?: boolean) {
    const [ops, sync_records, block_map] = await this.nestedContentPopulate(rows.map((row) => ({ ...row, is_template: false })) as any, this.id, "collection")
    await this.executeUtil(ops, sync_records, execute);
    return block_map;
  }

  async getPage(arg?: FilterType<IPage>) {
    return (await this.getPages(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getPages(args?: FilterTypes<IPage>, multiple?: boolean) {
    return (await this.getCustomItems<IPage>(this.#getRowPages(), "Page", (id) => this.cache.block.get(id) as IPage, args, multiple)).map((id) => new Page({ ...this.getProps(), id }));
  }

  async updatePage(args: UpdateType<IPage, Omit<IPageInput, "type">>, execute?: boolean) {
    return (await this.updatePages(typeof args === "function" ? args : [args], execute, false))[0]
  }

  async updatePages(args: UpdateTypes<IPage, Omit<IPageInput, "type">>, execute?: boolean, multiple?: boolean) {
    return (await this.updateItems<IPage, Omit<IPageInput, "type">>(args, this.#getRowPages(), "Page", execute, multiple)).map(block_id => new Page({ ...this.getProps(), id: block_id }));
  }

  async deletePage(args?: FilterType<IPage>, execute?: boolean) {
    return await this.deletePages(typeof args === "string" ? [args] : args, execute, false);
  }

  /**
   * Delete multiple template pages from the collection
   * @param args string of ids or a predicate function
   * @param multiple whether multiple or single item is targeted
   */
  async deletePages(args?: FilterTypes<IPage>, execute?: boolean, multiple?: boolean) {
    await this.initializeCache();
    await this.deleteCustomItems<IPage>(this.#getRowPages(), "Page", args, execute, multiple)
  }

  /**
   * Create multiple new columns in the collection schema
   * @param args array of Schema creation properties
   * @returns An array of SchemaUnit objects representing the columns
   */
  async createSchemaUnits(args: TSchemaUnit[], execute?: boolean) {
    const results = this.createSchemaUnitMap(), data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index], schema_id = arg.name.toLowerCase().replace(/\s/g, '_');
      if (!data.schema[schema_id]) {
        data.schema[schema_id] = arg;
        results[arg.type].push(new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }) as any);
        this.logger && this.logger("CREATE", "SchemaUnit", schema_id);
      } else
        warn(`Collection:${this.id} already contains SchemaUnit:${schema_id}`)
    };

    await this.executeUtil([this.updateOp([], { schema: data.schema })], [this.id], execute);
    return results;
  }

  async getSchemaUnit(arg?: FilterType<(TSchemaUnit & { key: string })>) {
    return (await this.getSchemaUnits(typeof arg === "string" ? [arg] : arg, false))
  }

  /**
   * Return multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async getSchemaUnits(args?: FilterTypes<(TSchemaUnit & { key: string })>, multiple?: boolean) {
    const schema_unit_map = this.createSchemaUnitMap(), data = this.getCachedData(), container: string[] = Object.keys(data.schema) ?? [];
    (await this.getCustomItems<TSchemaUnit & { key: string }>(container, "SchemaUnit", (schema_id) => ({ ...data.schema[schema_id], key: schema_id }), args, multiple)).map(schema_id => schema_unit_map[data.schema[schema_id].type].push(new SchemaUnit({ ...this.getProps(), id: this.id, schema_id }) as any))
    return schema_unit_map;
  }

  /**
   * Update and return a single column from the collection schema
   * @param args schema_id string and schema properties tuple
   * @returns A SchemaUnit object representing the column
   */
  async updateSchemaUnit(arg: UpdateType<TSchemaUnit & { key: string }, Partial<TSchemaUnit>>, execute?: boolean) {
    return (await this.updateSchemaUnits(typeof arg === "function" ? arg : [arg], execute, false))
  }

  /**
   * Update and return multiple columns from the collection schema
   * @param args schema_id string and schema properties array of tuples
   * @returns An array of SchemaUnit objects representing the columns
   */
  async updateSchemaUnits(args: UpdateTypes<TSchemaUnit & { key: string }, Partial<TSchemaUnit>>, execute?: boolean, multiple?: boolean) {
    const results = this.createSchemaUnitMap(), data = this.getCachedData(), schema_ids = Object.keys(data.schema);
    await this.updateIterate<Partial<TSchemaUnit>, TSchemaUnit & { key: string }>(args, schema_ids, multiple ?? true, (schema_id) => {
      return { ...data.schema[schema_id], key: schema_id }
    }, (schema_id, schema_data) => {
      data.schema[schema_id] = { ...data.schema[schema_id], ...schema_data } as TSchemaUnit;
      results[data.schema[schema_id].type].push(new SchemaUnit({ schema_id, ...this.getProps(), id: this.id }) as any)
    });

    await this.executeUtil([this.updateOp([], { schema: data.schema })], [this.id], execute)
    return results;
  }

  /**
   * Delete a single column from the collection schema
   * @param args schema_id string or predicate function
   * @returns A SchemaUnit object representing the column
   */
  async deleteSchemaUnit(args?: FilterType<TSchemaUnit & { key: string }>, execute?: boolean) {
    return (await this.deleteSchemaUnits(typeof args === "string" ? [args] : args, execute, false));
  }

  /**
   * Delete multiple columns from the collection schema
   * @param args schema_id string array or predicate function
   * @returns An array of SchemaUnit objects representing the columns
   */
  async deleteSchemaUnits(args?: FilterTypes<TSchemaUnit & { key: string }>, execute?: boolean, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), container: string[] = Object.keys(data.schema) ?? [];
    await this.filterIterate<TSchemaUnit & { key: string }>(args, container, multiple ?? true, "SchemaUnit", (child_id) => {
      return { ...data.schema[child_id], key: child_id }
    }, (id) => {
      delete data.schema[id]
    });
    await this.executeUtil([this.updateOp([], { schema: data.schema })], [this.id], execute)
  }
}

export default Collection;