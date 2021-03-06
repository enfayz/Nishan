import { TDataType, TData } from '@nishans/types';
import { NishanArg, RepositionParams, FilterTypes, UpdateTypes, Logger } from '../types';
import { Operation, warn, positionChildren, iterateAndUpdateChildren, iterateAndGetChildren, iterateAndDeleteChildren } from "../utils";
import Operations from "./Operations";
import colors from "colors";

interface IterateOptions<T>{
  child_type: TDataType,
  child_ids: string[] | keyof T,
  multiple?: boolean,
}

interface IterateAndGetOptions<T, C> extends IterateOptions<T>{
  container: C
}

interface IterateAndUpdateOptions<T, C> extends IterateOptions<T>{
  manual?:boolean
  container?: C
}

interface IterateAndDeleteOptions<T> extends IterateOptions<T>{
  child_path?: keyof T,
  manual?:boolean
}

/**
 * A class to update and control data specific stuffs
 * @noInheritDoc
 */

export default class Data<T extends TData> extends Operations {
  id: string;
  type: TDataType;
  init_cache = false;
  protected logger: Logger;

  constructor(arg: NishanArg & { type: TDataType }) {
    super(arg);
    this.type = arg.type;
    this.id = arg.id;
    this.init_cache = false;
    this.logger = arg.logger === false ? false : function (method, subject, id) {
      console.log(`${colors.red(method)} ${colors.green(subject)} ${colors.blue(id)}`);
    };
  }

  protected getLastEditedProps() {
    return { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: this.user_id }
  }

  protected updateLastEditedProps(data?:TData){
    const target = data ?? this.getCachedData() as any;
    target.last_edited_time = Date.now();
    target.last_edited_by_table = "notion_user";
    target.last_edited_by_id = this.user_id;
  }

  /**
   * Get the cached data using the current data id
   */
  getCachedData() {
    const data = this.cache[this.type].get(this.id);
    if ((data as any).alive === false)
      warn(`${this.type}:${this.id} has been deleted`);
    return data as T;
  }

  async updateCachedData(){
    await this.updateCacheManually([[this.id, this.type]])
  }

  /**
   * Delete the cached data using the id
   */
  protected deleteCachedData() {
    this.cache[this.type].delete(this.id);
  }

  /**
   * Adds the passed block id in the child container array of parent
   * @param $block_id id of the block to add
   * @param arg
   * @returns created Operation and a function to update the cache and the class data
   */
  protected addToChildArray(parent: TData, position: RepositionParams) {
    this.stack.push(positionChildren({ logger: this.logger, child_id: this.id, position, parent, parent_id: this.id, parent_type: this.type }))
  }

  /**
   * Update the cache of the data using only the passed keys
   * @param arg
   * @param keys
   */
  updateCacheLocally(arg: Partial<T>, keys: ReadonlyArray<(keyof T)>, appendToStack?: boolean) {
    appendToStack = appendToStack ?? true
    const parent_data = this.getCachedData(), data = arg;

    Object.entries(arg).forEach(([key, value])=>{
      if(keys.includes(key as keyof T))
        parent_data[key as keyof T] = value;
    })

    this.logger && this.logger("UPDATE", this.type as any, this.id)
    if(appendToStack)
      this.stack.push(
        Operation[this.type].update(this.id,this.type === "user_settings" ? ["settings"] : [], data)
      );
  }

  protected async initializeCacheForThisData() {
    if (!this.init_cache) {
      await this.initializeCacheForSpecificData(this.id, this.type)
      this.init_cache = true;
    }
  }

  protected async deleteIterate<TD>(args: FilterTypes<TD>, options: IterateAndDeleteOptions<T>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD) => void | Promise<any>) {
    await this.initializeCacheForThisData()
    return  await iterateAndDeleteChildren<T, TD>(args, transform, {
      parent_id: this.id,
      parent_type: this.type,
      ...this.getProps(),
      ...options
    }, cb);
  }

  protected async updateIterate<TD, RD, C = any>(args: UpdateTypes<TD, RD>, options: IterateAndUpdateOptions<T, C>, transform: ((id: string) => TD | undefined), cb?: (id: string, data: TD, updated_data: RD, container: C) => any) {
    await this.initializeCacheForThisData()
    return await iterateAndUpdateChildren<T, TD, RD, C>(args, transform, {
      parent_type: this.type,
      parent_id: this.id,
      ...this.getProps(),
      ...options
    }, cb);
  }

  protected async getIterate<RD, C>(args: FilterTypes<RD>, options: IterateAndGetOptions<T, C>, transform: ((id: string) => RD | undefined), cb?: (id: string, data: RD, container: C) => any) {
    await this.initializeCacheForThisData()
    return await iterateAndGetChildren<T, RD, C>(args, transform, {
      parent_id: this.id,
      parent_type: this.type,
      ...this.getProps(),
      ...options,
    }, cb);
  }

  getProps() {
    return {
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache,
      logger: this.logger,
      stack: this.stack
    }
  }
}